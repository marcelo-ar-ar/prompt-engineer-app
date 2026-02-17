/**
 * @file sw.js
 * @description Service Worker para habilitar capacidades Offline y carga instantánea.
 */

const CACHE_NAME = 'prompt-lab-v1';
const ASSETS = [
    './',
    './index.html'
];

// Instalación: Almacena los archivos en caché
self.addEventListener('install', (event) => {
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => cache.addAll(ASSETS))
    );
});

// Estrategia: Cache First, Fallback to Network
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request);
        })
    );
});

