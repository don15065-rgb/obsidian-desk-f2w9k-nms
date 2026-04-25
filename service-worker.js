const CACHE_NAME = 'nomi-command-v1';
const ASSETS = [
  '/obsidian-desk-f2w9k-nms/',
  '/obsidian-desk-f2w9k-nms/index.html',
  '/obsidian-desk-f2w9k-nms/styles.css',
  '/obsidian-desk-f2w9k-nms/app.js',
  '/obsidian-desk-f2w9k-nms/manifest.json'
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE_NAME).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

self.addEventListener('notificationclick', e => {
  e.notification.close();
  e.waitUntil(clients.openWindow('/'));
});
