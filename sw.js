var staticCacheName = 'mws-restaurant-stage-1-v1';
var urlsToCache = [
    '/',
    '/css/styles.css',
    '/data/restaurants.json',
    '/js/dbhelper.js',
    '/js/main.js',
    '/js/restaurant_info.js'
];
self.addEventListener('install', function (event) {
    // Perform install steps
    event.waitUntil(
        caches.open(staticCacheName)
        .then(function (cache) {
            console.log('Opened cache');
            return cache.addAll(urlsToCache);
        })
    );
});

self.addEventListener('fetch', function (event) {
    event.respondWith(
        caches.match(event.request)
        .then(function (response) {
            // Cache hit - return response
            if (response) {
                return response;
            }
            return fetch(event.request);
        })
    );
});
//Deletes all the caches there aren't in the white list
self.addEventListener('activate', function(event) {

    var cacheWhitelist = ['mws-restaurant-stage-1-v1'];
  
    event.waitUntil(
      caches.keys().then(function(cacheNames) {
        return Promise.all(
          cacheNames.map(function(cacheName) {
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName);
            }
          })
        );
      })
    );
  });