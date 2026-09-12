const CACHE_NAME = "calculator-pwa-v3";

const APP_FILES = [
    "./",
    "./index.html",
    "./style.css",
    "./script.js",
    "./manifest.json",
    "./icons/icon-192.png",
    "./icons/icon-512.png"
];


/* ========================================
   INSTALL
======================================== */

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


/* ========================================
   ACTIVATE
======================================== */

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


/* ========================================
   FETCH / OFFLINE
======================================== */

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