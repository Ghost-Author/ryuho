#!/usr/bin/env node

const fs = require('fs');
const path = require('path');
const sharp = require('sharp');

const root = path.resolve(__dirname, '..');
const publicDir = path.join(root, 'public');
const imageExtensions = new Set(['.jpg', '.jpeg', '.png', '.webp']);
const minBytes = 32 * 1024;

async function optimizeImage(filePath) {
  const ext = path.extname(filePath).toLowerCase();
  const before = fs.statSync(filePath).size;

  if (before < minBytes) return null;

  const image = sharp(filePath, { failOn: 'none' }).rotate();
  let pipeline = image;

  if (ext === '.jpg' || ext === '.jpeg') {
    pipeline = pipeline.jpeg({ quality: 82, progressive: true, mozjpeg: true });
  } else if (ext === '.png') {
    pipeline = pipeline.png({ compressionLevel: 9, adaptiveFiltering: true });
  } else if (ext === '.webp') {
    pipeline = pipeline.webp({ quality: 82 });
  } else {
    return null;
  }

  const tmpPath = `${filePath}.tmp`;
  await pipeline.toFile(tmpPath);

  const after = fs.statSync(tmpPath).size;
  if (after >= before) {
    fs.unlinkSync(tmpPath);
    return null;
  }

  fs.renameSync(tmpPath, filePath);
  return { filePath, before, after };
}

async function walk(dir, optimized) {
  for (const entry of fs.readdirSync(dir, { withFileTypes: true })) {
    const fullPath = path.join(dir, entry.name);
    if (entry.isDirectory()) {
      await walk(fullPath, optimized);
      continue;
    }

    if (!imageExtensions.has(path.extname(entry.name).toLowerCase())) continue;

    try {
      const result = await optimizeImage(fullPath);
      if (result) optimized.push(result);
    } catch (error) {
      console.warn(`Image optimization skipped for ${path.relative(root, fullPath)}: ${error.message}`);
    }
  }
}

async function main() {
  if (!fs.existsSync(publicDir)) {
    console.error('Image optimization failed: public directory does not exist. Run the Hexo build first.');
    process.exit(1);
  }

  const optimized = [];
  await walk(publicDir, optimized);

  const saved = optimized.reduce((total, item) => total + item.before - item.after, 0);
  console.log(`Image optimization complete: ${optimized.length} file(s), ${(saved / 1024).toFixed(1)} KiB saved.`);
}

main().catch((error) => {
  console.error(`Image optimization failed: ${error.message}`);
  process.exit(1);
});
