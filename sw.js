const APP_VERSION = '2026-04-26-pron-ui-refresh-2';
const CORE_CACHE = `vietnam-class3-core-${APP_VERSION}`;
const DATA_CACHE = `vietnam-class3-data-${APP_VERSION}`;
const AUDIO_CACHE = `vietnam-class3-audio-${APP_VERSION}`;
const IMAGE_CACHE = `vietnam-class3-image-${APP_VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './vietnamese_a1_to_opic_im1_starter.json'
];

async function safePrecache() {
  const cache = await caches.open(CORE_CACHE);
  await Promise.all(
    CORE_ASSETS.map(async (asset) => {
      try {
        const response = await fetch(asset, { cache: 'no-store' });
        if (response.ok) {
          await cache.put(asset, response.clone());
        }
      } catch (error) {
        console.warn('[SW] safePrecache skipped:', asset, error);
      }
    })
  );
}

async function networkFirst(request, cacheName, fallbackUrl) {
  const cache = await caches.open(cacheName);
  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackUrl) {
      return (await caches.match(fallbackUrl)) || (await caches.match('./index.html')) || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request, cacheName) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
    }
    return response;
  } catch {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(CORE_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then(async (response) => {
      if (response && response.ok) {
        await cache.put(request, response.clone());
      }
      return response;
    })
    .catch(() => null);

  if (cached) {
    networkPromise.catch(() => null);
    return cached;
  }

  const fresh = await networkPromise;
  if (fresh) return fresh;

  return new Response('Offline', { status: 503, statusText: 'Offline' });
}

self.addEventListener('install', (event) => {
  event.waitUntil(
    safePrecache().then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keepCaches = new Set([CORE_CACHE, DATA_CACHE, AUDIO_CACHE, IMAGE_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (keepCaches.has(key) ? Promise.resolve() : caches.delete(key)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const path = url.pathname.toLowerCase();

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, CORE_CACHE, './index.html'));
    return;
  }

  if (path.endsWith('.json')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  const isAudio = request.destination === 'audio' || path.endsWith('.mp3') || path.endsWith('.wav') || path.includes('/audio/');
  if (isAudio) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE));
    return;
  }

  const isImage = request.destination === 'image'
    || path.endsWith('.png')
    || path.endsWith('.jpg')
    || path.endsWith('.jpeg')
    || path.endsWith('.svg')
    || path.endsWith('.webp')
    || path.endsWith('.ico');

  if (isImage) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE));
    return;
  }

  const isStatic = path.endsWith('.js') || path.endsWith('.css') || path.endsWith('.webmanifest');
  if (isStatic) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(
    fetch(request).catch(async () => {
      const cached = await caches.match(request);
      if (cached) return cached;
      if (request.mode === 'navigate') {
        return (await caches.match('./index.html')) || new Response('<h1>Offline</h1>', { headers: { 'Content-Type': 'text/html; charset=utf-8' } });
      }
      return new Response('Offline', { status: 503, statusText: 'Offline' });
    })
  );
});
