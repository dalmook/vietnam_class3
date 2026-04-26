const APP_VERSION = '2026-04-26-01';
const CORE_CACHE = `vietnam-class3-core-${APP_VERSION}`;
const DATA_CACHE = `vietnam-class3-data-${APP_VERSION}`;
const AUDIO_CACHE = `vietnam-class3-audio-${APP_VERSION}`;
const IMAGE_CACHE = `vietnam-class3-image-${APP_VERSION}`;
const RUNTIME_CACHE = `vietnam-class3-runtime-${APP_VERSION}`;

const CORE_ASSETS = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.webmanifest',
  './vietnamese_a1_to_opic_im1_starter.json',
  './icons/icon.svg'
];

async function safePrecache() {
  const cache = await caches.open(CORE_CACHE);
  await Promise.all(
    CORE_ASSETS.map(async (asset) => {
      try {
        const res = await fetch(asset, { cache: 'no-store' });
        if (!res.ok) {
          console.warn('[SW] precache skipped:', asset, res.status);
          return;
        }
        await cache.put(asset, res.clone());
      } catch (error) {
        console.warn('[SW] precache failed:', asset, error);
      }
    })
  );
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const overflow = keys.length - maxEntries;
  for (let i = 0; i < overflow; i += 1) {
    await cache.delete(keys[i]);
  }
}

async function networkFirst(request, cacheName, fallbackRequest) {
  const cache = await caches.open(cacheName);
  try {
    const fresh = await fetch(request);
    if (fresh && fresh.ok) {
      await cache.put(request, fresh.clone());
    }
    return fresh;
  } catch (error) {
    const cached = await cache.match(request);
    if (cached) return cached;
    if (fallbackRequest) {
      return (await caches.match(fallbackRequest)) || (await caches.match('./index.html'));
    }
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function cacheFirst(request, cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const cached = await cache.match(request);
  if (cached) return cached;

  try {
    const response = await fetch(request);
    if (response && response.ok) {
      await cache.put(request, response.clone());
      if (typeof maxEntries === 'number') {
        await trimCache(cacheName, maxEntries);
      }
    }
    return response;
  } catch (error) {
    return new Response('Offline', { status: 503, statusText: 'Offline' });
  }
}

async function staleWhileRevalidate(request) {
  const cache = await caches.open(RUNTIME_CACHE);
  const cached = await cache.match(request);
  const networkPromise = fetch(request)
    .then((response) => {
      if (response && response.ok) {
        cache.put(request, response.clone());
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
    safePrecache().finally(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  const keep = new Set([CORE_CACHE, DATA_CACHE, AUDIO_CACHE, IMAGE_CACHE, RUNTIME_CACHE]);
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.map((key) => (keep.has(key) ? Promise.resolve() : caches.delete(key)))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  if (event.data?.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const request = event.request;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const pathname = url.pathname.toLowerCase();

  if (request.mode === 'navigate') {
    event.respondWith(networkFirst(request, CORE_CACHE, './index.html'));
    return;
  }

  if (pathname.endsWith('.json')) {
    event.respondWith(networkFirst(request, DATA_CACHE));
    return;
  }

  const isAudio = pathname.includes('/audio/') || pathname.endsWith('.mp3') || pathname.endsWith('.wav');
  if (isAudio) {
    event.respondWith(cacheFirst(request, AUDIO_CACHE, 600));
    return;
  }

  const destination = request.destination;
  const isImage = destination === 'image'
    || pathname.endsWith('.png')
    || pathname.endsWith('.jpg')
    || pathname.endsWith('.jpeg')
    || pathname.endsWith('.svg')
    || pathname.endsWith('.webp')
    || pathname.endsWith('.ico');

  if (isImage) {
    event.respondWith(cacheFirst(request, IMAGE_CACHE, 200));
    return;
  }

  const isStaticAsset = pathname.endsWith('.js') || pathname.endsWith('.css') || pathname.endsWith('.webmanifest');
  if (isStaticAsset) {
    event.respondWith(staleWhileRevalidate(request));
    return;
  }

  event.respondWith(
    caches.match(request).then((cached) => cached || fetch(request).catch(() => caches.match('./index.html')))
  );
});
