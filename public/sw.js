// // public/sw.js
// const CACHE_NAME = 'agasobanuye-v1';
// const urlsToCache = [
//   '/',
//   '/index.html',
//   '/manifest.json'
// ];

// self.addEventListener('install', (event) => {
//   event.waitUntil(
//     caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
//   );
// });

// self.addEventListener('fetch', (event) => {
//   const url = new URL(event.request.url);

//   // 1. SAFETY: Ignore Google Analytics/Tags to prevent AdBlocker crashes
//   if (url.hostname.includes('google') || url.hostname.includes('googletagmanager')) {
//     return; 
//   }

//   event.respondWith(
//     caches.match(event.request).then((response) => {
//       // Return cached response if found, otherwise fetch from network
//       return response || fetch(event.request).catch((error) => {
//         // 2. CRITICAL FIX: Catch network errors so the app doesn't crash
//         console.log('Fetch failed (ignored):', error);
//         // You can just return nothing here, letting the request fail gracefully
//       });
//     })
//   );
// });

// // 3. CLEANUP: Delete old caches when you update the app
// self.addEventListener('activate', (event) => {
//   event.waitUntil(
//     caches.keys().then((cacheNames) => {
//       return Promise.all(
//         cacheNames.map((cache) => {
//           if (cache !== CACHE_NAME) {
//             return caches.delete(cache);
//           }
//         })
//       );
//     })
//   );
// });


// public/sw.js
// 1. VERSION UPDATE: Changed to 'v2' to force the browser to load this new worker
const CACHE_NAME = 'agasobanuye-v2';
const urlsToCache = [
  '/',
  '/index.html',
  '/manifest.json'
  // Add your main CSS/JS bundle names here if you know them, e.g., '/static/main.js'
];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE_NAME).then((cache) => cache.addAll(urlsToCache))
  );
  // OPTIONAL: Force the waiting service worker to become the active service worker
  self.skipWaiting(); 
});

self.addEventListener('fetch', (event) => {
  const url = new URL(event.request.url);

  // 1. SAFETY: Ignore Google Analytics/Tags
  if (url.hostname.includes('google') || url.hostname.includes('googletagmanager')) {
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

        // 2. CRITICAL OPTIMIZATION: Clone and Save
        // We clone the response because a response stream can only be read once.
        // One copy goes to the browser, the other goes to your cache.
        const responseToCache = networkResponse.clone();
        
        caches.open(CACHE_NAME).then((cache) => {
          // optimization: Only cache images and valid scripts, ignore huge video files if any
          if (event.request.destination === 'image' || event.request.destination === 'script' || event.request.destination === 'style') {
             cache.put(event.request, responseToCache);
          }
        });

        return networkResponse;
      }).catch((error) => {
        console.log('Fetch failed (offline):', error);
        // Optional: Return a specific "offline.png" placeholder if an image failed
      });
    })
  );
});

// 3. CLEANUP: Delete old caches (v1) when v2 activates
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