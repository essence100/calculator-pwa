const CACHE_NAME = "calculator-pwa-v5";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",

    // Font Awesome Local
    "./fontawesome/css/fontawesome.css",
    "./fontawesome/css/solid.css",
    "./fontawesome/webfonts/fa-solid-900.woff2",

    // App Icons
    "./icons/icon-192.png",
    "./icons/icon-512.png",

    // Display Backgrounds
    "./backgrounds/abstract-1.jpg",
    "./backgrounds/abstract-2.jpg",
    "./backgrounds/technology-1.jpg",
    "./backgrounds/technology-2.jpg"
];

self.addEventListener("install", (event) => {
    event.waitUntil(
        caches
            .open(CACHE_NAME)
            .then((cache) => {
                return cache.addAll(APP_FILES);
            })
            .then(() => {
                return self.skipWaiting();
            })
    );
});

self.addEventListener("activate", (event) => {
    event.waitUntil(
        caches
            .keys()
            .then((cacheNames) => {
                return Promise.all(
                    cacheNames
                        .filter(
                            (cacheName) =>
                                cacheName !== CACHE_NAME
                        )
                        .map((cacheName) => {
                            return caches.delete(
                                cacheName
                            );
                        })
                );
            })
            .then(() => {
                return self.clients.claim();
            })
    );
});

self.addEventListener("fetch", (event) => {
    event.respondWith(
        caches
            .match(event.request)
            .then((cachedResponse) => {
                if (cachedResponse) {
                    return cachedResponse;
                }

                return fetch(event.request);
            })
            .catch(() => {
                return caches.match("./index.html");
            })
    );
});