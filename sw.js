// RAIL app updater. Raise VERSION on every release: the browser sees a
// changed file, installs the new version in the background, and the page
// shows "A new version is ready" until the person taps Update.
const VERSION = "1.3.0";
const CACHE = "rail-" + VERSION;
const CORE = ["./", "index.html", "manifest.webmanifest", "icons/icon-192.png", "icons/icon-512.png", "icons/apple-touch-icon.png"];

self.addEventListener("install", (e) => {
  e.waitUntil(caches.open(CACHE).then((c) => c.addAll(CORE)));
});

self.addEventListener("activate", (e) => {
  e.waitUntil((async () => {
    for (const k of await caches.keys()) if (k !== CACHE && k.startsWith("rail-")) await caches.delete(k);
    await self.clients.claim();
  })());
});

self.addEventListener("message", (e) => {
  if (e.data === "skip") self.skipWaiting();
});

self.addEventListener("fetch", (e) => {
  const req = e.request;
  if (req.method !== "GET") return;
  const url = new URL(req.url);
  // App page: this version's cached copy, so it opens instantly and offline.
  if (req.mode === "navigate") {
    e.respondWith(caches.match("index.html").then((r) => r || fetch(req)));
    return;
  }
  // Fonts: cached after first use.
  if (url.hostname.endsWith("fonts.googleapis.com") || url.hostname.endsWith("fonts.gstatic.com")) {
    e.respondWith(caches.open(CACHE).then(async (c) => {
      const hit = await c.match(req);
      const net = fetch(req).then((r) => { if (r.ok) c.put(req, r.clone()); return r; }).catch(() => hit);
      return hit || net;
    }));
    return;
  }
  if (url.origin === location.origin) {
    e.respondWith(caches.match(req).then((r) => r || fetch(req)));
  }
});
