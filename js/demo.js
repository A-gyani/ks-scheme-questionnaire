/*
 * demo.js — a self-contained "try it without setting anything up" mode.
 *
 * OFF unless the address ends in ?demo=1. Without that, this file does
 * absolutely nothing and the real Firebase path is untouched — which is why it
 * is safe to ship alongside the live site.
 *
 * With it, everything runs in the browser's memory: a fake signed-in officer, a
 * fake database, a little seeded work so the progress screens are not empty.
 * NOTHING IS SAVED. Refresh the page and it all goes back to the start.
 *
 * That is the danger this file has to manage: an officer handed a demo link
 * could fill in a whole scheme and lose it. Hence the red bar that cannot be
 * dismissed, in both languages, permanently on screen.
 *
 * Loaded AFTER firebase.js and BEFORE app.js, so it replaces window.FB
 * wholesale and app.js boots against it without knowing the difference.
 */
(function () {
  'use strict';

  if (!/[?&]demo=1(&|$)/.test(window.location.search)) return;

  /* ------------------------------------------------------------------ *
   *  The fake database
   * ------------------------------------------------------------------ */
  var ts = function () {
    return { __ts: true, toDate: function () { return new Date(); } };
  };

  var STORE = {
    users: {
      'demo-officer': {
        name: 'Demo Officer', rank: 'Assistant Director',
        body: 'commissionerate', branch: 'culture',
        email: 'demo@example.gov.in', createdAt: ts()
      }
    },
    admins: { 'demo@example.gov.in': {} },
    allowlist: {},
    schemes: {},
    schemeFixes: {},
    audit: {},

    /* A little Part A, so Home does not open on a wall of zeros. */
    responsesA: {
      commissionerate: {
        body: 'commissionerate', status: 'draft',
        answers: {
          'A1.1.channels': ['news', 'letter'],
          'A1.1.channels~news': 'Sandesh, Gujarat Samachar',
          'A1.1.channels~~star': 'letter',
          'A2.1.where': ['district']
        },
        lastEditedBy: 'Shri A. B. Patel · Deputy Director · Commissionerate (Celebration)',
        lastEditedByEmail: 'colleague@example.gov.in',
        lastEditedAt: ts()
      }
    },

    /* Two schemes with work on them, so the progress screens have something to
       show and the "last edited by a colleague" warning can be seen. */
    responsesB: {
      'P5-01': {
        body: 'commissionerate', branch: 'culture', scheme: 'P5-01',
        status: 'submitted', lastEditedByBranch: 'culture',
        answers: {
          'B0.1.confirm': 'ok',
          'B0.3.name': 'Smt. R. K. Shah',
          'B0.3.designation': 'Assistant Director',
          'B0.5.mechanism': ['competition', 'award'],
          'B1.1.orders~r0c0': 'SYCAD/2019/1145',
          'B1.1.orders~r0c1': '12-06-2019',
          'B2.1.whoApplies': ['individual', 'groupReg', 'institution'],
          'B2.1.whoApplies~~star': 'groupReg'
        },
        naSections: [],
        submittedBy: 'Demo Officer · Assistant Director · Commissionerate (Culture)',
        submittedAt: ts(),
        lastEditedBy: 'Demo Officer · Assistant Director · Commissionerate (Culture)',
        lastEditedByEmail: 'demo@example.gov.in', lastEditedAt: ts()
      },
      'P5-05': {
        body: 'commissionerate', branch: 'culture', scheme: 'P5-05',
        status: 'draft', lastEditedByBranch: 'culture',
        answers: { 'B0.1.confirm': 'ok', 'B0.5.mechanism': ['grant'] },
        naSections: [],
        lastEditedBy: 'Shri A. B. Patel · Deputy Director · Commissionerate (Celebration)',
        lastEditedByEmail: 'colleague@example.gov.in', lastEditedAt: ts()
      }
    }
  };

  var autoId = 0;

  function clone(v) { return v == null ? v : JSON.parse(JSON.stringify(v)); }

  function snap(id, data) {
    return { id: id, exists: !!data, data: function () { return clone(data); } };
  }

  /* Mirrors Firestore's merge: nested maps merge, arrays and values replace. */
  function mergeInto(target, src) {
    Object.keys(src).forEach(function (k) {
      var v = src[k];
      if (v && v.__del) { delete target[k]; return; }
      if (v && typeof v === 'object' && !Array.isArray(v) && !v.__ts) {
        var base = (target[k] && typeof target[k] === 'object' && !Array.isArray(target[k]))
          ? target[k] : {};
        target[k] = mergeInto(base, v);
      } else {
        target[k] = v;
      }
    });
    return target;
  }

  function writeDoc(col, id, value, merge) {
    if (!STORE[col]) STORE[col] = {};
    var v = clone(value);
    if (merge && STORE[col][id]) STORE[col][id] = mergeInto(STORE[col][id], v);
    else STORE[col][id] = v;
  }

  function docRef(col, id) {
    id = id || ('demo-' + (++autoId));
    return {
      __col: col, __id: id, id: id,
      get: function () { return Promise.resolve(snap(id, STORE[col] && STORE[col][id])); },
      set: function (value, opts) {
        writeDoc(col, id, value, !!(opts && opts.merge));
        return Promise.resolve();
      }
    };
  }

  function colRef(col) {
    var filters = [];
    var api = {
      doc: function (id) { return docRef(col, id); },
      where: function (field, op, value) { filters.push([field, value]); return api; },
      orderBy: function () { return api; },
      limit: function () { return api; },
      startAfter: function () { return api; },
      get: function () {
        var bag = STORE[col] || {};
        var rows = Object.keys(bag).map(function (k) { return snap(k, bag[k]); })
          .filter(function (d) {
            var data = d.data() || {};
            return filters.every(function (f) { return data[f[0]] === f[1]; });
          });
        return Promise.resolve({
          empty: rows.length === 0, size: rows.length, docs: rows,
          forEach: function (fn) { rows.forEach(fn); }
        });
      }
    };
    return api;
  }

  var DEMO_USER = {
    uid: 'demo-officer',
    email: 'demo@example.gov.in',
    displayName: 'Demo Officer'
  };

  window.FB = {
    ready: true, configured: true, error: null, demo: true,
    db: {
      collection: colRef,
      batch: function () {
        var ops = [];
        return {
          set: function (ref, value, opts) {
            ops.push([ref, value, opts]);
            return this;
          },
          commit: function () {
            ops.forEach(function (o) { o[0].set(o[1], o[2]); });
            return Promise.resolve();
          }
        };
      }
    },
    auth: {
      onAuthStateChanged: function (cb) {
        /* Already signed in — the point of the demo is to skip the setup. */
        setTimeout(function () { cb(DEMO_USER); }, 0);
      },
      getRedirectResult: function () { return Promise.resolve({ user: null }); },
      signInWithPopup: function () { return Promise.resolve({ user: DEMO_USER }); },
      signOut: function () {
        /* Signing out of a demo just starts it again. */
        window.location.reload();
        return Promise.resolve();
      }
    },
    FieldValue: {
      serverTimestamp: ts,
      delete: function () { return { __del: true }; }
    }
  };

  /* ------------------------------------------------------------------ *
   *  The warning
   *
   *  Fixed to the bottom, cannot be dismissed, in both languages. Someone
   *  handed this link could otherwise fill in a whole scheme and lose it.
   * ------------------------------------------------------------------ */
  function paintBanner() {
    var css = document.createElement('style');
    css.textContent =
      '#demo-bar{position:fixed;left:0;right:0;bottom:0;z-index:9999;' +
      'background:#b3261e;color:#fff;padding:10px 16px;font-size:13px;line-height:1.45;' +
      'box-shadow:0 -2px 10px rgba(0,0,0,.18);text-align:center}' +
      '#demo-bar b{font-weight:700}' +
      '#demo-bar span{display:block;font-size:12px;opacity:.92}';
    document.head.appendChild(css);

    /* Gujarati leads, and it is shorter than it was — but it still has to say
       the one thing that matters: nothing here is kept. */
    var bar = document.createElement('div');
    bar.id = 'demo-bar';
    var gu = document.createElement('b');
    gu.textContent = 'ડેમો — અહીંનું કંઈ સચવાતું નથી. ખરા કામ માટે વાપરશો નહીં.';
    var en = document.createElement('span');
    en.textContent = 'DEMO — nothing here is saved. Do not use it for real work.';
    bar.appendChild(gu);
    bar.appendChild(en);
    document.body.appendChild(bar);

    /*
     * Reserve exactly as much room as the bar actually takes.
     *
     * A fixed number does not survive contact with reality: on a narrow screen
     * the two lines of warning wrap to about 111px, so a hard-coded 76px let
     * the bar sit on top of the last scheme in the list. Measuring it — and
     * measuring again whenever the window changes — keeps the bottom of the
     * page reachable at any width, in either language.
     */
    /*
     * Applied twice on purpose.
     *
     * Straight away, because requestAnimationFrame does NOT run in a hidden or
     * background tab — a demo link opened in a background tab would otherwise
     * get no spacing at all until it was looked at. Then again on the next
     * frame, because on a resize the handler runs before the bar has re-wrapped
     * and would otherwise keep the old height.
     */
    function reserveRoom() {
      var apply = function () {
        document.body.style.paddingBottom = (bar.offsetHeight + 12) + 'px';
      };
      apply();
      if (window.requestAnimationFrame) window.requestAnimationFrame(apply);
    }
    reserveRoom();
    window.addEventListener('resize', reserveRoom);
    if (window.ResizeObserver) new window.ResizeObserver(reserveRoom).observe(bar);
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', paintBanner);
  } else {
    paintBanner();
  }

  console.info('[demo] Running in demo mode — in-memory only, nothing is saved.');
})();
