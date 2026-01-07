// public/sw.js
const CACHE_NAME = 'agasobanuye-v1';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. SAFETY: Ignore Google Analytics/Tags to prevent AdBlocker crashes
  if (url.hostname.includes('google') || url.hostname.includes('googletagmanager')) {
    return; 
  }

  event.respondWith(
    caches.match(event.request).then((response) => {
      // Return cached response if found, otherwise fetch from network
      return response || fetch(event.request).catch((error) => {
        // 2. CRITICAL FIX: Catch network errors so the app doesn't crash
        console.log('Fetch failed (ignored):', error);
        // You can just return nothing here, letting the request fail gracefully
      });
    })
  );
});

// 3. CLEANUP: Delete old caches when you update the app
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            return caches.delete(cache);
          }
        })
      );
    })
  );
});