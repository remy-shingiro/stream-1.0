// ——————————————————————————————————————————————————————————————
// 1. MONETAG ADS CONFIGURATION (MUST BE AT THE TOP)
// ——————————————————————————————————————————————————————————————
self.options = {
    "domain": "3nbf4.com",
    "zoneId": 10484859
}
self.lary = ""
importScripts('https://3nbf4.com/act/files/service-worker.min.js?r=sw')

// ——————————————————————————————————————————————————————————————
// 2. YOUR APP CACHING LOGIC
// ——————————————————————————————————————————————————————————————

// VERSION UPDATE: Changed to 'v3' to force browsers to install this new worker containing ads
const CACHE_NAME = 'agasobanuye-v3'; 
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Add your main CSS/JS bundle names here if you know them, e.g., '/static/main.js'
];

self.addEventListener('install', (event) => {
  // The 'importScripts' above loads the ad code immediately.
  // Now we continue with your caching logic.
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // Force the waiting service worker to become the active service worker
  self.skipWaiting(); 
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // SAFETY: Ignore Google Analytics/Tags
  if (url.hostname.includes('google') || url.hostname.includes('googletagmanager')) {
    return;
  }

  // SAFETY: Ignore the Ad Network domain from caching logic to avoid issues
  if (url.hostname.includes('3nbf4.com')) {
    return;
  }

  event.respondWith(
    caches.match(event.request).then((cachedResponse) => {
      // STRATEGY: Cache First, then Network (with Dynamic Saving)
      
      // A. If found in cache, return it immediately (SPEED WIN)
      if (cachedResponse) {
        return cachedResponse;
      }

      // B. If not in cache, fetch from network
      return fetch(event.request).then((networkResponse) => {
        // Check if we received a valid response
        if (!networkResponse || networkResponse.status !== 200) {
          return networkResponse;
        }

        // CRITICAL OPTIMIZATION: Clone and Save
        const responseToCache = networkResponse.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          // Optimization: Only cache images, scripts, styles.
          // We strictly avoid caching the ad scripts here to prevent serving stale ads.
          if (event.request.destination === 'image' || event.request.destination === 'script' || event.request.destination === 'style') {
             // Double check we aren't caching ad scripts by accident
             if (!url.hostname.includes('3nbf4.com')) {
                 cache.put(event.request, responseToCache);
             }
          }
        });

        return networkResponse;
      }).catch((error) => {
        console.log('Fetch failed (offline):', error);
      });
    })
  );
});

// CLEANUP: Delete old caches (v1, v2) when v3 activates
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then((cacheNames) => {
      return Promise.all(
        cacheNames.map((cache) => {
          if (cache !== CACHE_NAME) {
            console.log('Deleting old cache:', cache);
            return caches.delete(cache);
          }
        })
      );
    })
  );
  // Ensure the service worker takes control of the page immediately
  return self.clients.claim();
});