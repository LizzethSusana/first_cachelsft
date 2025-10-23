// sw.js - Service Worker para appshell y cache dinámico

const STATIC_CACHE = 'static-cache-v1';
const DYNAMIC_CACHE = 'dynamic-cache-v1';
// App Shell: solo archivos base, sin select2 ni fullcalendar ni sus assets
const APP_SHELL = [
  '/first_cachelsft/',
  '/first_cachelsft/index.html',
  '/first_cachelsft/estilos.css',
  '/first_cachelsft/tailwind.css',
  '/first_cachelsft/main.js',
  '/first_cachelsft/pages/calendar.html',
  '/first_cachelsft/pages/formulario.html'
];

self.addEventListener('install', event => {
  event.waitUntil(
    caches.open(STATIC_CACHE).then(cache => {
      return cache.addAll(APP_SHELL);
    })
  );
});

self.addEventListener('activate', event => {
  // Limpiar caches antiguas si fuera necesario
  event.waitUntil(
    caches.keys().then(keys => Promise.all(
      keys.filter(k => k !== STATIC_CACHE && k !== DYNAMIC_CACHE)
          .map(k => caches.delete(k))
    ))
  );
});

// Fetch handler: app-shell from cache first; for /assets/ use dynamic strategy provided
self.addEventListener('fetch', event => {
  const req = event.request;
  const url = new URL(req.url);

  // No cachear ni servir offline select2 ni fullcalendar (ni sus assets)
  const isSelect2 = req.url.includes('select2.js') || req.url.includes('select2.css');
  const isFullCalendar = req.url.includes('fullcalendar') || req.url.includes('calendar.js') || req.url.includes('calendar.css');
  if (isSelect2 || isFullCalendar) {
    // Siempre ir a la red, nunca cachear ni servir offline
    event.respondWith(fetch(req));
    return;
  }

  // Si es asset pero NO select2/fullcalendar, usar caché dinámica
  if (req.url.includes('/assets/')) {
    event.respondWith(
      caches.match(req)
        .then(response => {
          if (response) {
            return response;
          }
          return fetch(req)
            .then(networkResponse => {
              const responseToCache = networkResponse.clone();
              caches.open(DYNAMIC_CACHE)
                .then(cache => cache.put(req, responseToCache));
              return networkResponse;
            });
        })
    );
    return;
  }

  // Navegación y app shell: cache first, fallback a /index.html offline
  if (APP_SHELL.includes(url.pathname) || req.mode === 'navigate') {
    event.respondWith(
      caches.match(req).then(cached => cached || fetch(req).catch(() => caches.match('/first_cachelsft/index.html')))
    );
    return;
  }

  // Por defecto: cache first, fallback a red
  event.respondWith(caches.match(req).then(r => r || fetch(req)));
});

