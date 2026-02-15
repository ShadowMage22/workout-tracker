const CACHE_NAME = 'workout-tracker-v19'; // bump when you deploy
const RUNTIME_CACHE = 'workout-tracker-runtime-v4';
const RUNTIME_CACHE_LIMIT = 60;

const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './js/state-manager.js',
  './js/ui-controller.js',
  './js/media.js',
  './js/timers.js',
  './js/history.js',
  './js/set-tracking.js',
  './app.js',
  './manifest.json',
  './data/workouts.json',
  './icon-192.png',
  './icon-512.png'
];

const OFFLINE_FALLBACK_URL = './index.html';

const APP_SHELL_DESTINATIONS = new Set(['style', 'script', 'manifest']);
// NOTE: we intentionally do NOT include 'document' here; navigations are handled separately.
const APP_SHELL_PATHS = new Set(urlsToCache.map(url => new URL(url, self.location).pathname));

function shouldHandleAppShellAsset(request) {
  const url = new URL(request.url);
  return url.origin === self.location.origin
    && APP_SHELL_PATHS.has(url.pathname)
    && APP_SHELL_DESTINATIONS.has(request.destination);
}

async function trimCache(cacheName, maxEntries) {
  const cache = await caches.open(cacheName);
  const keys = await cache.keys();
  if (keys.length <= maxEntries) return;
  const excess = keys.length - maxEntries;
  const deletions = keys.slice(0, excess).map(key => cache.delete(key));
  await Promise.all(deletions);
}

// Install: precache shell
self.addEventListener('install', (event) => {
  event.waitUntil((async () => {
    const cache = await caches.open(CACHE_NAME);
    // cache: 'reload' forces the browser to bypass HTTP cache for these requests
    await cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
    await self.skipWaiting();
  })());
});

// Activate: delete old caches, take control
self.addEventListener('activate', (event) => {
  event.waitUntil((async () => {
    const keys = await caches.keys();
    await Promise.all(
      keys.map((key) => {
        if (key !== CACHE_NAME && key !== RUNTIME_CACHE) return caches.delete(key);
        return null;
      })
    );
    await self.clients.claim();
  })());
});

// Allow page to request immediate activation
self.addEventListener('message', (event) => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // 1) Navigations: NETWORK-FIRST, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        const networkResponse = await fetch(request);

        // Keep offline fallback fresh in the versioned cache
        const cache = await caches.open(CACHE_NAME);
        await cache.put(OFFLINE_FALLBACK_URL, networkResponse.clone());

        return networkResponse;
      } catch (err) {
        const cached = await caches.match(OFFLINE_FALLBACK_URL);
        return cached || Response.error();
      }
    })());
    return;
  }

  // Let cross-origin requests pass through untouched
  if (!sameOrigin) return;

  // 2) Media: STALE-WHILE-REVALIDATE (cache on demand)
  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith((async () => {
      const cache = await caches.open(RUNTIME_CACHE);
      const cached = await cache.match(request);
      const fetchPromise = fetch(request)
        .then(async (response) => {
          if (response && response.ok) {
            await cache.put(request, response.clone());
            await trimCache(RUNTIME_CACHE, RUNTIME_CACHE_LIMIT);
          }
          return response;
        })
        .catch(() => null);

      return cached || (await fetchPromise) || Response.error();
    })());
    return;
  }

  // 3) App shell assets (js/css/manifest): STALE-WHILE-REVALIDATE
  if (shouldHandleAppShellAsset(request)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);

      const fetchPromise = fetch(request).then(async (response) => {
        const cache = await caches.open(CACHE_NAME);
        await cache.put(request, response.clone());
        return response;
      }).catch(() => null);

      return cached || (await fetchPromise) || Response.error();
    })());
    return;
  }

  // 4) Workout data: NETWORK-FIRST, fallback to cache
  if (url.pathname === new URL('./data/workouts.json', self.location).pathname) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(CACHE_NAME);
          await cache.put(request, response.clone());
        }
        return response;
      } catch (_) {
        const cached = await caches.match(request);
        return cached || Response.error();
      }
    })());
    return;
  }

  // 5) JSON/API/documents: NETWORK-FIRST, fallback to cache
  if (request.destination === 'document' || request.destination === 'json' || url.pathname.endsWith('.json') || url.pathname.startsWith('/api/')) {
    event.respondWith((async () => {
      try {
        const response = await fetch(request);
        if (response && response.ok) {
          const cache = await caches.open(RUNTIME_CACHE);
          await cache.put(request, response.clone());
          await trimCache(RUNTIME_CACHE, RUNTIME_CACHE_LIMIT);
        }
        return response;
      } catch (_) {
        const cached = await caches.match(request);
        return cached || Response.error();
      }
    })());
    return;
  }

  // 6) Other static assets: STALE-WHILE-REVALIDATE
  event.respondWith((async () => {
    const cache = await caches.open(RUNTIME_CACHE);
    const cached = await cache.match(request);

    const fetchPromise = fetch(request)
      .then(async (response) => {
        if (response && response.ok) {
          await cache.put(request, response.clone());
          await trimCache(RUNTIME_CACHE, RUNTIME_CACHE_LIMIT);
        }
        return response;
      })
      .catch(() => null);

    return cached || (await fetchPromise) || Response.error();
  })());
});
