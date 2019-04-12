let staticCacheName = 'restaurant-reviews-static-v1';
const cacheUrls = [
  './',
  './favicon.png',
  './manifest.json',
  './index.html',
  './restaurant.html',
  './css/styles.css',
  './data/restaurants.json',
  './js/dbhelper.js',
  './js/main.js',
  './js/restaurant_info.js',
  './img/1.jpg',
  './img/2.jpg',
  './img/3.jpg',
  './img/4.jpg',
  './img/5.jpg',
  './img/6.jpg',
  './img/7.jpg',
  './img/8.jpg',
  './img/9.jpg',
  './img/10.jpg'
];

if (navigator.serviceWorker) {
  window.addEventListener('load', _ => {
    navigator.serviceWorker.register('./sw.js')
      .then(_ => console.log('Service worker registered.'))
      .catch(_ => console.log('Failed to register Service Worker.'))
  });
}

self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(staticCacheName)
      .then(cache => cache.addAll(cacheUrls))
  );
});

self.addEventListener('activate', e => {
  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return cacheNames.filter(name => {
          return name.startsWith('restaurant-') && name != staticCacheName
        })
      })
      .then(cacheNames => Promise.all(cacheNames))
      .then(cacheNames => cacheNames.map(name => caches.delete(name)))
      .catch(error => console.log(error))
  );
});

self.addEventListener('fetch', e => {
  e.respondWith(
    caches.match(e.request)
      .then(response => response || fetch(e.request))
  );
});