/**
 * @file sw.js
 * @description Service Worker para habilitar capacidades Offline y carga instantánea.
 */

const CACHE_NAME = 'prompt-lab-v3'; // <--- Cambia este número cada vez que edites tu HTML/CSS
const ASSETS = [
  '/',
  '/index.html'
];

// 1. INSTALACIÓN: Crea la nueva caché
self.addEventListener('install', (event) => {
  self.skipWaiting(); // Obliga al nuevo SW a tomar el control de inmediato
  event.waitUntil(
    caches.open(CACHE_NAME).then(cache => cache.addAll(ASSETS))
  );
});

// 2. ACTIVACIÓN: Limpia cachés viejas
self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys().then(keys => {
      return Promise.all(
        keys.filter(key => key !== CACHE_NAME) // Si la caché no es la actual...
            .map(key => caches.delete(key))    // ... la borramos
      );
    })
  );
});

// 3. FETCH: Estrategia "Cache First"
self.addEventListener('fetch', (event) => {
  event.respondWith(
    caches.match(event.request).then(res => res || fetch(event.request))
  );
});
