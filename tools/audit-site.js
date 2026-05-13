#!/usr/bin/env node

const fs = require('fs');
const path = require('path');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');

const requiredFiles = [
  'index.html',
  '404.html',
  'atom.xml',
  'sitemap.xml',
  'robots.txt',
  'site.webmanifest',
  'css/style.css',
  'js/main.js'
];

const checks = [];
const htmlFiles = [];
const publicFiles = new Set();
const publicDirs = new Set();

function readPublic(relativePath) {
  return fs.readFileSync(path.join(publicDir, relativePath), 'utf8');
}

function addCheck(name, pass, detail) {
  checks.push({ name, pass, detail });
}

function includesAll(content, parts) {
  return parts.every((part) => content.includes(part));
}

function toPosix(relativePath) {
  return relativePath.split(path.sep).join('/');
}

function stripTrailingSlash(value) {
  return String(value || '').replace(/\/+$/, '');
}

function getSiteBase(manifest) {
  const startUrl = manifest && manifest.start_url ? String(manifest.start_url) : '/';
  if (!startUrl.startsWith('/')) return '/';
  return startUrl.endsWith('/') ? startUrl : `${startUrl}/`;
}

function pathExists(sitePath, siteBase) {
  let pathname = decodeURIComponent(String(sitePath || '/').split(/[?#]/)[0]);
  if (!pathname.startsWith('/')) pathname = `/${pathname}`;

  if (siteBase !== '/' && pathname === stripTrailingSlash(siteBase)) {
    pathname = '/';
  }

  if (siteBase !== '/' && pathname.startsWith(siteBase)) {
    pathname = `/${pathname.slice(siteBase.length)}`;
  }

  const relativePath = pathname.replace(/^\/+/, '');
  if (!relativePath) return publicFiles.has('index.html');
  if (publicFiles.has(relativePath)) return true;
  if (publicFiles.has(`${stripTrailingSlash(relativePath)}/index.html`)) return true;
  return publicDirs.has(stripTrailingSlash(relativePath));
}

function collectUrls(content) {
  const urls = [];
  const attrPattern = /\s(?:href|src)=["']([^"']+)["']/gi;
  let match;
  while ((match = attrPattern.exec(content)) !== null) {
    urls.push(match[1]);
  }
  return urls;
}

function isSkippableUrl(value) {
  return /^(#|mailto:|tel:|sms:|data:|javascript:)/i.test(value);
}

function toInternalPath(value, siteOrigin, siteBase) {
  if (isSkippableUrl(value)) return null;

  try {
    if (/^https?:\/\//i.test(value)) {
      const parsed = new URL(value);
      if (parsed.origin !== siteOrigin) return null;
      return parsed.pathname;
    }
  } catch (error) {
    return value;
  }

  if (value.startsWith('/')) return value;
  if (siteBase === '/') return `/${value}`;
  return `${siteBase}${value}`;
}

if (!fs.existsSync(publicDir)) {
  console.error('Site audit failed: public directory does not exist. Run npm run build first.');
  process.exit(1);
}

requiredFiles.forEach((file) => {
  addCheck(`required file: ${file}`, fs.existsSync(path.join(publicDir, file)));
});

const manifest = JSON.parse(readPublic('site.webmanifest'));
const siteBase = getSiteBase(manifest);
const indexHtml = readPublic('index.html');
const notFoundHtml = readPublic('404.html');
const robots = readPublic('robots.txt');
const sitemap = readPublic('sitemap.xml');
const sitemapLocations = Array.from(sitemap.matchAll(/<loc>([^<]+)<\/loc>/g)).map((match) => match[1]);
const siteOrigin = sitemapLocations.length ? new URL(sitemapLocations[0]).origin : '';

addCheck(
  'home has core SEO tags',
  includesAll(indexHtml, [
    '<meta name="description"',
    '<meta property="og:title"',
    '<link rel="canonical"',
    '<script type="application/ld+json">'
  ])
);

addCheck('home links web manifest', indexHtml.includes('site.webmanifest'));
addCheck('404 is noindex', notFoundHtml.includes('name="robots" content="noindex, follow"'));
addCheck('robots links sitemap', robots.includes('Sitemap:'));
addCheck('robots sitemap does not duplicate root', !/\/ryuho\/ryuho\//.test(robots));
addCheck('manifest has app identity', Boolean(manifest.name && manifest.short_name && manifest.start_url));
addCheck('manifest has icons', Array.isArray(manifest.icons) && manifest.icons.length >= 2);
addCheck('sitemap has URLs', sitemapLocations.length > 0);

function walk(dir) {
  fs.readdirSync(dir, { withFileTypes: true }).forEach((entry) => {
    const fullPath = path.join(dir, entry.name);
    const relativePath = toPosix(path.relative(publicDir, fullPath));
    if (entry.isDirectory()) {
      publicDirs.add(relativePath);
      walk(fullPath);
      return;
    }
    publicFiles.add(relativePath);
    if (entry.name.endsWith('.html')) {
      htmlFiles.push(fullPath);
    }
  });
}

walk(publicDir);

const leakedFiles = htmlFiles.filter((file) => {
  const content = fs.readFileSync(file, 'utf8');
  return /\bundefined\b|\bnull\b/.test(content);
});

addCheck('html has no undefined/null leaks', leakedFiles.length === 0, leakedFiles.map((file) => path.relative(publicDir, file)).join(', '));

const htmlWithoutCanonical = [];
const htmlWithoutDescription = [];
const htmlWithoutOgUrl = [];
const brokenReferences = [];

htmlFiles.forEach((file) => {
  const content = fs.readFileSync(file, 'utf8');
  const relativeFile = toPosix(path.relative(publicDir, file));
  const is404 = relativeFile === '404.html';

  if (!is404 && !/<link\s+rel=["']canonical["']/i.test(content)) {
    htmlWithoutCanonical.push(relativeFile);
  }

  if (!/<meta\s+name=["']description["']/i.test(content)) {
    htmlWithoutDescription.push(relativeFile);
  }

  if (!is404 && !/<meta\s+property=["']og:url["']/i.test(content)) {
    htmlWithoutOgUrl.push(relativeFile);
  }

  collectUrls(content).forEach((url) => {
    const internalPath = toInternalPath(url, siteOrigin, siteBase);
    if (!internalPath) return;
    if (!pathExists(internalPath, siteBase)) {
      brokenReferences.push(`${relativeFile} -> ${url}`);
    }
  });
});

const sitemapPaths = sitemapLocations.map((loc) => new URL(loc).pathname);
const missingSitemapTargets = sitemapPaths.filter((pathname) => !pathExists(pathname, siteBase));

addCheck('html pages have canonical URLs', htmlWithoutCanonical.length === 0, htmlWithoutCanonical.join(', '));
addCheck('html pages have descriptions', htmlWithoutDescription.length === 0, htmlWithoutDescription.join(', '));
addCheck('html pages have Open Graph URLs', htmlWithoutOgUrl.length === 0, htmlWithoutOgUrl.join(', '));
addCheck('internal links and assets resolve', brokenReferences.length === 0, brokenReferences.slice(0, 8).join(', '));
addCheck('sitemap targets resolve', missingSitemapTargets.length === 0, missingSitemapTargets.join(', '));

const failures = checks.filter((check) => !check.pass);

checks.forEach((check) => {
  const mark = check.pass ? 'PASS' : 'FAIL';
  const detail = check.detail ? ` (${check.detail})` : '';
  console.log(`${mark} ${check.name}${detail}`);
});

if (failures.length) {
  console.error(`Site audit failed: ${failures.length} check(s) failed.`);
  process.exit(1);
}

console.log(`Site audit passed: ${checks.length} checks, ${htmlFiles.length} HTML files scanned.`);
