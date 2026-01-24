const CACHE_NAME = 'workout-tracker-v9';  // ← Increment this each major update
const RUNTIME_CACHE = 'workout-tracker-runtime-v1';
const urlsToCache = [
  './',
  './index.html',
  './styles.css',
  './app.js',
  './manifest.json',
  './icon-192.png',
  './icon-512.png'
];
const OFFLINE_FALLBACK_URL = './index.html';
const APP_SHELL_DESTINATIONS = new Set(['document', 'style', 'script', 'manifest']);
const APP_SHELL_PATHS = new Set(urlsToCache.map(url => new URL(url, self.location).pathname));

function shouldHandleAppShell(request) {
  if (request.mode === 'navigate') return true;
  const url = new URL(request.url);
  return url.origin === self.location.origin
    && APP_SHELL_PATHS.has(url.pathname)
    && APP_SHELL_DESTINATIONS.has(request.destination);
}

// Install event - cache files
self.addEventListener('install', event => {
  console.log('[Service Worker] Installing...');
  event.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        console.log('[Service Worker] Caching app shell');
        return cache.addAll(urlsToCache.map(url => new Request(url, { cache: 'reload' })));
      })
      .then(() => self.skipWaiting())  // Force immediate activation
  );
});

// Activate event - clean up old caches
self.addEventListener('activate', event => {
  console.log('[Service Worker] Activating...');
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(cacheName => {
          if (cacheName !== CACHE_NAME && cacheName !== RUNTIME_CACHE) {
            console.log('[Service Worker] Deleting old cache:', cacheName);
            return caches.delete(cacheName);
          }
        })
      );
    }).then(() => self.clients.claim())  // Take control of all pages immediately
  );
});

self.addEventListener('message', event => {
  if (event.data && event.data.type === 'SKIP_WAITING') {
    self.skipWaiting();
  }
});

// Fetch event - serve from cache, fallback to network
self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);
  const sameOrigin = url.origin === self.location.origin;

  // 1) Navigations: NETWORK-FIRST, fallback to cached index.html
  if (request.mode === 'navigate') {
    event.respondWith((async () => {
      try {
        // Always try the network for navigations
        const networkResponse = await fetch(request);
        // Optionally update cached index.html to keep offline fresh
        const cache = await caches.open(CACHE_NAME);
        cache.put('./index.html', networkResponse.clone());
        return networkResponse;
      } catch (err) {
        // Offline / network error: fall back to precached index.html
        const cached = await caches.match('./index.html');
        return cached || Response.error();
      }
    })());
    return;
  }

  // Only handle same-origin caching; let cross-origin pass through
  if (!sameOrigin) return;

  // 2) Media: cache-first with runtime update (your prior logic, simplified)
  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      if (cached) return cached;

      try {
        const response = await fetch(request);
        const cache = await caches.open(RUNTIME_CACHE);
        cache.put(request, response.clone());
        return response;
      } catch (e) {
        return cached || Response.error();
      }
    })());
    return;
  }

  // 3) App shell assets (js/css/manifest): STALE-WHILE-REVALIDATE
  // Use your existing shouldHandleAppShell but only for non-navigate assets
  if (shouldHandleAppShell(request)) {
    event.respondWith((async () => {
      const cached = await caches.match(request);
      const fetchPromise = fetch(request).then(async (response) => {
        const cache = await caches.open(CACHE_NAME);
        cache.put(request, response.clone());
        return response;
      }).catch(() => null);

      // Return cache immediately if present, otherwise wait for network
      return cached || (await fetchPromise) || Response.error();
    })());
    return;
  }

  // 4) Everything else: network-first or cache-first; keep simple
  event.respondWith((async () => {
    const cached = await caches.match(request);
    if (cached) return cached;

    const response = await fetch(request);
    const cache = await caches.open(RUNTIME_CACHE);
    cache.put(request, response.clone());
    return response;
  })());
});

  if (request.destination === 'image' || request.destination === 'video') {
    event.respondWith(
      caches.match(request).then(cached => {
        const fetchPromise = fetch(request)
          .then(response => {
            const copy = response.clone();
            caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
            return response;
          })
          .catch(() => cached);
        return cached || fetchPromise;
      })
    );
    return;
  }

  event.respondWith(
    caches.match(request).then(cached => {
      if (cached) return cached;
      return fetch(request).then(response => {
        const copy = response.clone();
        caches.open(RUNTIME_CACHE).then(cache => cache.put(request, copy));
        return response;
      });
    })
  );
});
