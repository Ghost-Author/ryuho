const CACHE_NAME = "ryuho-static-1785196362518";
const PRECACHE_URLS = [
  "/ryuho/",
  "/ryuho/archives/",
  "/ryuho/categories/",
  "/ryuho/tags/",
  "/ryuho/about/",
  "/ryuho/series/",
  "/ryuho/series/ai-engineering/",
  "/ryuho/series/blog-engineering/",
  "/ryuho/projects/",
  "/ryuho/search/",
  "/ryuho/atom.xml",
  "/ryuho/sitemap.xml",
  "/ryuho/site.webmanifest",
  "/ryuho/search-index.json",
  "/ryuho/css/style.css",
  "/ryuho/js/main.js",
  "/ryuho/images/avatar.png",
  "/ryuho/images/hero.jpg",
  "/ryuho/2026/07/28/%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E7%BB%B4%E6%8A%A4%E4%B8%80%E6%AE%B5%E6%97%B6%E9%97%B4%E5%90%8E%E6%88%91%E4%BF%9D%E7%95%99%E4%BA%86%E4%BB%80%E4%B9%88%E5%88%A0%E6%8E%89%E4%BA%86%E4%BB%80%E4%B9%88/",
  "/ryuho/2026/07/28/AI%E8%BE%85%E5%8A%A9%E5%86%99%E4%BD%9C%E5%A6%82%E4%BD%95%E9%81%BF%E5%85%8D%E7%94%9F%E6%88%90%E6%AD%A3%E7%A1%AE%E4%BD%86%E7%A9%BA%E6%B4%9E%E7%9A%84%E6%96%87%E7%AB%A0/",
  "/ryuho/2026/07/28/%E6%8A%80%E6%9C%AF%E5%8D%9A%E5%AE%A2%E6%9C%80%E5%AE%B9%E6%98%93%E7%A7%AF%E7%B4%AF%E7%9A%84%E4%BA%94%E7%B1%BB%E7%BB%B4%E6%8A%A4%E5%80%BA%E5%8A%A1/",
  "/ryuho/2026/07/28/%E4%B8%BA%E4%BB%80%E4%B9%88%E6%88%91%E6%B2%A1%E6%9C%89%E7%9B%B4%E6%8E%A5%E4%BD%BF%E7%94%A8%E6%88%90%E7%86%9FHexo%E4%B8%BB%E9%A2%98/",
  "/ryuho/2026/07/28/%E6%B2%A1%E6%9C%89%E5%90%8E%E7%AB%AF%E5%8D%9A%E5%AE%A2%E8%BF%98%E8%83%BD%E5%81%9A%E5%88%B0%E5%93%AA%E4%BA%9B%E4%BA%A7%E5%93%81%E5%8C%96%E8%83%BD%E5%8A%9B/",
  "/ryuho/2026/07/28/%E4%B8%AA%E4%BA%BA%E9%A1%B9%E7%9B%AE%E5%A6%82%E4%BD%95%E5%86%99%E5%87%BA%E5%8F%AF%E4%BF%A1%E7%9A%84%E9%A1%B9%E7%9B%AE%E5%A4%8D%E7%9B%98/",
  "/ryuho/2026/07/28/%E4%BB%8E0%E5%88%B049%E9%A1%B9%E6%A3%80%E6%9F%A5-%E8%B4%A8%E9%87%8F%E9%97%A8%E7%A6%81%E6%98%AF%E6%80%8E%E6%A0%B7%E9%80%90%E6%AD%A5%E9%95%BF%E5%87%BA%E6%9D%A5%E7%9A%84/",
  "/ryuho/2026/07/28/%E9%9D%99%E6%80%81%E7%AB%99%E7%82%B9%E7%9A%84SEO%E4%B8%8D%E5%8F%AA%E6%98%AF%E5%8A%A0%E5%87%A0%E4%B8%AAmeta%E6%A0%87%E7%AD%BE/",
  "/ryuho/2026/07/28/%E6%96%87%E7%AB%A0%E7%B3%BB%E5%88%97%E6%A0%87%E7%AD%BE%E5%92%8C%E5%88%86%E7%B1%BB%E5%88%86%E5%88%AB%E8%A7%A3%E5%86%B3%E4%BB%80%E4%B9%88%E9%97%AE%E9%A2%98/",
  "/ryuho/2026/07/28/%E5%A6%82%E4%BD%95%E8%AE%BE%E8%AE%A1%E4%B8%80%E4%B8%AA%E4%B8%8D%E4%BC%9A%E8%B6%8A%E5%86%99%E8%B6%8A%E4%B9%B1%E7%9A%84%E6%8A%80%E6%9C%AF%E5%8D%9A%E5%AE%A2%E4%BF%A1%E6%81%AF%E6%9E%B6%E6%9E%84/",
  "/ryuho/2026/07/28/%E4%B8%BA%E4%BB%80%E4%B9%88%E4%B8%AA%E4%BA%BA%E5%8D%9A%E5%AE%A2%E4%B9%9F%E9%9C%80%E8%A6%81%E5%8F%AF%E8%A7%82%E6%B5%8B%E6%80%A7/",
  "/ryuho/2026/07/28/%E4%B8%80%E4%B8%AA%E5%8F%AF%E9%9D%A0%E7%9A%84%E9%9D%99%E6%80%81%E7%AB%99%E6%90%9C%E7%B4%A2%E7%B4%A2%E5%BC%95%E5%BA%94%E8%AF%A5%E5%8C%85%E5%90%AB%E4%BB%80%E4%B9%88/"
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