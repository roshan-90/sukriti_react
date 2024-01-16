// service-worker.js

const CACHE_NAME = "Sukriti-cache-v1";

const urlsToCache = [
  "/",
  "/index.html",
  "/static/css/main.chunk.css",
  "/static/js/bundle.js",
  "/icon.png",
];

self.addEventListener("install", (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => {
      return cache.addAll(urlsToCache);
    })
  );
});

self.addEventListener("fetch", (event) => {
  event.respondWith(
    caches.match(event.request).then((response) => {
      return response || fetch(event.request);
    })
  );
});
