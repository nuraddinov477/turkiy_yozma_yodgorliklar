// Service Worker — Turkiy Korpus PWA
const CACHE = 'turkiy-korpus-v2';
const STATIC = [
  '/',
  '/static/css/style.css',
  '/static/js/main.js',
  '/static/js/api.js',
  '/static/js/data.js',
  '/static/js/i18n.js',
];

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE).then(c => c.addAll(STATIC)).catch(() => {})
  );
  self.skipWaiting();
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys().then(keys =>
      Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k)))
    )
  );
  self.clients.claim();
});

self.addEventListener('fetch', e => {
  const url = new URL(e.request.url);
  // API so'rovlarini cache qilmaymiz
  if (url.pathname.startsWith('/api/') || url.pathname.startsWith('/panel/')) return;

  e.respondWith(
    caches.match(e.request).then(cached => {
      if (cached) return cached;
      return fetch(e.request).then(resp => {
        if (!resp || resp.status !== 200 || resp.type === 'opaque') return resp;
        const clone = resp.clone();
        caches.open(CACHE).then(c => c.put(e.request, clone));
        return resp;
      }).catch(() => caches.match('/'));
    })
  );
});
