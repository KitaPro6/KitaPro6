const CACHE_NAME = 'pwa-cache-v1';
const FILES_TO_CACHE = [
  '/',                   // Startseite
  '/index.html',         // Deine Hauptdatei
  '/manifest.json',      // Manifest
  '/sw.js',              // Service Worker selbst
  // Füge hier alle weiteren wichtigen Dateien ein:
  // '/styles.css',
  // '/dein-script.js',
  // '/dein-logo.png',
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => cache.addAll(FILES_TO_CACHE))
  );
  self.skipWaiting();
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request)
      .then(response => response || fetch(event.request))
      .catch(() => caches.match('/index.html'))
  );
});
