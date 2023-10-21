// service-worker.js

const cacheName = 'tailBlast';

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(cacheName).then(cache => {
      return cache.addAll([
        '/',
        '/tb.html',
        '/alpine.js',
        '/tw.js',
        '/animate.css',
        // Add all your website assets here
      ]);
    })
  );
});

self.addEventListener('activate', event => {
  event.waitUntil(
    caches.keys().then(cacheNames => {
      return Promise.all(
        cacheNames.map(existingCacheName => {
          if (existingCacheName !== cacheName) {
            // Delete old caches not in use (e.g., an older version of your site)
            return caches.delete(existingCacheName);
          }
        })
      );
    })
  );
});

self.addEventListener('fetch', event => {
  event.respondWith(
    caches.open(cacheName).then(cache => {
      return cache.match(event.request).then(response => {
        // Always fetch from the network and update the cache in the background
        const fetchPromise = fetch(event.request).then(networkResponse => {
          if (networkResponse) {
            cache.put(event.request, networkResponse.clone());
          }
          return networkResponse;
        }).catch(error => {
          // Handle network fetch errors here, if needed
          console.error('Fetch error:', error);
        });

        return response || fetchPromise;
      });
    })
  );
});
