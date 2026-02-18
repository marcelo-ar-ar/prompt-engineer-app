/**
 * @file sw.js
 * @description Service Worker optimizado para GitHub Pages con manejo de caché resiliente.
 */

// Incrementa esta versión cada vez que hagas cambios significativos
const CACHE_NAME = 'prompt-lab-v3.1';

// Definimos los recursos de forma relativa para que funcione en subcarpetas
const ASSETS = [
    './',
    './index.html',
    './manifest.json',
    './sw.js'
];

/**
 * Instalación: Usamos un bucle para añadir archivos uno a uno.
 * Si uno falla (ej. favicon ausente), los demás se guardan igual.
 */
self.addEventListener('install', (event) => {
    // Forzar al nuevo SW a convertirse en el SW activo de inmediato
    self.skipWaiting(); 
    
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            return Promise.all(
                ASSETS.map(url => cache.add(url).catch(err => console.warn(`Error: ${url}`)))
            );
        })
    );
});

/**
 * Estrategia de carga: Cache First, Fallback to Network.
 */
self.addEventListener('fetch', (event) => {
    event.respondWith(
        caches.match(event.request).then((response) => {
            return response || fetch(event.request).catch(() => {
                // Opcional: Podrías devolver una página offline aquí
            });
        })
    );
});

/**
 * Activación: Limpieza y reclamo de control.
 */
self.addEventListener('activate', (event) => {
    // Permite que el SW tome control de la página sin esperar a una recarga
    event.waitUntil(self.clients.claim()); 

    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        console.log('Borrando caché antigua:', cacheName);
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
