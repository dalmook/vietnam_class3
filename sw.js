const CACHE_NAME = 'vietnam-class3-v1';
const ASSETS = ['./', './index.html', './styles.css', './app.js', './vietnamese_a1_lessons_1_6_starter.json'];
self.addEventListener('install', (e) => e.waitUntil(caches.open(CACHE_NAME).then((c) => c.addAll(ASSETS))));
self.addEventListener('fetch', (e) => {
  e.respondWith(caches.match(e.request).then((r) => r || fetch(e.request).catch(() => caches.match('./index.html'))));
});
