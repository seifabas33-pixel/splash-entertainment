const CACHE = 'oldpalace-v15';

const CORE = [
  '.',
  'index.html',
  'styles.css',
  'script.js',
  'manifest.webmanifest',
  'data/programme.json',
  'data/i18n.json',
  'data/gallery.json',
  'assets/old-palace-logo.png',
  'assets/splash-logo.png',
  'assets/entrance-bg.png',
  'assets/icons/icon-192.png',
  'assets/icons/icon-512.png',
  'assets/icons/icon-maskable-512.png',
  'assets/icons/apple-touch-icon.png',
];

const FONT_HOSTS = ['fonts.googleapis.com', 'fonts.gstatic.com'];

self.addEventListener('install', (event) => {
  event.waitUntil(
    caches.open(CACHE).then((cache) => cache.addAll(CORE)).then(() => self.skipWaiting())
  );
});

self.addEventListener('activate', (event) => {
  event.waitUntil(
    caches.keys()
      .then((keys) => Promise.all(keys.filter((k) => k !== CACHE).map((k) => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

self.addEventListener('message', (event) => {
  const data = event.data || {};
  if (data.type !== 'SHOW_REMINDER') return;
  const { title, body, tag } = data;
  event.waitUntil(
    self.registration.showNotification(title, {
      body,
      tag,
      icon: 'assets/icons/icon-192.png',
      badge: 'assets/icons/icon-192.png',
      data: { url: '.#myday' },
    })
  );
});

self.addEventListener('notificationclick', (event) => {
  event.notification.close();
  const target = (event.notification.data && event.notification.data.url) || '.#myday';
  event.waitUntil(
    self.clients.matchAll({ type: 'window', includeUncontrolled: true }).then((clients) => {
      for (const client of clients) {
        if ('focus' in client) {
          client.postMessage({ type: 'REMINDER_CLICK' });
          return client.focus();
        }
      }
      if (self.clients.openWindow) return self.clients.openWindow(target);
    })
  );
});

self.addEventListener('fetch', (event) => {
  const { request } = event;
  if (request.method !== 'GET') return;

  const url = new URL(request.url);

  // Navigation requests: network-first, fall back to cached shell when offline.
  if (request.mode === 'navigate') {
    event.respondWith(
      fetch(request).catch(() => caches.match('index.html', { ignoreSearch: true }))
    );
    return;
  }

  // Google Fonts (cross-origin): cache-first, populate at runtime.
  if (FONT_HOSTS.includes(url.hostname)) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
          return res;
        }).catch(() => cached)
      )
    );
    return;
  }

  // Programme + i18n JSON: network-first so edits propagate when online.
  if (url.origin === self.location.origin && (url.pathname.endsWith('data/programme.json') || url.pathname.endsWith('data/i18n.json') || url.pathname.endsWith('data/gallery.json'))) {
    event.respondWith(
      fetch(request).then((res) => {
        if (res && res.ok) {
          const copy = res.clone();
          caches.open(CACHE).then((cache) => cache.put(request, copy));
        }
        return res;
      }).catch(() => caches.match(request))
    );
    return;
  }

  // Same-origin static assets: cache-first, populate at runtime.
  if (url.origin === self.location.origin) {
    event.respondWith(
      caches.match(request).then((cached) =>
        cached ||
        fetch(request).then((res) => {
          if (res && res.ok) {
            const copy = res.clone();
            caches.open(CACHE).then((cache) => cache.put(request, copy));
          }
          return res;
        })
      )
    );
  }
});
