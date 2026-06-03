const CACHE = 'festival-v1';
const PRECACHE = ['/', '/index.html', '/favicon.svg', '/manifest.json'];

// ── Install: pre-cache shell ──────────────────────────────────────────────
self.addEventListener('install', (e) => {
  e.waitUntil(
    caches.open(CACHE)
      .then(c => c.addAll(PRECACHE))
      .then(() => self.skipWaiting())
  );
});

// ── Activate: remove old caches ───────────────────────────────────────────
self.addEventListener('activate', (e) => {
  e.waitUntil(
    caches.keys()
      .then(keys => Promise.all(keys.filter(k => k !== CACHE).map(k => caches.delete(k))))
      .then(() => self.clients.claim())
  );
});

// ── Fetch: cache-first for same-origin, network-first for API ────────────
self.addEventListener('fetch', (e) => {
  if (e.request.url.includes('/api/')) {
    e.respondWith(fetch(e.request));
    return;
  }
  e.respondWith(
    caches.match(e.request).then(cached => cached || fetch(e.request))
  );
});

// ── Message: show notification from main thread ───────────────────────────
self.addEventListener('message', (e) => {
  if (e.data?.type !== 'SHOW_NOTIFICATION') return;
  const { title, body, tag } = e.data;
  // Geen waitUntil hier – dat houdt het messagekanaal open en geeft een fout
  self.registration.showNotification(title, {
    body,
    icon: '/favicon.svg',
    badge: '/favicon.svg',
    tag,
    renotify: true,
    vibrate: [200, 100, 200],
  });
});

// ── Notification click: open / focus the app ──────────────────────────────
self.addEventListener('notificationclick', (e) => {
  e.notification.close();
  e.waitUntil(
    self.clients
      .matchAll({ type: 'window', includeUncontrolled: true })
      .then(clients => {
        const existing = clients.find(c => c.url.startsWith(self.location.origin));
        if (existing) return existing.focus();
        return self.clients.openWindow('/');
      })
  );
});
