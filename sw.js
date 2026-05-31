/* Stability-first service worker file.
   This project does NOT register it in script.js because old cached versions caused crashes.
   Keep this file only so old browser references do not 404. */
self.addEventListener("install", (event) => {
  self.skipWaiting();
});

self.addEventListener("activate", (event) => {
  event.waitUntil(
    caches.keys().then((keys) => Promise.all(keys.map((key) => caches.delete(key))))
  );
  self.clients.claim();
});
