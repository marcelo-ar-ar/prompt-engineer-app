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
    event.waitUntil(
        caches.open(CACHE_NAME).then((cache) => {
            console.log('Abriendo caché y agregando recursos...');
            // Usamos map y Promise.all para que un error 404 en un archivo no rompa todo
            return Promise.all(
                ASSETS.map(url => {
                    return cache.add(url).catch(err => console.warn(`Fallo al cachear: ${url}`, err));
                })
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
 * Activación: Limpia versiones antiguas de caché para liberar espacio.
 */
self.addEventListener('activate', (event) => {
    event.waitUntil(
        caches.keys().then((cacheNames) => {
            return Promise.all(
                cacheNames.map((cacheName) => {
                    if (cacheName !== CACHE_NAME) {
                        return caches.delete(cacheName);
                    }
                })
            );
        })
    );
});
