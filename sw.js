const CACHE_NAME = "simbox-va09_01_2026_5";

const FILES = [
  "./",
  "./index.html",
  "./Simbox Logo New 4.png"
];

self.addEventListener("install", event => {
  self.skipWaiting(); // activate new SW immediately instead of waiting for old tabs to close
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(FILES))
  );
});

self.addEventListener("activate", event => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.map(key => {
          if(key !== CACHE_NAME){
            return caches.delete(key);
          }
        })
      );
    }).then(() => self.clients.claim()) // take control of already-open pages right away
  );
});

self.addEventListener("fetch", event => {
  if(event.request.mode === "navigate"){
    event.respondWith(
      fetch(event.request, {cache: "no-store"})
        .then(response => {
          return response;
        })
        .catch(() => caches.match("./index.html"))
    );
    return;
  }

  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
