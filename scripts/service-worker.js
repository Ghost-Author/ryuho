function ensureSlash(value) {
  const text = String(value || '/');
  return text.endsWith('/') ? text : `${text}/`;
}

hexo.extend.generator.register('service-worker', function (locals) {
  const root = ensureSlash(hexo.config.root || '/');
  const cacheName = `ryuho-static-${Date.now()}`;
  const routes = new Set([
    root,
    `${root}archives/`,
    `${root}categories/`,
    `${root}tags/`,
    `${root}about/`,
    `${root}series/ai-engineering/`,
    `${root}projects/`,
    `${root}search/`,
    `${root}atom.xml`,
    `${root}sitemap.xml`,
    `${root}site.webmanifest`,
    `${root}search-index.json`,
    `${root}css/style.css`,
    `${root}js/main.js`,
    `${root}images/avatar.png`,
    `${root}images/hero.jpg`
  ]);

  locals.posts.sort('-date').limit(12).forEach((post) => {
    routes.add(new URL(post.permalink).pathname);
  });

  const data = `
const CACHE_NAME = ${JSON.stringify(cacheName)};
const PRECACHE_URLS = ${JSON.stringify(Array.from(routes), null, 2)};

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then((cache) => cache.addAll(PRECACHE_URLS))
      .then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys
        .filter((key) => key !== CACHE_NAME)
        .map((key) => caches.delete(key))
      ))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  event.respondWith(
    fetch(request)
      .then((response) => {
        const copy = response.clone();
        if (response.ok && new URL(request.url).origin === self.location.origin) {
          caches.open(CACHE_NAME).then((cache) => cache.put(request, copy));
        }
        return response;
      })
      .catch(() => caches.match(request))
  );
});
`.trim();

  return {
    path: 'sw.js',
    data
  };
});
