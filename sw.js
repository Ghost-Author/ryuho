const CACHE_NAME = "ryuho-static-1783083597636";
const PRECACHE_URLS = [
  "/ryuho/",
  "/ryuho/archives/",
  "/ryuho/categories/",
  "/ryuho/tags/",
  "/ryuho/about/",
  "/ryuho/search/",
  "/ryuho/atom.xml",
  "/ryuho/sitemap.xml",
  "/ryuho/site.webmanifest",
  "/ryuho/search-index.json",
  "/ryuho/css/style.css",
  "/ryuho/js/main.js",
  "/ryuho/images/avatar.png",
  "/ryuho/images/hero.jpg",
  "/ryuho/2026/06/05/%E6%99%BA%E8%83%BD%E4%BD%93%E4%BA%A7%E5%93%81%E5%88%AB%E5%85%88%E8%BF%BD%E6%B1%82%E5%85%A8%E8%87%AA%E5%8A%A8/",
  "/ryuho/2026/06/05/%E5%92%8CAI%E7%BC%96%E7%A8%8B%E5%8A%A9%E6%89%8B%E5%8D%8F%E4%BD%9C%E7%9A%84%E5%B7%A5%E7%A8%8B%E8%BE%B9%E7%95%8C/",
  "/ryuho/2026/06/05/RAG%E4%B8%8D%E6%98%AF%E6%8A%8A%E8%B5%84%E6%96%99%E5%A1%9E%E8%BF%9B%E5%90%91%E9%87%8F%E5%BA%93/",
  "/ryuho/2026/06/05/AI%E5%8A%9F%E8%83%BD%E4%B8%8A%E7%BA%BF%E5%89%8D%E5%85%88%E5%86%99%E8%AF%84%E6%B5%8B%E9%9B%86/",
  "/ryuho/2026/02/09/%E6%8A%8A%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E5%BD%93%E4%BD%9C%E5%B7%A5%E7%A8%8B%E9%A1%B9%E7%9B%AE%E7%BB%B4%E6%8A%A4/",
  "/ryuho/2026/02/08/%E6%97%A5%E8%AE%B0-2026-02-08/",
  "/ryuho/2026/02/07/%E6%97%A5%E8%AE%B0-2026-02-07/",
  "/ryuho/2026/02/07/hello-world/"
];

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