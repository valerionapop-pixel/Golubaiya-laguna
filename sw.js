/* Минимальный кеш статики. HTML/JS/CSS — сначала сеть, чтобы правки были видны сразу. */
var CACHE = "laguna-static-v42";
var CORE = [
  "./",
  "./index.html",
  "./admin.html",
  "./admin.css",
  "./admin.js",
  "./laguna-site-overrides.js",
  "./styles.css",
  "./script.js",
  "./warp-mount.js",
  "./gallery-3d-vanilla.js",
  "./gallery-src/gallery.css",
  "./assets/hero-beach-bar.png",
  "./favicon.svg",
  "./manifest.webmanifest",
  "./og-cover.svg",
  "./quiz/q1.svg",
  "./quiz/q2.svg",
  "./quiz/q3.svg",
];

self.addEventListener("install", function (e) {
  e.waitUntil(
    caches.open(CACHE).then(function (c) {
      return c.addAll(CORE).catch(function () {});
    })
  );
  self.skipWaiting();
});

self.addEventListener("activate", function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(
        keys.map(function (k) {
          if (k !== CACHE) return caches.delete(k);
        })
      );
    })
  );
  self.clients.claim();
});

function isAppShellRequest(url) {
  var p = url.pathname;
  return p === "/" || /\/index\.html$/i.test(p) || /\.(html|js|mjs|css)$/i.test(p);
}

self.addEventListener("fetch", function (e) {
  var req = e.request;
  if (req.method !== "GET") return;
  var url = new URL(req.url);
  if (url.origin !== self.location.origin) return;

  if (url.pathname.indexOf("/api/") === 0) {
    e.respondWith(fetch(req));
    return;
  }

  if (isAppShellRequest(url)) {
    e.respondWith(
      fetch(req)
        .then(function (res) {
          var copy = res.clone();
          if (res.ok) {
            caches.open(CACHE).then(function (c) {
              c.put(req, copy);
            });
          }
          return res;
        })
        .catch(function () {
          return caches.match(req);
        })
    );
    return;
  }

  e.respondWith(
    caches.match(req).then(function (hit) {
      return (
        hit ||
        fetch(req).then(function (res) {
          var copy = res.clone();
          if (res.ok) {
            caches.open(CACHE).then(function (c) {
              c.put(req, copy);
            });
          }
          return res;
        })
      );
    })
  );
});
