// Service worker de Selva Salvaje: guarda el juego para que funcione sin internet.
const CACHE = "selva-salvaje-v2.5.5";
const FILES = ["./", "./index.html", "./manifest.webmanifest", "./peerjs.min.js",
  "./fonts/bungee-latin-400-normal.woff2", "./fonts/barlow-semi-condensed-latin-500-normal.woff2",
  "./fonts/barlow-semi-condensed-latin-600-normal.woff2", "./fonts/barlow-semi-condensed-latin-700-normal.woff2",
  "./icons/icon-192.png", "./icons/icon-512.png"];
self.addEventListener("install", e => { e.waitUntil(caches.open(CACHE).then(c => c.addAll(FILES))); self.skipWaiting(); });
self.addEventListener("activate", e => {
  e.waitUntil(caches.keys().then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))));
  self.clients.claim();
});
// primero la red (para recibir actualizaciones); si no hay internet, la copia guardada
self.addEventListener("fetch", e => {
  if (e.request.method !== "GET") return;
  e.respondWith(fetch(e.request).then(r => { const copy = r.clone(); caches.open(CACHE).then(c => c.put(e.request, copy)); return r; })
    .catch(() => caches.match(e.request).then(r => r || caches.match("./index.html"))));
});
