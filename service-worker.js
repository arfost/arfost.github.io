// service-worker.js

// Register the service worker
self.addEventListener('install', event => {
  event.waitUntil(
    caches.open('ADR-v1').then(cache => {
      return cache.addAll([
        // Add your static assets here
        '/',
        './index.html',
        './modules/Dice.js',
        './modules/Roll.js',
        './modules/Game.js',
        './assets/dice/d4.png',
        './assets/dice/d6.png',
        './assets/dice/d8.png',
        './assets/dice/d10.png',
        './assets/dice/d12.png',
        './assets/dice/d20.png',
        './start.js'
      ]);
    })
  );
});

// Intercept fetch requests
self.addEventListener('fetch', event => {
  event.respondWith(
    caches.match(event.request).then(response => {
      return response || fetch(event.request);
    })
  );
});
