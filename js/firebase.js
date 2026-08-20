/*
 * firebase.js — Firebase boot + offline cache.
 *
 * Exposes window.FB = { ready, app, auth, db, FieldValue } once initialised.
 * If js/firebase-config.js still holds the placeholder, this does nothing and
 * app.js shows the "Setup pending" card instead.
 */
(function () {
  'use strict';

  var cfg = window.firebaseConfig || {};
  var configured = !!cfg.apiKey && cfg.apiKey !== 'PASTE_API_KEY';

  window.FB = { ready: false, configured: configured, error: null };
  if (!configured) return;

  var app, auth, db;
  try {
    app = firebase.initializeApp(cfg);
    auth = firebase.auth();
    db = firebase.firestore();
  } catch (err) {
    /* A bad config or a blocked SDK load lands here. Record it so app.js can
       say so plainly, instead of mislabelling it as "setup pending". */
    console.error('[firebase] initialisation failed —', err);
    window.FB.error = err;
    return;
  }

  /*
   * Publish FB *before* enabling the offline cache.
   *
   * The cache is optional; the app is fully usable online without it. Publishing
   * first means that if persistence throws — private browsing, IndexedDB
   * disabled by policy, a locked-down district machine — the app still runs
   * rather than dying at boot behind a misleading "setup pending" card.
   */
  window.FB = {
    ready: true,
    configured: true,
    error: null,
    app: app,
    auth: auth,
    db: db,
    FieldValue: firebase.firestore.FieldValue
  };

  /*
   * Offline cache. District connectivity is unreliable, so queued writes must
   * survive a dropped connection and flush on reconnect. synchronizeTabs keeps
   * persistence working when an officer has the form open in two tabs.
   *
   * NOTE: this is the *compat* SDK, where the call is enablePersistence().
   * (enableMultiTabIndexedDbPersistence is the modular-SDK name and does not
   * exist here — calling it throws synchronously.)
   *
   * Both failure paths are handled: a rejected promise for the documented
   * cases, and try/catch for a synchronous throw.
   *   failed-precondition = another tab holds the lock
   *   unimplemented       = browser has no IndexedDB support
   */
  try {
    db.enablePersistence({ synchronizeTabs: true }).catch(function (err) {
      console.warn('[firebase] offline cache unavailable (' +
        (err && err.code) + ') — running online-only.');
    });
  } catch (err) {
    console.warn('[firebase] offline cache could not start — running online-only.', err);
  }
})();
