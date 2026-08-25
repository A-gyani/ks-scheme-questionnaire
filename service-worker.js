/*
 * service-worker.js — offline shell.
 *
 * Caches only the static app files. Firestore data is NOT cached here; that is
 * handled by enableMultiTabIndexedDbPersistence() in js/firebase.js, which also
 * queues writes made offline and flushes them on reconnect.
 *
 * Bump CACHE when any shell file changes, or officers keep the stale version.
 */
var CACHE = 'csq-shell-v13';

var SHELL = [
  './',
  './index.html',
  './css/styles.css',
  './js/i18n.js',
  './js/schemes.js',
  './js/spec-a.js',
  './js/spec-b.js',
  './js/render.js',
  './js/route-b.js',
  './js/firebase-config.js',
  './js/firebase.js',
  './js/demo.js',
  './js/app.js',
  './manifest.webmanifest',
  './icon.svg'
];

self.addEventListener('install', function (e) {
  e.waitUntil(caches.open(CACHE).then(function (c) { return c.addAll(SHELL); }));
  self.skipWaiting();
});

self.addEventListener('activate', function (e) {
  e.waitUntil(
    caches.keys().then(function (keys) {
      return Promise.all(keys.map(function (k) {
        return k === CACHE ? null : caches.delete(k);
      }));
    })
  );
  self.clients.claim();
});

self.addEventListener('fetch', function (e) {
  var url = new URL(e.request.url);

  /* Never intercept Firebase/Google traffic — auth and Firestore must always
     hit the network and manage their own offline behaviour. */
  if (e.request.method !== 'GET' || url.origin !== location.origin) return;

  e.respondWith(
    caches.match(e.request).then(function (hit) {
      return hit || fetch(e.request).catch(function () {
        return caches.match('./index.html');
      });
    })
  );
});
