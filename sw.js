let staticCacheName = 'restaurant-';

// install and load all static files and images
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(staticCacheName)
        .then((cache) => {
            return cache.addAll([
                './',
				'./index.html',
				'./restaurant.html',
				'./css/styles.css',
				'./data/restaurants.json',
				'./js/dbhelper.js',
				'./js/main.js',
				'./js/restaurant_info.js',
				'./js/sw_register.js',
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
            ]);
        })
    );
});

// handling old service worker versions
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys()
        .then((cacheNames) => {
            return Promise.all(
                cacheNames.filter((cacheName) => {
                    return cacheName.startsWith('restaurant-') && cacheName != staticCacheName;
                })
                .map((cacheName) => {
                    return caches.delete(cacheName);
                })
            );
        })
    );
});

// handling file requests
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request) // check cache for requested file
        .then((response) => {
            return response || fetch(event.request); // if in cache return, else if possible fetch from network
        })
    );
});
