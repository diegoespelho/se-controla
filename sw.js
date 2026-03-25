const CACHE_NAME = "se-controla-v1";
const assets = [
  "./",
  "./index.html",
  "./style.css",
  "./script.js",
  "./favicon.png",
  "./manifest.json",
];

// Instala o Service Worker e armazena os arquivos no cache
self.addEventListener("install", event => {
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => {
      return cache.addAll(assets);
    }),
  );
});

// Responde com os arquivos do cache quando estiver offline
self.addEventListener("fetch", event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    }),
  );
});
