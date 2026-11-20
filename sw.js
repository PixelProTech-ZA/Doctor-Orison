/* Doctor Orison service worker: offline shell. Bump VERSION when files change. */
var VERSION = 'orison-v2';
var SHELL = ['./', 'index.html', 'styles.css', 'config.js', 'data-books.js', 'data-prayers.js', 'data-ingredients.js', 'art.js', 'core.js', 'app.js', 'views-bible.js', 'views-prayer.js', 'views-archive.js', 'cms.js', 'start.js', 'manifest.webmanifest', 'orison-icon.svg', 'icon-192.png', 'icon-512.png', 'icon-maskable-512.png', 'apple-touch-icon.png'];
self.addEventListener('install', function (e) { e.waitUntil(caches.open(VERSION).then(function (c) { return c.addAll(SHELL); }).then(function () { return self.skipWaiting(); })); });
self.addEventListener('activate', function (e) { e.waitUntil(caches.keys().then(function (ks) { return Promise.all(ks.filter(function (k) { return k !== VERSION; }).map(function (k) { return caches.delete(k); })); }).then(function () { return self.clients.claim(); })); });
self.addEventListener('fetch', function (e) {
  var req = e.request; if (req.method !== 'GET') return; var url = new URL(req.url);
  if (url.hostname.indexOf('supabase.co') > -1) return; /* never cache account or database calls */
  if (url.origin === location.origin) {
    /* app files: cache first, refresh in background; the Bible text is cached on first use */
    e.respondWith(caches.match(req).then(function (hit) { var net = fetch(req).then(function (r) { if (r && r.ok) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); } return r; }).catch(function () { return hit; }); return hit || net; }));
    return;
  }
  /* fonts and the Supabase library: stale-while-revalidate */
  if (/fonts\.(googleapis|gstatic)\.com|cdn\.jsdelivr\.net/.test(url.hostname)) {
    e.respondWith(caches.match(req).then(function (hit) { var net = fetch(req).then(function (r) { if (r && (r.ok || r.type === 'opaque')) { var cp = r.clone(); caches.open(VERSION).then(function (c) { c.put(req, cp); }); } return r; }).catch(function () { return hit; }); return hit || net; }));
  }
});
