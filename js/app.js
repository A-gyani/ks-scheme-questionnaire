/*
 * app.js — Cultural Schemes Questionnaire (SYCAD, Government of Gujarat)
 *
 * FEATURE 1 = scaffold only. This file boots the shell, guards the config and
 * routes between views. Sign-in, forms, autosave and the admin tracker arrive
 * in later features and must each be approved before being built.
 *
 * Free tier (Firebase Spark) is a hard constraint. The CONST block below holds
 * every number that keeps daily usage inside 20k writes / 50k reads / 1 GiB.
 */
(function () {
  'use strict';

  /* ---------------------------------------------------------------- *
   *  Free-tier + content constants
   *  (Referenced by later features; defined here so there is one home.)
   * ---------------------------------------------------------------- */
  var CONST = {
    /* Autosave: commit on blur/change after a 2s idle gap, never per keystroke.
       Firestore allows ~1 sustained write/sec to a single document, and every
       response write is shadowed by an audit write. */
    COMMIT_DEBOUNCE_MS: 2000,

    /* Character caps. These are a UX guard, not a security boundary — rules
       cannot iterate a dynamic answers map, so Firestore's own hard 1 MiB
       document limit is the real backstop (see firestore.rules). */
    TEXT_CAP: 2000,
    LONGTEXT_CAP: 5000,

    /* Never read the audit collection whole. */
    AUDIT_PAGE_SIZE: 50,

    /* The audit log records who changed what, not the text itself — the full
       answer always lives in the response document. Storing untruncated values
       would put two 5,000-character answers in every entry, which across the
       life of the project is hundreds of MB against a 1 GiB free allowance. */
    AUDIT_VALUE_CAP: 300,

    /* Part A is one shared document per body (approved option (a)): officers of
       the same body edit the same doc, merge is field-level, and the last save
       wins on a contested field. The banner below names who touched it last;
       the audit log makes any overwrite recoverable. */
    PART_A_CONCURRENCY: 'shared-doc-with-last-edited-banner',

    BODIES: [
      { id: 'commissionerate', en: 'Commissionerate of Youth Services & Cultural Activities',
        gu: 'યુવક સેવા અને સાંસ્કૃતિક પ્રવૃત્તિઓની કચેરી', hasBranches: true },
      { id: 'lalitKala', en: 'Gujarat State Lalit Kala Akademi',
        gu: 'ગુજરાત રાજ્ય લલિતકલા અકાદમી', hasBranches: false },
      { id: 'sangeetNatak', en: 'Gujarat State Sangeet Natak Akademi',
        gu: 'ગુજરાત રાજ્ય સંગીત નાટક અકાદમી', hasBranches: false }
    ],

    /* Commissionerate only. Youth Board is a unit inside the Commissionerate;
       Yoga Board is a different entity and is excluded from this instrument. */
    BRANCHES: [
      { id: 'culture',     en: 'Culture',     gu: 'સાંસ્કૃતિક શાખા' },
      { id: 'celebration', en: 'Celebration', gu: 'ઉજવણી શાખા' },
      { id: 'adventure',   en: 'Adventure',   gu: 'સાહસિક પ્રવૃત્તિ શાખા' },
      { id: 'youthBoard',  en: 'Youth Board', gu: 'યુવક બોર્ડ' }
    ],

    /* TODO (Feature 3): exact rank lists per body — the user is supplying these.
       Placeholder only; keyed by body id so each body can differ. */
    RANKS: {
      commissionerate: [],
      lalitKala: [],
      sangeetNatak: []
    }
  };
  window.CONST = CONST;

  /* ---------------------------------------------------------------- *
   *  Tiny DOM helpers
   * ---------------------------------------------------------------- */
  function $(id) { return document.getElementById(id); }
  function on(id, ev, fn) { var e = $(id); if (e) e.addEventListener(ev, fn); }

  var VIEWS = ['view-loading', 'view-setup', 'view-login', 'view-profile',
               'view-home', 'view-parta', 'view-partb', 'view-admin'];

  /* The app bar is hidden on the pre-signed-in views. */
  var BARE_VIEWS = ['view-loading', 'view-setup', 'view-login'];

  function showView(id) {
    VIEWS.forEach(function (v) {
      var el = $(v);
      if (el) el.classList.toggle('hidden', v !== id);
    });
    $('appbar').classList.toggle('hidden', BARE_VIEWS.indexOf(id) !== -1);
  }
  window.showView = showView;
  window.openPartA = function () { openPartA(); };

  /* ---------------------------------------------------------------- *
   *  PWA shell — safe to fail (file:// and private modes reject it).
   * ---------------------------------------------------------------- */
  if ('serviceWorker' in navigator && location.protocol.indexOf('http') === 0) {
    window.addEventListener('load', function () {
      navigator.serviceWorker.register('service-worker.js').catch(function () {});
    });
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 2 — session
   *
   *  Read once at sign-in and held in memory for the tab's lifetime: two
   *  document reads per session, not per action. Nothing here is a security
   *  boundary — isAdmin only decides whether the Admin button is drawn, while
   *  firestore.rules decides what can actually be read or written.
   * ---------------------------------------------------------------- */
  var session = { user: null, profile: null, isAdmin: false };
  window.session = session;

  function bodyById(id) {
    var found = null;
    CONST.BODIES.forEach(function (b) { if (b.id === id) found = b; });
    return found;
  }
  function branchById(id) {
    var found = null;
    CONST.BRANCHES.forEach(function (b) { if (b.id === id) found = b; });
    return found;
  }

  /* "Kushal Dixit - Clerk - Commissionerate (Culture)" */
  function describeProfile(p) {
    if (!p) return '';
    var body = bodyById(p.body);
    var bits = [p.name];
    if (p.rank) bits.push(p.rank);
    if (body) {
      var label = body.en;
      var branch = p.branch ? branchById(p.branch) : null;
      if (branch) label += ' (' + branch.en + ')';
      bits.push(label);
    }
    return bits.join(' \u00b7 ');
  }

  function paintAppBar() {
    var text = session.profile
      ? describeProfile(session.profile)
      : (session.user ? session.user.email : '');
    $('who-text').textContent = text;
    $('btn-admin').classList.toggle('hidden', !session.isAdmin);
  }

  /* Does a doc exist at admins/{email}? Rules allow an officer to read only
     their own, so a denial here simply means "not an admin". */
  function checkAdmin(user) {
    if (!user.email) return Promise.resolve(false);
    return window.FB.db.collection('admins').doc(user.email).get()
      .then(function (snap) { return snap.exists; })
      .catch(function (err) {
        if (err && err.code !== 'permission-denied') {
          console.warn('[auth] admin check failed -', err.code || err);
        }
        return false;
      });
  }

  function loadProfile(user) {
    return window.FB.db.collection('users').doc(user.uid).get()
      .then(function (snap) { return snap.exists ? snap.data() : null; })
      .catch(function (err) {
        console.warn('[auth] profile read failed -', err.code || err);
        return null;
      });
  }

  /* ---------------------------------------------------------------- *
   *  Sign-in errors, in the officer's terms rather than Firebase's.
   * ---------------------------------------------------------------- */
  function signInErrorMessage(code) {
    /* Firebase spells this one as a whole sentence inside the code, so match on
       a fragment rather than equality. Like unauthorized-domain, it is a setup
       mistake rather than anything the officer did. */
    if (code && code.indexOf('api-key-not-valid') !== -1) {
      return 'The Firebase configuration on this site is not valid. The administrator must '
           + 'check the values in js/firebase-config.js against the Firebase console. '
           + 'આ સાઇટનું Firebase રૂપરેખાંકન માન્ય નથી. વહીવટકર્તાએ તે ફરી ચકાસવું પડશે.';
    }

    switch (code) {
      case 'auth/unauthorized-domain':
        /* The single most common deployment mistake - see README step 8. */
        return 'This site is not yet authorised for sign-in. The administrator must add '
             + 'this domain under Firebase \u2192 Authentication \u2192 Settings \u2192 Authorized domains. '
             + 'આ સાઇટ પરથી સાઇન ઇન કરવાની મંજૂરી હજુ અપાઈ નથી. વહીવટકર્તાએ Firebase માં આ ડોમેન ઉમેરવું પડશે.';
      case 'auth/network-request-failed':
        return 'No internet connection. Please check the connection and try again. '
             + 'ઇન્ટરનેટ જોડાણ નથી. જોડાણ ચકાસીને ફરી પ્રયાસ કરો.';
      case 'auth/popup-blocked':
        return 'The sign-in window was blocked by the browser. Please allow pop-ups and try again. '
             + 'બ્રાઉઝરે સાઇન ઇન વિન્ડો રોકી છે. પોપ-અપને મંજૂરી આપી ફરી પ્રયાસ કરો.';
      case 'auth/operation-not-allowed':
        return 'Google sign-in is not enabled on this Firebase project yet. '
             + 'આ પ્રોજેક્ટમાં Google સાઇન ઇન હજુ ચાલુ કરાયું નથી.';
      default:
        return 'Sign-in failed. Please try again. '
             + 'સાઇન ઇન થઈ શક્યું નહીં. ફરી પ્રયાસ કરો.';
    }
  }

  function showLoginError(msg) {
    var el = $('login-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }
  function clearLoginError() { $('login-error').classList.add('hidden'); }

  var signInWatchdog = null;
  var popupFailed = false;

  function endSignInAttempt() {
    if (signInWatchdog) { clearTimeout(signInWatchdog); signInWatchdog = null; }
    var btn = $('btn-google');
    if (btn) btn.disabled = false;
  }

  function signIn() {
    clearLoginError();
    var btn = $('btn-google');
    btn.disabled = true;

    var provider = new firebase.auth.GoogleAuthProvider();
    /* Always show the chooser: officers share machines, and a silently reused
       session would attribute one officer's answers to another. */
    provider.setCustomParameters({ prompt: 'select_account' });

    /* Second attempt after a popup that never opened: sign in on this page.
       Redirect is the fallback and not the default, because on GitHub Pages
       the page and the auth handler sit on different domains, so redirect
       sign-in fails wherever third-party storage is blocked. */
    if (popupFailed) {
      window.FB.auth.signInWithRedirect(provider).catch(function (err) {
        endSignInAttempt();
        showLoginError(signInErrorMessage(err && err.code));
      });
      return;
    }

    /*
     * A blocked popup does not reliably surface as auth/popup-blocked. On
     * locked-down browsers window.open returns null and the sign-in promise
     * simply never settles, leaving the button disabled and the officer with
     * no explanation at all. This watchdog turns that silence into an
     * instruction and arms the redirect route for the next press.
     *
     * The wording stays true whether or not the window opened, because from
     * here there is no way to tell: a real sign-in can legitimately sit
     * unsettled this long while the officer picks an account and types a
     * password. Nothing is cancelled - a popup still in progress will still
     * succeed and route normally.
     */
    signInWatchdog = setTimeout(function () {
      popupFailed = true;
      endSignInAttempt();
      showLoginError(
        'If no Google window opened, this browser is blocking pop-ups. '
      + 'Press the button again to sign in on this page instead. '
      + 'જો Google વિન્ડો ખૂલી ન હોય, તો આ બ્રાઉઝર પોપ-અપ રોકે છે. '
      + 'આ જ પાના પર સાઇન ઇન કરવા બટન ફરી દબાવો.');
    }, 20000);

    window.FB.auth.signInWithPopup(provider)
      .catch(function (err) {
        var code = err && err.code;

        /* Closing the window is a decision, not a fault - say nothing. */
        if (code === 'auth/popup-closed-by-user' ||
            code === 'auth/cancelled-popup-request') return;

        if (code === 'auth/popup-blocked') {
          /* Fall back to the redirect route immediately. Its own failure must
             be reported too: an unhandled rejection here re-enables the button
             but shows nothing, leaving the officer pressing a dead control. */
          popupFailed = true;
          return window.FB.auth.signInWithRedirect(provider)
            .catch(function (rErr) {
              console.warn('[auth] redirect fallback failed -', (rErr && rErr.code) || rErr);
              showLoginError(signInErrorMessage(rErr && rErr.code));
            });
        }

        console.warn('[auth] sign-in failed -', code || err);
        showLoginError(signInErrorMessage(code));
      })
      .then(endSignInAttempt, endSignInAttempt);
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 3 — profile setup (body -> name -> rank -> branch)
   *
   *  Written to users/{uid} and asked once. Every audit entry is attributed to
   *  what is captured here, so the same shape is enforced in firestore.rules.
   * ---------------------------------------------------------------- */

  /* Bilingual option label, e.g. "Culture / સાંસ્કૃતિક શાખા". */
  function optionLabel(item) { return item.en + ' / ' + item.gu; }

  function fillSelect(el, items, placeholder) {
    el.innerHTML = '';
    var blank = document.createElement('option');
    blank.value = '';
    blank.textContent = placeholder;
    el.appendChild(blank);
    items.forEach(function (it) {
      var o = document.createElement('option');
      o.value = it.id;
      o.textContent = optionLabel(it);
      el.appendChild(o);
    });
  }

  /*
   * The rank field is the seam for the official rank lists, which are still
   * being compiled.
   *
   *   CONST.RANKS[body] empty  -> free-text box, so officers are never blocked
   *                               on a list that does not exist yet
   *   CONST.RANKS[body] filled -> dropdown of those ranks, plus "Other" for
   *                               anything the list misses
   *
   * Both paths write the same plain string to `rank`, so populating the arrays
   * later needs no change here, in the rules, or to profiles already saved.
   * Officers can reopen this screen to swap a typed rank for a listed one.
   */
  function renderRankField(bodyId, current) {
    var wrap = $('pf-rank-wrap');
    var list = (CONST.RANKS && CONST.RANKS[bodyId]) || [];
    wrap.innerHTML = '';

    if (!list.length) {
      var input = document.createElement('input');
      input.id = 'pf-rank';
      input.type = 'text';
      input.maxLength = 120;
      input.placeholder = 'e.g. Assistant Director / મદદનીશ નિયામક';
      input.value = current || '';
      wrap.appendChild(input);

      var note = document.createElement('p');
      note.className = 'note';
      note.textContent = 'Type your official designation. A list of ranks will be added later. '
                       + 'આપનો સત્તાવાર હોદ્દો લખો. હોદ્દાની યાદી પછીથી ઉમેરાશે.';
      wrap.appendChild(note);
      return;
    }

    var sel = document.createElement('select');
    sel.id = 'pf-rank';
    fillSelect(sel, list, '\u2014 Select / પસંદ કરો \u2014');

    var other = document.createElement('option');
    other.value = '__other__';
    other.textContent = 'Other / અન્ય';
    sel.appendChild(other);
    wrap.appendChild(sel);

    var free = document.createElement('input');
    free.id = 'pf-rank-other';
    free.type = 'text';
    free.maxLength = 120;
    free.placeholder = 'Your designation / આપનો હોદ્દો';
    free.className = 'hidden';
    free.style.marginTop = '8px';
    wrap.appendChild(free);

    /* A saved rank that is not on the list keeps working: it lands in Other. */
    var known = false;
    list.forEach(function (r) { if (r.id === current) known = true; });
    if (current && known) {
      sel.value = current;
    } else if (current) {
      sel.value = '__other__';
      free.value = current;
      free.classList.remove('hidden');
    }

    sel.addEventListener('change', function () {
      free.classList.toggle('hidden', sel.value !== '__other__');
      if (sel.value === '__other__') free.focus();
    });
  }

  function readRank() {
    var el = $('pf-rank');
    if (!el) return '';
    if (el.tagName === 'INPUT') return el.value.trim();
    if (el.value === '__other__') {
      var free = $('pf-rank-other');
      return free ? free.value.trim() : '';
    }
    /* Store the readable label, not the internal id: the rank is shown in the
       app bar, the tracker and every audit line, and an id would be unreadable
       to whoever reviews the log later. */
    var list = (CONST.RANKS && CONST.RANKS[$('pf-body').value]) || [];
    var picked = '';
    list.forEach(function (r) { if (r.id === el.value) picked = r.en + ' / ' + r.gu; });
    return picked;
  }

  function onBodyChange() {
    var bodyId = $('pf-body').value;
    var body = bodyById(bodyId);
    var isComm = !!(body && body.hasBranches);

    $('pf-branch-wrap').classList.toggle('hidden', !isComm);
    if (!isComm) $('pf-branch').value = '';

    /* Rank options are per body, so re-render whenever the body changes. */
    renderRankField(bodyId, '');
  }

  function openProfileForm() {
    var p = session.profile;

    fillSelect($('pf-body'), CONST.BODIES, '\u2014 Select / પસંદ કરો \u2014');
    fillSelect($('pf-branch'), CONST.BRANCHES, '\u2014 Select / પસંદ કરો \u2014');
    $('pf-error').classList.add('hidden');

    $('pf-body').value = p ? p.body : '';
    /* Google's display name is a starting point, not the answer — officers
       routinely sign in with a personal account whose name is informal. */
    $('pf-name').value = p ? p.name : ((session.user && session.user.displayName) || '');

    var body = bodyById($('pf-body').value);
    $('pf-branch-wrap').classList.toggle('hidden', !(body && body.hasBranches));
    $('pf-branch').value = (p && p.branch) ? p.branch : '';

    renderRankField($('pf-body').value, p ? p.rank : '');

    $('pf-title').innerHTML = p
      ? 'Edit your profile <span class="guj">/ પ્રોફાઇલ સુધારો</span>'
      : 'Set up your profile <span class="guj">/ પ્રોફાઇલ સેટ કરો</span>';

    showView('view-profile');
  }

  function showProfileError(msg) {
    var el = $('pf-error');
    el.textContent = msg;
    el.classList.remove('hidden');
  }

  function saveProfile() {
    var bodyId = $('pf-body').value;
    var name = $('pf-name').value.trim();
    var rank = readRank();
    var body = bodyById(bodyId);
    var branch = (body && body.hasBranches) ? $('pf-branch').value : '';

    if (!bodyId) return showProfileError('Please select your office. કૃપા કરી આપની કચેરી પસંદ કરો.');
    if (!name)   return showProfileError('Please enter your full name. કૃપા કરી આપનું પૂરું નામ લખો.');
    if (!rank)   return showProfileError('Please enter your rank or designation. કૃપા કરી આપનો હોદ્દો લખો.');
    if (body && body.hasBranches && !branch) {
      return showProfileError('Please select your branch. કૃપા કરી આપની શાખા પસંદ કરો.');
    }

    var btn = $('pf-save');
    btn.disabled = true;
    $('pf-error').classList.add('hidden');

    var isNew = !session.profile;
    var data = {
      email: session.user.email,
      name: name,
      rank: rank,
      body: bodyId,
      updatedAt: window.FB.FieldValue.serverTimestamp()
    };

    /*
     * createdAt is written once and never rewritten. An edit deliberately does
     * not resend it: a full overwrite would drop the field entirely, and the
     * rules pin createdAt to its stored value, so such a write is rejected.
     * Merging leaves the stored value untouched and the check passes.
     */
    if (isNew) data.createdAt = window.FB.FieldValue.serverTimestamp();

    /*
     * branch must be absent, not empty, on the Akademis - the rules forbid the
     * key there. On an edit that moves an officer from the Commissionerate to
     * an Akademi the stored branch has to be actively removed, since merging
     * would otherwise preserve it and the write would be refused.
     */
    if (branch) data.branch = branch;
    else if (!isNew) data.branch = window.FB.FieldValue.delete();

    var ref = window.FB.db.collection('users').doc(session.user.uid);
    (isNew ? ref.set(data) : ref.set(data, { merge: true }))
      .then(function () {
        /* Mirror locally rather than re-reading: serverTimestamp resolves on
           the server, and this saves a read on every profile save. */
        session.profile = {
          email: data.email, name: name, rank: rank, body: bodyId,
          branch: branch || undefined
        };
        paintAppBar();
        $('btn-home').classList.remove('hidden');
        $('btn-profile').classList.remove('hidden');
        openHome(true);
      })
      .catch(function (err) {
        console.warn('[profile] save failed -', (err && err.code) || err);
        showProfileError(err && err.code === 'permission-denied'
          ? 'This profile was rejected by the server. Please check the office and rank, then try again. '
          + 'આ પ્રોફાઇલ સર્વરે સ્વીકારી નથી. કચેરી અને હોદ્દો ચકાસીને ફરી પ્રયાસ કરો.'
          : 'Could not save. Please check your connection and try again. '
          + 'સાચવી શકાયું નહીં. જોડાણ ચકાસીને ફરી પ્રયાસ કરો.');
      })
      .then(function () { btn.disabled = false; });
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 4 + 5 — Part A: render, autosave, resume, submit
   *
   *  Part A is answered ONCE PER BODY, so the document id is the officer's
   *  body: every officer of the Commissionerate works on the same sheet
   *  (approved concurrency option a). Writes merge field by field, so two
   *  officers answering different questions never collide; on the same
   *  question the last save wins, and the audit trail keeps it recoverable.
   * ---------------------------------------------------------------- */
  var partA = {
    bodyId: null,
    answers: {},      /* everything currently on screen                  */
    pending: {},      /* committed but not yet written                   */
    pendingAudit: {}, /* {key: {old, new}} awaiting the same write       */
    meta: {},         /* status / who last edited / when, as last loaded  */
    timer: null,
    saving: false,
    loaded: false
  };

  function partARef() {
    return window.FB.db.collection('responsesA').doc(partA.bodyId);
  }

  /* ---------------- save-state chip ---------------- */
  /* Part A and Part B show the same four states, so the wording lives once and
     the element to paint is a parameter. */
  function setChip(id, state, textEN, textGU) {
    var el = $(id);
    el.className = 'savechip' + (state ? ' ' + state : '');
    el.textContent = textGU ? textEN + ' / ' + textGU : textEN;
    el.classList.remove('hidden');
  }
  function chip(state, textEN, textGU) { setChip('pa-savechip', state, textEN, textGU); }
  function chipSaved()   { chip('', 'Saved \u2713', 'સચવાયું'); }
  function chipSaving()  { chip('saving', 'Saving\u2026', 'સાચવાય છે'); }
  function chipFailed()  { chip('failed', 'Not saved \u2014 will retry', 'સચવાયું નથી \u2014 ફરી પ્રયાસ થશે'); }
  /*
   * Offline is a success, not a failure: the write is already in the local
   * store and Firestore flushes it on reconnect. Saying "saving..." forever
   * would read as broken to an officer on a district connection.
   */
  function chipOffline() { chip('saving', 'Saved on this device \u2014 will sync', 'આ ઉપકરણ પર સચવાયું \u2014 પછી સિંક થશે'); }

  function fmtWhen(ts) {
    if (!ts || !ts.toDate) return '';
    try {
      return ts.toDate().toLocaleString('en-IN',
        { day: 'numeric', month: 'short', year: 'numeric', hour: 'numeric', minute: '2-digit' });
    } catch (e) { return ''; }
  }

  /* ---------------- the "who touched this last" banner ---------------- */
  function paintBanner() {
    var el = $('pa-banner');
    var m = partA.meta || {};
    var bits = [];

    if (m.status === 'submitted' && m.submittedBy) {
      /* The time is shown only once it actually resolves. A just-saved local
         copy carries a pending timestamp, so testing the raw field would
         print a dangling "on " with nothing after it. */
      var subWhen = fmtWhen(m.submittedAt);
      bits.push('Submitted by ' + m.submittedBy + (subWhen ? ' on ' + subWhen : '') +
                ' \u00b7 સબમિટ થયેલ');
    }

    /*
     * Only worth showing when somebody ELSE was last in here. Part A is a
     * shared sheet per body, so this is the officer's only warning that a
     * colleague may be working on the same questions right now.
     */
    if (m.lastEditedByEmail && session.user && m.lastEditedByEmail !== session.user.email) {
      var editWhen = fmtWhen(m.lastEditedAt);
      bits.push('Last edited by ' + (m.lastEditedBy || m.lastEditedByEmail) +
                (editWhen ? ' on ' + editWhen : '') +
                ' \u00b7 છેલ્લે સુધારનાર');
    }

    el.textContent = bits.join('  \u2014  ');
    el.classList.toggle('hidden', bits.length === 0);
  }

  function paintProgress() {
    var st = window.Render.progress(window.SPEC_A.questions, partA.answers);
    $('pa-progbar').style.width = st.percent + '%';

    var node = $('pa-progtext');
    node.innerHTML = '';
    node.appendChild(document.createTextNode(
      st.done + ' of ' + st.total + ' answered \u00b7 ' +
      st.done + ' માંથી ' + st.total + ' જવાબ અપાયા'));

    if (st.blockingLeft) {
      var pill = document.createElement('span');
      pill.className = 'pill block';
      pill.style.marginLeft = '8px';
      pill.textContent = st.blockingLeft + ' blocking left';
      node.appendChild(pill);
    }
    return st;
  }

  /* ---------------- audit trail ----------------
   *
   *  One entry per answer actually changed, appended and never altered. This is
   *  what makes the shared-sheet model safe: when two officers answer the same
   *  question, the later save wins, and this log is how the earlier answer can
   *  be found again and who replaced it.
   */

  /* Stored flat as text: an array of ticked options reads better in a log as
     "news, website" than as raw data, and a single shape keeps the admin
     viewer simple. Truncated because the log records the change, not the text. */
  function auditValue(v) {
    if (v == null) return '';
    if (Array.isArray(v)) v = v.join(', ');
    v = String(v);
    return v.length > CONST.AUDIT_VALUE_CAP
      ? v.slice(0, CONST.AUDIT_VALUE_CAP) + '\u2026'
      : v;
  }

  function sameValue(a, b) {
    return JSON.stringify(a == null ? '' : a) === JSON.stringify(b == null ? '' : b);
  }

  /*
   * Stamped with the officer's name, rank, body and branch as well as the email.
   * The email identifies the account; the rest is what makes a log line legible
   * to whoever reads it months later, without having to resolve every address
   * back to a person.
   */
  function auditEntry(docType, docId, qid, oldV, newV, action) {
    var pr = session.profile || {};
    var e = {
      ts: window.FB.FieldValue.serverTimestamp(),
      actorUid: session.user.uid,
      actorEmail: session.user.email,
      actorName: pr.name || '',
      actorRank: pr.rank || '',
      actorBody: pr.body || '',
      docType: docType,
      docId: docId,
      qid: qid,
      oldValue: auditValue(oldV),
      newValue: auditValue(newV),
      action: action
    };
    /* Absent rather than empty for the Akademis, which have no branches. */
    if (pr.branch) e.actorBranch = pr.branch;
    return e;
  }

  /* ---------------- autosave ---------------- */

  /*
   * One commit = one answer changed. Changes are collected and written
   * together after a short idle gap, so filling several boxes in a row costs
   * one write rather than one per box. On the free tier that matters twice
   * over: every write is also mirrored into the audit trail.
   */
  function onAnswerCommit(key, value) {
    /*
     * The first old value seen in this window is the one kept. Ticking and
     * unticking the same box before the write lands must read as one change
     * from where it started — or as no change at all, in which case the entry
     * is dropped at flush time.
     */
    if (!(key in partA.pendingAudit)) {
      partA.pendingAudit[key] = { old: partA.answers[key], new: value };
    } else {
      partA.pendingAudit[key].new = value;
    }

    partA.answers[key] = value;
    partA.pending[key] = value;
    paintProgress();
    chipSaving();

    if (partA.timer) clearTimeout(partA.timer);
    partA.timer = setTimeout(flushPartA, CONST.COMMIT_DEBOUNCE_MS);
  }

  function flushPartA(extra) {
    if (partA.timer) { clearTimeout(partA.timer); partA.timer = null; }

    var keys = Object.keys(partA.pending);
    if (!keys.length && !extra) return Promise.resolve();

    var answers = {};
    keys.forEach(function (k) { answers[k] = partA.pending[k]; });
    /* Cleared immediately: anything committed while this write is in flight
       belongs to the NEXT batch, and must not be dropped by this one. */
    partA.pending = {};

    /* Entries whose value ended up back where it started are dropped: a tick
       followed by an untick is not a change and should not fill the log. */
    var auditTaken = partA.pendingAudit;
    partA.pendingAudit = {};
    var entries = [];
    Object.keys(auditTaken).forEach(function (k) {
      var rec = auditTaken[k];
      if (sameValue(rec.old, rec.new)) return;
      entries.push(auditEntry('A', partA.bodyId, k, rec.old, rec.new, 'edit'));
    });

    var payload = {
      body: partA.bodyId,
      status: (partA.meta.status === 'submitted') ? 'submitted' : 'draft',
      lastEditedBy: describeProfile(session.profile),
      lastEditedByEmail: session.user.email,
      lastEditedByUid: session.user.uid,
      lastEditedAt: window.FB.FieldValue.serverTimestamp()
    };
    if (keys.length) payload.answers = answers;
    if (extra) Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });

    if (extra && extra.status === 'submitted') {
      entries.push(auditEntry('A', partA.bodyId, '', '', 'submitted', 'submit'));
    }

    partA.saving = true;
    chipSaving();

    /*
     * The answer and its audit entries go in one atomic batch. If they were
     * written separately a failure could leave the log claiming a change that
     * never saved, or an answer with no record of who made it — either of which
     * is worse than no log at all.
     */
    var batch = window.FB.db.batch();
    batch.set(partARef(), payload, { merge: true });
    entries.forEach(function (e) {
      batch.set(window.FB.db.collection('audit').doc(), e);
    });

    /*
     * With offline persistence on, this promise settles only once the server
     * has acknowledged. The local write has already happened, so being offline
     * is reported as saved-and-pending rather than left spinning.
     */
    var p = batch.commit();

    if (!navigator.onLine) chipOffline();

    return p.then(function () {
      partA.saving = false;
      if (extra && extra.status) partA.meta.status = extra.status;
      if (!Object.keys(partA.pending).length) chipSaved();
    }).catch(function (err) {
      partA.saving = false;
      console.warn('[partA] save failed -', (err && err.code) || err);
      /* Put the batch back so nothing typed is silently lost. */
      Object.keys(answers).forEach(function (k) {
        if (!(k in partA.pending)) partA.pending[k] = answers[k];
      });
      /* And its audit entries with it, keeping the earliest old value so the
         retried entry still records the change from where it truly started. */
      Object.keys(auditTaken).forEach(function (k) {
        if (partA.pendingAudit[k]) partA.pendingAudit[k].old = auditTaken[k].old;
        else partA.pendingAudit[k] = auditTaken[k];
      });
      chipFailed();
    });
  }

  /* ---------------- load / open ---------------- */

  /*
   * Officers share machines. Without this, the next officer to sign in would
   * inherit the previous one's loaded copy of the sheet — including a stale
   * "last edited by" line, which is the one warning that tells them a
   * colleague is working on the same questions.
   */
  function resetPartA() {
    if (partA.timer) { clearTimeout(partA.timer); partA.timer = null; }
    partA = { bodyId: null, answers: {}, pending: {}, pendingAudit: {}, meta: {},
              timer: null, saving: false, loaded: false };
  }

  function openPartA() {
    if (!session.profile) return;

    var bodyId = session.profile.body;
    var body = bodyById(bodyId);
    $('pa-body-label').textContent = body ? body.en + ' / ' + body.gu : '';

    partA.bodyId = bodyId;
    partA.pendingAudit = partA.pendingAudit || {};
    $('pa-questions').innerHTML = '';
    $('pa-savechip').classList.add('hidden');
    $('pa-banner').classList.add('hidden');
    $('pa-loading').classList.remove('hidden');
    showView('view-parta');
    window.scrollTo(0, 0);

    /*
     * Re-read on every open, rather than trusting the copy in memory. Part A is
     * one shared sheet per body, so a colleague may have answered more of it
     * since this officer last looked. One read per open is a negligible cost
     * against the daily free allowance, and it is what keeps both the answers
     * and the "last edited by" warning honest.
     *
     * Anything typed but not yet written is flushed first and then re-applied
     * over the server copy, so re-reading can never discard the officer's own
     * unsaved work.
     */
    flushPartA()
      .then(function () { return partARef().get(); })
      .then(function (snap) {
        var stillPending = partA.pending;
        partA.answers = {};
        partA.meta = {};

        if (snap.exists) {
          var d = snap.data() || {};
          partA.answers = d.answers || {};
          partA.meta = {
            status: d.status, submittedBy: d.submittedBy, submittedAt: d.submittedAt,
            lastEditedBy: d.lastEditedBy, lastEditedByEmail: d.lastEditedByEmail,
            lastEditedAt: d.lastEditedAt
          };
        }
        Object.keys(stillPending).forEach(function (k) {
          partA.answers[k] = stillPending[k];
        });

        partA.loaded = true;
        drawQuestions();
      })
      .catch(function (err) {
        console.warn('[partA] load failed -', (err && err.code) || err);
        $('pa-loading').classList.add('hidden');
        $('pa-banner').textContent =
          'Could not load saved answers. Please check your connection and reopen. '
        + 'સાચવેલા જવાબો લાવી શકાયા નથી. જોડાણ ચકાસીને ફરી ખોલો.';
        $('pa-banner').className = 'banner err';
        $('pa-banner').classList.remove('hidden');
      });
  }

  function drawQuestions() {
    var host = $('pa-questions');
    host.innerHTML = '';

    var lastSection = null;
    window.SPEC_A.questions.forEach(function (q) {
      if (q.section !== lastSection) {
        lastSection = q.section;
        var sec = null;
        window.SPEC_A.sections.forEach(function (x) { if (x.id === q.section) sec = x; });
        if (sec) {
          var h = document.createElement('div');
          h.className = 'sec-head';
          var t = document.createElement('h3');
          t.textContent = sec.id + '. ' + sec.en;
          var g = document.createElement('div');
          g.className = 'guj';
          g.textContent = sec.gu;
          h.appendChild(t); h.appendChild(g);
          host.appendChild(h);
        }
      }
      host.appendChild(window.Render.renderQuestion(
        q, partA.answers, onAnswerCommit,
        { text: CONST.TEXT_CAP, longtext: CONST.LONGTEXT_CAP }));
    });

    $('pa-loading').classList.add('hidden');
    $('pa-banner').className = 'banner info';
    paintBanner();
    paintProgress();
  }

  /* ---------------- exit & submit ---------------- */
  function leavePartA() {
    flushPartA();
    openHome(false);
  }

  function submitPartA() {
    var st = paintProgress();

    /*
     * A blocking question left empty is allowed but never silent: these are the
     * answers the portal design actually depends on, so the officer is told
     * exactly how many are missing and has to choose to go ahead.
     */
    if (st.blockingLeft) {
      var ok = window.confirm(
        st.blockingLeft + ' important question(s) are still unanswered.\n'
      + st.blockingLeft + ' અગત્યના પ્રશ્નોના જવાબ બાકી છે.\n\n'
      + 'Submit anyway? / તો પણ સબમિટ કરવું?');
      if (!ok) return;
    }

    var btn = $('pa-submit');
    btn.disabled = true;

    flushPartA({
      status: 'submitted',
      submittedBy: describeProfile(session.profile),
      submittedByEmail: session.user.email,
      submittedAt: window.FB.FieldValue.serverTimestamp()
    }).then(function () {
      btn.disabled = false;
      partA.meta.status = 'submitted';
      partA.meta.submittedBy = describeProfile(session.profile);
      paintBanner();
      chip('', 'Submitted \u2713', 'સબમિટ થયું');
    });
  }

  /*
   * A close or refresh inside the idle gap would otherwise lose the last few
   * answers. The write is already queued locally, so it survives even if the
   * page goes away before the server replies.
   */
  window.addEventListener('beforeunload', function (e) {
    var a = Object.keys(partA.pending).length;
    var b = Object.keys(partB.pending).length;
    if (a || b) {
      if (a) flushPartA();
      if (b) flushPartB();
      e.preventDefault();
      e.returnValue = '';
      return '';
    }
  });

  window.addEventListener('online', function () {
    if (Object.keys(partA.pending).length) flushPartA();
    if (Object.keys(partB.pending).length) flushPartB();
  });

  /* ---------------------------------------------------------------- *
   *  FEATURE 7 — Home
   *
   *  Shows the officer where they stand before they open anything: how much of
   *  their body's Part A is done, how many of the answers the portal depends on
   *  are still missing, and whether a colleague has been in it since.
   * ---------------------------------------------------------------- */

  function setStatusPill(el, kind, en, gu) {
    el.className = 'pill ' + kind;
    el.textContent = en + ' / ' + gu;
  }

  function paintHome(summary) {
    var pr = session.profile || {};
    var body = bodyById(pr.body);
    var branch = pr.branch ? branchById(pr.branch) : null;

    var greet = $('home-greet');
    greet.innerHTML = '';
    greet.appendChild(document.createTextNode('Namaste, ' + (pr.name || '') + ' '));
    var g = document.createElement('span');
    g.className = 'guj';
    g.textContent = '/ નમસ્તે';
    greet.appendChild(g);

    $('home-who').textContent = [pr.rank, body ? body.en : '', branch ? branch.en : '']
      .filter(Boolean).join(' \u00b7 ');

    /* Until the read comes back, say so rather than showing a confident zero. */
    if (!summary) {
      setStatusPill($('home-a-status'), 'todo', 'Checking\u2026', 'તપાસાય છે');
      $('home-a-progress').textContent = '';
      $('home-a-edited').textContent = '';
      $('home-a-bar').style.width = '0%';
      return;
    }

    var st = summary.progress;
    $('home-a-bar').style.width = st.percent + '%';

    var pill = $('home-a-status');
    if (summary.status === 'submitted') {
      setStatusPill(pill, 'done', 'Submitted', 'સબમિટ થયું');
      $('home-a-btn').textContent = 'Review or edit';
    } else if (st.done > 0) {
      setStatusPill(pill, 'draft', 'In progress', 'ચાલુ છે');
      $('home-a-btn').textContent = 'Continue';
    } else {
      setStatusPill(pill, 'todo', 'Not started', 'શરૂ થયું નથી');
      $('home-a-btn').textContent = 'Start';
    }

    var prog = $('home-a-progress');
    prog.innerHTML = '';
    prog.appendChild(document.createTextNode(
      st.done + ' of ' + st.total + ' answered \u00b7 ' +
      st.done + ' માંથી ' + st.total + ' જવાબ અપાયા'));
    if (st.blockingLeft) {
      var b = document.createElement('span');
      b.className = 'pill block';
      b.style.marginLeft = '8px';
      b.textContent = st.blockingLeft + ' blocking left';
      prog.appendChild(b);
    }

    /* Same rule as inside the form: only worth saying when it was somebody
       else, so officers are not told about their own edits. */
    var edited = $('home-a-edited');
    if (summary.lastEditedByEmail && session.user &&
        summary.lastEditedByEmail !== session.user.email) {
      var when = fmtWhen(summary.lastEditedAt);
      edited.textContent = 'Last edited by ' +
        (summary.lastEditedBy || summary.lastEditedByEmail) +
        (when ? ' on ' + when : '');
    } else {
      edited.textContent = '';
    }
  }

  function summaryFrom(answers, meta) {
    return {
      status: meta.status,
      lastEditedBy: meta.lastEditedBy,
      lastEditedByEmail: meta.lastEditedByEmail,
      lastEditedAt: meta.lastEditedAt,
      progress: window.Render.progress(window.SPEC_A.questions, answers || {})
    };
  }

  /*
   * refresh=false is used when returning from the form, where the answers are
   * already in memory and correct. Re-reading there would spend a read to learn
   * something this page already knows.
   */
  function openHome(refresh) {
    showView('view-home');
    window.scrollTo(0, 0);

    if (!session.profile) return;

    initSchemePicker();

    if (!refresh && partA.loaded && partA.bodyId === session.profile.body) {
      paintHome(summaryFrom(partA.answers, partA.meta));
      return;
    }

    /* Scheme progress comes from one query, and only for schemes somebody has
       already started, so this stays cheap however long the list gets. */
    Promise.all([loadSchemeOverrides(), loadPartBStatuses(session.profile.body)])
      .then(renderSchemeList);

    paintHome(null);
    window.FB.db.collection('responsesA').doc(session.profile.body).get()
      .then(function (snap) {
        var d = snap.exists ? (snap.data() || {}) : {};
        paintHome(summaryFrom(d.answers, d));
      })
      .catch(function (err) {
        console.warn('[home] status read failed -', (err && err.code) || err);
        /* A failed read must not look like an empty questionnaire, or an
           officer could reasonably think their work had vanished. */
        setStatusPill($('home-a-status'), 'todo', 'Status unavailable', 'સ્થિતિ મળી નથી');
        $('home-a-progress').textContent =
          'Could not check progress. Open Part A to see your answers. '
        + 'પ્રગતિ તપાસી શકાઈ નથી. જવાબો જોવા Part A ખોલો.';
        $('home-a-btn').textContent = 'Open';
      });
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 11 — Part B scheme picker
   *
   *  162 schemes is far too many for a dropdown, so this is a searchable list
   *  narrowed to what the officer is actually responsible for: their own body,
   *  and for the Commissionerate their own branch by default.
   * ---------------------------------------------------------------- */
  var picker = { statuses: {}, loaded: false };

  /* Establishment heads — salaries, outsourcing, advertising, corpus funds. No
     one applies for these, so asking an officer 58 questions about an
     advertising budget would waste their time. Hidden, but counted, so the
     numbers on screen still reconcile with the GR. */
  /*
   * The scheme list ships in js/schemes.js. Corrections an admin has applied
   * live in Firestore and are layered on top here, so a wrong body or branch
   * can be fixed without redeploying the site.
   */
  var schemeOverrides = {};

  function schemeOf(x) {
    var o = schemeOverrides[x.id];
    if (!o) return x;
    var merged = {};
    Object.keys(x).forEach(function (k) { merged[k] = x[k]; });
    if (o.body) merged.body = o.body;
    if (o.branch) merged.branch = o.branch;
    /* An admin who has confirmed the branch removes the "(to confirm)" mark. */
    if (o.branch || o.branchConfirmed) merged.branchGuess = false;
    merged.corrected = true;
    return merged;
  }

  function allSchemes() { return (window.SCHEMES || []).map(schemeOf); }

  function loadSchemeOverrides() {
    return window.FB.db.collection('schemes').get()
      .then(function (qs) {
        var out = {};
        qs.forEach(function (d) { out[d.id] = d.data() || {}; });
        schemeOverrides = out;
      })
      .catch(function (err) {
        /* Not fatal: without overrides the officer sees the seeded list, which
           is right for all but the handful of corrected schemes. */
        console.warn('[schemes] overrides unavailable -', (err && err.code) || err);
        schemeOverrides = {};
      });
  }

  function officerSchemes(bodyId) {
    return allSchemes().filter(function (x) {
      return x.body === bodyId && !x.admin;
    }).sort(function (a, b) {
      /* An Akademi officer knows their own numbered scheme list; the same money
         also appears in the budget GR under a Patrak. Show the list they
         recognise first, then the GR lines. For the Commissionerate everything
         carries a Patrak, so this is simply Patrak order. */
      var ap = a.patrak || 0, bp = b.patrak || 0;
      if (!ap !== !bp) return ap ? 1 : -1;
      if (ap !== bp) return ap - bp;
      return (a.no || 0) - (b.no || 0);
    });
  }

  function schemeById(id) {
    var found = null;
    allSchemes().forEach(function (x) { if (x.id === id) found = x; });
    return found;
  }

  /*
   * One query for the whole body rather than one read per scheme: a response
   * document only exists once somebody has answered something, so early on this
   * costs almost nothing and never costs 162 reads.
   */
  /*
   * The picker shows progress for schemes nobody has opened in this session, so
   * it re-runs the routing over each saved answer set. That costs nothing extra:
   * the answers already came back with the one query, and no scheme is read
   * individually.
   */
  function partBRoute(answers, naSections) {
    var flags = {};
    (naSections || []).forEach(function (x) { if (x && x.id) flags[x.id] = true; });
    return window.RouteB.evaluate(window.SPEC_B, answers, flags, {});
  }
  function partBDone(answers, naSections) {
    return window.Render.progress(partBRoute(answers, naSections).shown, answers).done;
  }
  function partBAsked(answers, naSections) {
    return partBRoute(answers, naSections).shown.length;
  }

  function loadPartBStatuses(bodyId) {
    return window.FB.db.collection('responsesB').where('body', '==', bodyId).get()
      .then(function (qs) {
        var out = {};
        qs.forEach(function (d) {
          var v = d.data() || {};
          out[d.id] = {
            status: v.status,
            /* Part B progress, counted against PART B and against what this
               scheme is actually asked — not a flat 58, and certainly not the
               Part A spec this line used to name before spec-b.js existed. */
            answered: partBDone(v.answers || {}, v.naSections),
            asked: partBAsked(v.answers || {}, v.naSections),
            /* Kept so Feature 17 can total this officer's own branch without a
               second query — the answers are already here. */
            answers: v.answers || {},
            naSections: v.naSections,
            lastEditedBy: v.lastEditedBy
          };
        });
        picker.statuses = out;
        picker.loaded = true;
      })
      .catch(function (err) {
        /* Not fatal — the list is still usable, it just cannot show progress. */
        console.warn('[partB] status query failed -', (err && err.code) || err);
        picker.statuses = {};
        picker.loaded = false;
      });
  }

  function matchesScheme(x, branch, text) {
    if (branch && x.branch !== branch) return false;
    if (!text) return true;
    var hay = [x.nameEN, x.nameGU, x.id, x.budgetHead,
               x.patrak ? 'patrak ' + x.patrak : ''].join(' ').toLowerCase();
    return hay.indexOf(text) !== -1;
  }

  /*
   * Every path that repaints the scheme list also repaints the officer's own
   * branch summary. Painting it only from initSchemePicker missed the usual
   * case: the statuses arrive one query later, so on a fresh sign-in the
   * summary would have stayed hidden until something else redrew the screen.
   */
  function renderSchemeList() {
    renderSchemeListRows();
    paintMyBranchProgress();
  }

  function renderSchemeListRows() {
    if (!session.profile) return;

    var bodyId = session.profile.body;
    var body = bodyById(bodyId);
    var all = officerSchemes(bodyId);
    var hiddenAdmin = allSchemes().filter(function (x) {
      return x.body === bodyId && x.admin;
    }).length;

    var branch = (body && body.hasBranches) ? $('sp-branch').value : '';
    var text = ($('sp-search').value || '').trim().toLowerCase();
    var shown = all.filter(function (x) { return matchesScheme(x, branch, text); });

    $('home-b-count').className = 'pill todo';
    $('home-b-count').textContent = all.length + ' schemes';

    var host = $('sp-list');
    host.innerHTML = '';

    if (!shown.length) {
      var e = document.createElement('div');
      e.className = 'scheme-empty';
      e.textContent = text
        ? 'No scheme matches that search. / આ શોધ સાથે કોઈ યોજના મળી નથી.'
        : 'No schemes listed for this selection. / આ પસંદગી માટે કોઈ યોજના નથી.';
      host.appendChild(e);
    }

    shown.forEach(function (x) {
      var st = picker.statuses[x.id];
      var row = document.createElement('button');
      row.type = 'button';
      row.className = 'scheme-row';
      row.dataset.id = x.id;

      var nm = document.createElement('div');
      nm.className = 'nm';
      nm.textContent = x.nameEN;
      var gu = document.createElement('div');
      gu.className = 'nm-gu guj';
      gu.textContent = x.nameGU;
      row.appendChild(nm); row.appendChild(gu);

      var meta = document.createElement('div');
      meta.className = 'meta';
      var bits = [];
      if (x.patrak) bits.push('Patrak-' + x.patrak);
      if (typeof x.allocationCr === 'number') bits.push('\u20b9 ' + x.allocationCr.toFixed(2) + ' cr');
      var br = x.branch ? branchById(x.branch) : null;
      if (br) bits.push(br.en + (x.branchGuess ? ' (to confirm)' : ''));
      meta.appendChild(document.createTextNode(bits.join('  \u00b7  ')));

      if (st) {
        if (typeof st.answered === 'number' && st.asked) {
          bits.push(st.answered + ' of ' + st.asked + ' answered');
          meta.textContent = bits.join('  \u00b7  ');
        }
        var pill = document.createElement('span');
        if (st.status === 'submitted') { pill.className = 'pill done'; pill.textContent = 'Submitted'; }
        else { pill.className = 'pill draft'; pill.textContent = 'In progress'; }
        meta.appendChild(pill);
      }
      row.appendChild(meta);

      row.addEventListener('click', function () { openPartB(x.id); });
      host.appendChild(row);
    });

    var note = $('sp-note');
    note.textContent = 'Showing ' + shown.length + ' of ' + all.length
      + (branch ? ' in this branch' : '')
      + (hiddenAdmin ? ' \u00b7 ' + hiddenAdmin + ' establishment lines hidden (salaries, advertising and similar)' : '');
  }

  function initSchemePicker() {
    if (!session.profile) return;
    var body = bodyById(session.profile.body);
    var wrap = $('sp-branchwrap');

    if (!$('sp-branch').options.length) {
      fillSelect($('sp-branch'), CONST.BRANCHES, 'All branches / બધી શાખા');
    }

    /*
     * Officers share machines, so the search box and branch are reset whenever
     * a different officer signs in. Inheriting a colleague's search would show
     * "Showing 0 of 85" and read as if their schemes had gone missing.
     */
    if (picker.forUid !== session.user.uid) {
      picker.forUid = session.user.uid;
      $('sp-search').value = '';
      /* Default to the officer's own branch — that is their work. "All
         branches" stays one click away rather than being the default wall of
         85 schemes. */
      $('sp-branch').value = session.profile.branch || '';
    }

    wrap.classList.toggle('hidden', !(body && body.hasBranches));
    renderSchemeList();
  }

  /* ---------------- confirming / reporting a scheme's branch ---------------- */

  /*
   * FEATURE 16 (officer half) — confirming a guessed branch tag.
   *
   * Offered only for a scheme whose branch is BOTH still a guess AND the
   * officer's own: they are the person who would know. Confirming leaves the
   * scheme exactly where it is, which is what makes it safe to put in an
   * officer's hands at all — moving a scheme still goes through a report and an
   * admin, because a wrong move would make it vanish from their own list.
   */
  function canConfirmBranch(x) {
    var pr = session.profile || {};
    return !!x && x.branchGuess === true
      && !!pr.branch && x.branch === pr.branch
      && x.body === pr.body;
  }

  function paintConfirmBranch(x) {
    var show = canConfirmBranch(x);
    $('fix-confirm').classList.toggle('hidden', !show);
    $('fix-confirm-note').classList.toggle('hidden', !show);
    $('fix-confirm').disabled = false;
  }

  function confirmBranch() {
    var x = schemeById(picker.current);
    if (!canConfirmBranch(x)) return;

    var btn = $('fix-confirm');
    btn.disabled = true;

    writeBranchTag(x.id, null, x.branch)
      .then(function () {
        var fresh = schemeById(picker.current);
        paintFixCurrent(fresh);
        paintConfirmBranch(fresh);
        renderSchemeList();
      })
      .catch(function (err) {
        console.warn('[branch] confirm failed -', (err && err.code) || err);
        btn.disabled = false;
      });
  }

  /*
   * One writer for both halves of Feature 16, so a confirm by an officer and a
   * confirm by an admin leave identical records.
   *
   * `branch` null = "the existing guess is right"; a value = move it there
   * (admin only — the rules refuse a branch change from anyone else).
   *
   * The audit entry is written SECOND, and separately. It is deliberately not
   * batched with the override: the rules for a scheme write and an audit write
   * are different, and a rejected audit row must not roll back a legitimate
   * tag change. A tag change with no log line is recoverable; a tag that
   * silently refused to save is not.
   */
  function writeBranchTag(schemeId, newBranch, oldBranch) {
    var ov = {
      branchConfirmed: true,
      updatedBy: describeProfile(session.profile),
      updatedByEmail: session.user.email,
      updatedAt: window.FB.FieldValue.serverTimestamp()
    };
    if (newBranch) ov.branch = newBranch;

    return window.FB.db.collection('schemes').doc(schemeId).set(ov, { merge: true })
      .then(function () {
        var from = branchById(oldBranch), to = branchById(newBranch || oldBranch);
        return window.FB.db.collection('audit').doc().set(
          auditEntry('S', schemeId, 'branch',
                     (from ? from.en : '') + ' (guess)',
                     (to ? to.en : '') + ' (confirmed)', 'edit'))
          .catch(function (err) {
            /* Logged, not thrown: the tag change itself already succeeded. */
            console.warn('[branch] audit entry failed -', (err && err.code) || err);
          });
      })
      .then(function () { return loadSchemeOverrides(); });
  }

  /* ---------------- reporting a wrong body / branch ---------------- */

  function paintFixCurrent(x) {
    var body = bodyById(x.body);
    var br = x.branch ? branchById(x.branch) : null;
    $('fix-current').textContent = 'Currently filed under: '
      + (body ? body.en : x.body)
      + (br ? ' \u2192 ' + br.en : '')
      + (x.branchGuess ? '  (branch not confirmed)' : '');
  }

  function openFixForm() {
    var x = schemeById(picker.current);
    if (!x) return;

    if (!$('fix-body').options.length) {
      fillSelect($('fix-body'), CONST.BODIES, '\u2014 Select / પસંદ કરો \u2014');
      fillSelect($('fix-branch'), CONST.BRANCHES, '\u2014 Select / પસંદ કરો \u2014');
    }
    $('fix-body').value = x.body || '';
    $('fix-branch').value = x.branch || '';
    $('fix-note').value = '';
    $('fix-msg').classList.add('hidden');
    onFixBodyChange();
    $('fix-form').classList.remove('hidden');
    $('fix-open').classList.add('hidden');
  }

  function closeFixForm() {
    $('fix-form').classList.add('hidden');
    $('fix-open').classList.remove('hidden');
  }

  function onFixBodyChange() {
    var b = bodyById($('fix-body').value);
    var show = !!(b && b.hasBranches);
    $('fix-branchwrap').classList.toggle('hidden', !show);
    if (!show) $('fix-branch').value = '';
  }

  function sendFix() {
    var x = schemeById(picker.current);
    if (!x) return;

    var body = $('fix-body').value;
    var b = bodyById(body);
    var branch = (b && b.hasBranches) ? $('fix-branch').value : '';
    var note = ($('fix-note').value || '').trim();

    var msg = $('fix-msg');
    if (!body) {
      msg.textContent = 'Please choose the correct office. કૃપા કરી સાચી કચેરી પસંદ કરો.';
      msg.classList.remove('hidden');
      return;
    }
    if (b && b.hasBranches && !branch) {
      msg.textContent = 'Please choose the correct branch. કૃપા કરી સાચી શાખા પસંદ કરો.';
      msg.classList.remove('hidden');
      return;
    }
    if (body === x.body && branch === (x.branch || '') && !note) {
      msg.textContent = 'That is where it is already — change the office or branch, or add a note. '
                      + 'એ તો અત્યારે જ્યાં છે ત્યાં જ છે — કચેરી કે શાખા બદલો, અથવા નોંધ લખો.';
      msg.classList.remove('hidden');
      return;
    }
    msg.classList.add('hidden');

    var pr = session.profile || {};
    var rec = {
      schemeId: x.id,
      currentBody: x.body,
      status: 'open',
      byUid: session.user.uid,
      byEmail: session.user.email,
      byName: pr.name || '',
      byRank: pr.rank || '',
      byBody: pr.body || '',
      ts: window.FB.FieldValue.serverTimestamp()
    };
    if (x.branch) rec.currentBranch = x.branch;
    if (body !== x.body) rec.suggestedBody = body;
    if (branch && branch !== (x.branch || '')) rec.suggestedBranch = branch;
    if (note) rec.note = note;
    if (pr.branch) rec.byBranch = pr.branch;

    var btn = $('fix-send');
    btn.disabled = true;
    window.FB.db.collection('schemeFixes').doc().set(rec)
      .then(function () {
        closeFixForm();
        $('fix-current').textContent =
          'Reported \u2713 The administrator will review it. / જાણ કરાઈ \u2713 વહીવટકર્તા ચકાસશે.';
      })
      .catch(function (err) {
        console.warn('[fix] send failed -', (err && err.code) || err);
        msg.textContent = 'Could not send. Please check your connection and try again. '
                        + 'મોકલી શકાયું નથી. જોડાણ ચકાસીને ફરી પ્રયાસ કરો.';
        msg.classList.remove('hidden');
      })
      .then(function () { btn.disabled = false; });
  }

  function openPartB(schemeId) {
    var x = schemeById(schemeId);
    if (!x) return;
    picker.current = schemeId;

    $('pb-title').textContent = x.nameEN;
    $('pb-title-gu').textContent = x.nameGU;

    var bits = [x.id];
    if (x.patrak) bits.push('Patrak-' + x.patrak);
    if (x.budgetHead) bits.push(x.budgetHead);
    if (typeof x.allocationCr === 'number') bits.push('\u20b9 ' + x.allocationCr.toFixed(2) + ' crore');
    $('pb-meta').textContent = bits.join('  \u00b7  ');
    closeFixForm();
    paintFixCurrent(x);
    paintConfirmBranch(x);

    /*
     * Anything typed on the PREVIOUS scheme is flushed under that scheme's own
     * id before the state is thrown away. Resetting first would silently
     * discard the last few answers of the sheet the officer just left.
     */
    var leaving = partB.schemeId;
    var carry = leaving && leaving !== schemeId ? flushPartB(null, leaving) : Promise.resolve();

    if (partB.schemeId !== schemeId) resetPartB(schemeId);

    $('pb-questions').innerHTML = '';
    $('pb-savechip').classList.add('hidden');
    $('pb-banner').classList.add('hidden');
    $('pb-loading').classList.remove('hidden');
    showView('view-partb');
    window.scrollTo(0, 0);

    /*
     * Re-read on every open rather than trusting memory. A scheme's sheet is
     * shared by everyone in the same office, so a colleague may have answered
     * more of it since this officer last looked. One read per open is nothing
     * against the daily free allowance, and it is what keeps both the answers
     * and the "last edited by" warning honest.
     *
     * Work typed but not yet written is flushed first and then re-applied over
     * the server copy, so re-reading can never discard the officer's own
     * unsaved answers.
     */
    carry
      .then(function () { return flushPartB(); })
      .then(function () { return partBRef().get(); })
      .then(function (snap) {
        var stillPending = partB.pending;
        partB.answers = {};
        partB.na = {};
        partB.meta = {};

        if (snap.exists) {
          var d = snap.data() || {};
          partB.answers = d.answers || {};
          partB.na = naFromList(d.naSections);
          partB.meta = {
            status: d.status, submittedBy: d.submittedBy, submittedAt: d.submittedAt,
            lastEditedBy: d.lastEditedBy, lastEditedByEmail: d.lastEditedByEmail,
            lastEditedAt: d.lastEditedAt
          };
        }
        Object.keys(stillPending).forEach(function (k) { partB.answers[k] = stillPending[k]; });

        partB.loaded = true;
        $('pb-loading').classList.add('hidden');
        drawPartB();
        paintPartBBanner();
      })
      .catch(function (err) {
        console.warn('[partB] load failed -', (err && err.code) || err);
        $('pb-loading').classList.add('hidden');
        var b = $('pb-banner');
        b.textContent = 'Could not load saved answers for this scheme. Please check your '
                      + 'connection and reopen. આ યોજનાના સાચવેલા જવાબો લાવી શકાયા નથી. '
                      + 'જોડાણ ચકાસીને ફરી ખોલો.';
        b.className = 'banner err';
        b.classList.remove('hidden');
      });
  }

  /* Who was in here last, and whether the sheet has been submitted. Only worth
     showing when it was somebody ELSE — this is the officer's one warning that
     a colleague is working on the same scheme. */
  function paintPartBBanner() {
    var el = $('pb-banner');
    var m = partB.meta || {};
    var bits = [];

    if (m.status === 'submitted' && m.submittedBy) {
      var subWhen = fmtWhen(m.submittedAt);
      bits.push('Submitted by ' + m.submittedBy + (subWhen ? ' on ' + subWhen : '') +
                ' \u00b7 સબમિટ થયેલ');
    }
    if (m.lastEditedByEmail && session.user && m.lastEditedByEmail !== session.user.email) {
      var editWhen = fmtWhen(m.lastEditedAt);
      bits.push('Last edited by ' + (m.lastEditedBy || m.lastEditedByEmail) +
                (editWhen ? ' on ' + editWhen : '') + ' \u00b7 છેલ્લે સુધારનાર');
    }

    el.className = 'banner info';
    el.textContent = bits.join('  \u2014  ');
    el.classList.toggle('hidden', bits.length === 0);
  }

  function leavePartB() {
    flushPartB();
    rememberPartBStatus();
    openHome(false);
  }

  /*
   * Update this scheme's row in the picker from what is already in memory.
   *
   * Home does not re-read when the officer merely comes back from a form (that
   * is the "0 reads returning home" rule from Feature 7), so without this the
   * list would still show a scheme the officer had just filled in as untouched
   * — and the natural reading of that is "my work did not save". We wrote the
   * data, so we know it: no read needed.
   */
  function rememberPartBStatus() {
    if (!partB.schemeId || !partB.loaded) return;
    var route = routeB();
    picker.statuses[partB.schemeId] = {
      status: partB.meta.status || 'draft',
      answered: window.Render.progress(route.shown, partB.answers).done,
      asked: route.shown.length,
      /* Feature 17 re-totals the officer's branch from these, so the answers
         and the set-aside sections have to travel with the status. */
      answers: partB.answers,
      naSections: naToList(partB.na),
      lastEditedBy: describeProfile(session.profile)
    };
  }

  function submitPartB() {
    var st = window.Render.progress(routeB().shown, partB.answers);

    /* A blocking question left empty is allowed but never silent. */
    if (st.blockingLeft) {
      var go = window.confirm(
        st.blockingLeft + ' important question(s) are still unanswered.\n'
      + st.blockingLeft + ' અગત્યના પ્રશ્નોના જવાબ બાકી છે.\n\n'
      + 'Submit anyway? / તો પણ સબમિટ કરવું?');
      if (!go) return;
    }

    var btn = $('pb-submit');
    btn.disabled = true;

    flushPartB({
      status: 'submitted',
      submittedBy: describeProfile(session.profile),
      submittedByEmail: session.user.email,
      submittedAt: window.FB.FieldValue.serverTimestamp()
    }).then(function () {
      btn.disabled = false;
      partB.meta.status = 'submitted';
      partB.meta.submittedBy = describeProfile(session.profile);
      paintPartBBanner();
      setChip('pb-savechip', '', 'Submitted \u2713', 'સબમિટ થયું');
    });
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 14 — the Part B form, and "ask only what applies"
   *
   *  58 questions per scheme is a lot of officer time, so the six rules in
   *  js/route-b.js set aside the questions a scheme cannot answer. Two things
   *  about how that is done here matter more than the rules themselves:
   *
   *  1. SET ASIDE IS A FOLD, NEVER A DELETION. A question that no longer
   *     applies is folded shut with the reason and a "Show anyway" button. If
   *     a rule is wrong the officer can always get the question back — and
   *     wrongly hiding a question is the failure nobody would ever notice.
   *
   *  2. ANSWERS INSIDE A FOLD SURVIVE. Correcting B0.5 can fold a block the
   *     officer has already filled in. Those answers stay in memory (and, from
   *     Feature 15, on the server), and the fold says how many are in there, so
   *     work never disappears quietly.
   *
   *  ⚠️ NOTHING SAVES YET. Answers live in memory until Feature 15. The amber
   *  banner on the screen says so — an officer must not fill in a whole scheme
   *  and then lose it.
   * ---------------------------------------------------------------- */

  var partB = {
    schemeId: null,
    answers: {},      /* everything currently on screen                   */
    na: {},           /* {sectionId: 'who set it aside'}                  */
    opened: {},       /* folds the officer chose to open, this session    */
    pending: {},      /* committed but not yet written                    */
    pendingAudit: {}, /* {key: {old, new}} awaiting the same write        */
    meta: {},         /* status / who last edited / when, as last loaded  */
    timer: null,
    saving: false,
    loaded: false
  };

  function resetPartB(schemeId) {
    if (partB.timer) { clearTimeout(partB.timer); partB.timer = null; }
    partB = { schemeId: schemeId || null, answers: {}, na: {}, opened: {},
              pending: {}, pendingAudit: {}, meta: {},
              timer: null, saving: false, loaded: false };
  }

  function partBRef() {
    return window.FB.db.collection('responsesB').doc(partB.schemeId);
  }

  /* Stored as a list so that clearing a mark actually removes it: a merge write
     merges nested maps rather than replacing them, so a map would keep a key
     the officer had just un-marked. A list is replaced wholesale. */
  function naToList(na) {
    return Object.keys(na).map(function (id) { return { id: id, by: na[id] }; });
  }
  function naFromList(list) {
    var out = {};
    (list || []).forEach(function (x) { if (x && x.id) out[x.id] = x.by || ''; });
    return out;
  }
  /* RouteB only cares whether a section is set aside, not by whom. */
  function naFlags(na) {
    var f = {};
    Object.keys(na || {}).forEach(function (k) { f[k] = true; });
    return f;
  }

  function routeB() {
    return window.RouteB.evaluate(window.SPEC_B, partB.answers,
                                  naFlags(partB.na), partB.opened);
  }

  /*
   * Only a handful of answers change the SHAPE of the form (B0.5, B2.1, B7.4,
   * B10.1). Everything else just updates the counters. Redrawing on every
   * committed answer would throw the officer out of the box they are typing
   * in, so the redraw is deliberately narrow.
   */
  function onPartBCommit(key, value) {
    /*
     * The first old value seen in this window is the one kept, so a tick
     * followed by an untick before the write lands reads as one change from
     * where it started — or as no change at all, and is dropped at flush time.
     */
    if (!(key in partB.pendingAudit)) {
      partB.pendingAudit[key] = { old: partB.answers[key], new: value };
    } else {
      partB.pendingAudit[key].new = value;
    }

    partB.answers[key] = value;
    partB.pending[key] = value;

    setChip('pb-savechip', 'saving', 'Saving\u2026', 'સાચવાય છે');
    schedulePartBSave();

    if (window.RouteB.affectsRouting(key)) redrawPartB();
    else paintPartBProgress();
  }

  function schedulePartBSave() {
    if (partB.timer) clearTimeout(partB.timer);
    partB.timer = setTimeout(function () { flushPartB(); }, CONST.COMMIT_DEBOUNCE_MS);
  }

  /*
   * Mirrors flushPartA exactly, including the two things that matter most:
   * the answer and its audit entries go in ONE atomic batch, and a failed
   * write puts the batch back into pending so nothing typed is ever lost.
   *
   * `schemeId` is passed in rather than read from partB, because switching
   * schemes flushes the PREVIOUS scheme's work after partB has already been
   * pointed at the new one.
   */
  function flushPartB(extra, schemeId, naList) {
    if (partB.timer) { clearTimeout(partB.timer); partB.timer = null; }

    var id = schemeId || partB.schemeId;
    if (!id) return Promise.resolve();

    var keys = Object.keys(partB.pending);
    if (!keys.length && !extra && !naList) return Promise.resolve();

    var answers = {};
    keys.forEach(function (k) { answers[k] = partB.pending[k]; });
    /* Cleared immediately: anything committed while this write is in flight
       belongs to the NEXT batch, and must not be dropped by this one. */
    partB.pending = {};

    var auditTaken = partB.pendingAudit;
    partB.pendingAudit = {};
    var entries = [];
    Object.keys(auditTaken).forEach(function (k) {
      var rec = auditTaken[k];
      if (sameValue(rec.old, rec.new)) return;
      entries.push(auditEntry('B', id, k, rec.old, rec.new, 'edit'));
    });

    var scheme = schemeById(id) || {};
    var payload = {
      body: session.profile.body,
      scheme: id,
      status: (partB.meta.status === 'submitted') ? 'submitted' : 'draft',
      lastEditedBy: describeProfile(session.profile),
      lastEditedByEmail: session.user.email,
      lastEditedByUid: session.user.uid,
      lastEditedAt: window.FB.FieldValue.serverTimestamp()
    };
    /* Carried so the per-branch tracker can group schemes without re-reading
       js/schemes.js and the admin's applied corrections on top of it. */
    if (scheme.branch) payload.branch = scheme.branch;
    /*
     * The EDITOR's own branch — not the scheme's. 43 branch tags are guesses,
     * and who actually sits down to answer a scheme's questionnaire is the best
     * evidence there is about which branch runs it. Feature 16 shows this to
     * the admin. Absent for the Akademis, which have no branches.
     */
    if (session.profile.branch) payload.lastEditedByBranch = session.profile.branch;
    if (keys.length) payload.answers = answers;
    if (naList) payload.naSections = naList;
    if (extra) Object.keys(extra).forEach(function (k) { payload[k] = extra[k]; });

    if (extra && extra.status === 'submitted') {
      entries.push(auditEntry('B', id, '', '', 'submitted', 'submit'));
    }

    partB.saving = true;

    var batch = window.FB.db.batch();
    batch.set(window.FB.db.collection('responsesB').doc(id), payload, { merge: true });
    entries.forEach(function (e) {
      batch.set(window.FB.db.collection('audit').doc(), e);
    });

    var pr = batch.commit();

    /* Offline is a success: the write is already in the local store. */
    if (!navigator.onLine) {
      setChip('pb-savechip', 'saving', 'Saved on this device \u2014 will sync',
              'આ ઉપકરણ પર સચવાયું \u2014 પછી સિંક થશે');
    }

    /*
     * ⭐ Both handlers check the officer is STILL on this scheme.
     *
     * Leaving a scheme flushes it under its own id while partB has already
     * been pointed at the next one. Without this guard a failed write would
     * put the OLD scheme's answers back into pending, and the next save would
     * file them under the NEW scheme — one scheme's answers landing in
     * another's sheet, which nobody would ever spot.
     */
    function stillHere() { return partB.schemeId === id; }

    return pr.then(function () {
      if (!stillHere()) return;
      partB.saving = false;
      if (extra && extra.status) partB.meta.status = extra.status;
      if (!Object.keys(partB.pending).length) {
        setChip('pb-savechip', '', 'Saved \u2713', 'સચવાયું');
      }
    }).catch(function (err) {
      console.warn('[partB] save failed -', (err && err.code) || err);
      if (!stillHere()) {
        /* Nothing can be re-queued safely: this sheet is no longer the one on
           screen. The change is lost, but it is lost loudly — in the console
           and out of the log — rather than written to the wrong scheme. */
        return;
      }
      partB.saving = false;
      Object.keys(answers).forEach(function (k) {
        if (!(k in partB.pending)) partB.pending[k] = answers[k];
      });
      Object.keys(auditTaken).forEach(function (k) {
        if (partB.pendingAudit[k]) partB.pendingAudit[k].old = auditTaken[k].old;
        else partB.pendingAudit[k] = auditTaken[k];
      });
      setChip('pb-savechip', 'failed', 'Not saved \u2014 will retry',
              'સચવાયું નથી \u2014 ફરી પ્રયાસ થશે');
    });
  }

  /* Setting a section aside by hand is a saved decision, not a display trick,
     so it is written and logged like any other answer. */
  function setSectionNA(sectionId, on) {
    var was = sectionId in partB.na;
    if (was === !!on) return;

    if (on) partB.na[sectionId] = describeProfile(session.profile);
    else delete partB.na[sectionId];

    partB.pendingAudit[sectionId + ' (whole section)'] = {
      old: was ? 'does not apply' : 'applies',
      new: on ? 'does not apply' : 'applies'
    };
    setChip('pb-savechip', 'saving', 'Saving\u2026', 'સાચવાય છે');
    flushPartB(null, partB.schemeId, naToList(partB.na));
  }

  /* Redraw keeps the scroll position: the officer is usually looking at the
     answer that caused the change, and a jump to the top loses their place. */
  function redrawPartB() {
    var y = window.scrollY;
    drawPartB();
    window.scrollTo(0, y);
  }

  function drawPartB() {
    var host = $('pb-questions');
    host.innerHTML = '';

    var route = routeB();
    var spec = window.SPEC_B;
    var bySection = {};
    spec.questions.forEach(function (q) {
      (bySection[q.section] = bySection[q.section] || []).push(q);
    });

    spec.sections.forEach(function (sec) {
      var qs = bySection[sec.id] || [];
      if (!qs.length) return;

      /* A section set aside as a whole collapses to a single card, rather than
         a run of identical fold rows that would bury the sections around it. */
      var whole = !!route.sections[sec.id] &&
                  !qs.some(function (q) { return !route.isAside(q); });

      host.appendChild(sectionHead(sec, whole));

      if (whole) {
        host.appendChild(foldCard(sec.en + ' / ' + sec.gu, route.sections[sec.id],
                                  window.RouteB.answersInside(qs, partB.answers),
                                  sec.id, true));
        return;
      }

      qs.forEach(function (q) {
        if (route.isAside(q)) {
          host.appendChild(foldCard(q.id + ' — ' + q.en, route.reasonFor(q),
                                    window.RouteB.answersInside([q], partB.answers),
                                    q.id, false));
          return;
        }
        host.appendChild(window.Render.renderQuestion(
          q, partB.answers, onPartBCommit,
          { text: CONST.TEXT_CAP, longtext: CONST.LONGTEXT_CAP }));
      });
    });

    paintPartBProgress(route);
  }

  function sectionHead(sec, isFolded) {
    var h = document.createElement('div');
    h.className = 'sec-head';

    var row = document.createElement('div');
    row.className = 'sec-head-row';

    var left = document.createElement('div');
    var t = document.createElement('h3');
    t.textContent = sec.id + '. ' + sec.en;
    var g = document.createElement('div');
    g.className = 'guj';
    g.textContent = sec.gu;
    left.appendChild(t); left.appendChild(g);
    row.appendChild(left);

    /*
     * The officer's own judgement about their own scheme beats our rules, so
     * they can set a section aside by hand. B0 and B11 are excluded — B0 holds
     * the scheme's identity and B0.5, which every rule reads, and an officer's
     * own view of a scheme always applies.
     */
    if (window.RouteB.canMarkNA(sec.id) && !isFolded) {
      var na = document.createElement('button');
      na.type = 'button';
      na.className = 'sec-na';
      na.textContent = 'This section does not apply / આ વિભાગ લાગુ પડતો નથી';
      na.addEventListener('click', function () {
        setSectionNA(sec.id, true);
        delete partB.opened[sec.id];
        redrawPartB();
      });
      row.appendChild(na);
    }

    h.appendChild(row);
    return h;
  }

  /*
   * One folded question or one folded section. Always carries three things:
   * what was set aside, why, and the way back.
   */
  function foldCard(title, reason, keptCount, openKey, isSection) {
    var card = document.createElement('div');
    card.className = 'fold' + (isSection ? ' sec' : '');
    card.dataset.foldKey = openKey;

    var row = document.createElement('div');
    row.className = 'fold-row';

    var left = document.createElement('div');
    var what = document.createElement('div');
    what.className = 'fold-what';
    what.textContent = title;
    left.appendChild(what);

    var why = document.createElement('div');
    why.className = 'fold-why';
    var reasonEN = reason.reasonEN;
    /* An officer opening a colleague's sheet must see WHOSE decision this was,
       or "you marked this section" would be plainly wrong for them. */
    if (reason.byOfficer && partB.na[openKey] &&
        partB.na[openKey] !== describeProfile(session.profile)) {
      reasonEN = 'Set aside by ' + partB.na[openKey] + ', as not applying to this scheme.';
    }
    why.appendChild(document.createTextNode(reasonEN));
    var wg = document.createElement('span');
    wg.className = 'guj';
    wg.textContent = reason.reasonGU;
    why.appendChild(wg);
    left.appendChild(why);

    /* Folding over existing answers is the one case that could look like data
       loss. Saying how many are in there — and that they are safe — is what
       stops an officer thinking their work vanished. */
    if (keptCount) {
      var kept = document.createElement('div');
      kept.className = 'fold-kept';
      kept.textContent = keptCount + ' answer(s) already recorded here are kept, not deleted';
      var keptGu = document.createElement('span');
      keptGu.className = 'guj block';
      keptGu.textContent = 'અહીં અપાયેલા ' + keptCount + ' જવાબ સચવાયેલા છે, ભૂંસાયા નથી';
      kept.appendChild(keptGu);
      left.appendChild(kept);
    }
    row.appendChild(left);

    var btn = document.createElement('button');
    btn.type = 'button';
    btn.className = 'btn ghost sm';
    btn.appendChild(document.createTextNode(
      reason.byOfficer ? 'It does apply — show it ' : 'Show anyway '));
    var labGu = document.createElement('span');
    labGu.className = 'guj';
    labGu.textContent = reason.byOfficer ? '/ લાગુ પડે છે — બતાવો' : '/ તો પણ બતાવો';
    btn.appendChild(labGu);
    btn.addEventListener('click', function () {
      /* Opening an officer-marked section also clears the mark, so it does not
         silently fold shut again the next time the form is drawn. */
      if (reason.byOfficer) setSectionNA(openKey, false);
      partB.opened[openKey] = true;
      redrawPartB();
    });
    row.appendChild(btn);

    card.appendChild(row);
    return card;
  }

  /*
   * The denominator is what this scheme is actually being asked, not a flat 58.
   * Against 58 a routed scheme could never read as finished, and every scheme
   * would sit permanently short on the tracker.
   */
  function paintPartBProgress(route) {
    route = route || routeB();
    var st = window.Render.progress(route.shown, partB.answers);

    $('pb-progbar').style.width = st.percent + '%';

    var node = $('pb-progtext');
    node.innerHTML = '';
    node.appendChild(document.createTextNode(
      st.done + ' of ' + st.total + ' answered · ' +
      st.done + ' માંથી ' + st.total + ' જવાબ અપાયા'));

    if (st.blockingLeft) {
      var pill = document.createElement('span');
      pill.className = 'pill block';
      pill.style.marginLeft = '8px';
      pill.textContent = st.blockingLeft + ' blocking left';
      node.appendChild(pill);
    }

    var aside = $('pb-asidetext');
    var n = route.counts.setAside;
    aside.textContent = n
      ? n + ' of the 58 questions are set aside for this scheme · આ યોજના માટે ૫૮ માંથી '
          + n + ' પ્રશ્નો બાજુ પર રખાયા છે'
      : 'All 58 questions apply to this scheme · આ યોજનાને બધા ૫૮ પ્રશ્નો લાગુ પડે છે';
  }

  /* The escape hatch for our own rules being wrong: open every fold at once. */
  function showEveryPartBQuestion() {
    window.SPEC_B.sections.forEach(function (s) { partB.opened[s.id] = true; });
    window.SPEC_B.questions.forEach(function (q) { partB.opened[q.id] = true; });
    redrawPartB();
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 8 — Admin: progress tracker + audit viewer
   *
   *  Everything here loads on demand and on an explicit Refresh, never through
   *  a live listener. A listener on these collections would bill a read every
   *  time any officer autosaves anywhere — the one pattern that could actually
   *  burn through the free daily allowance while nobody is even looking.
   * ---------------------------------------------------------------- */
  var admin = { auditRows: [], lastDoc: null, exhausted: false, loading: false,
                branchGroups: [], partBSheets: {} };

  /* "A1.1.channels" -> { qid:'A1.1', part:'channels' }. The question id itself
     contains a dot, so this splits on the SECOND one. */
  function splitAnswerKey(key) {
    var m = /^([AB]\d+\.\d+)\.(.*)$/.exec(key || '');
    return m ? { qid: m[1], part: m[2] } : { qid: key || '', part: '' };
  }

  /* Part B entries land in the same log, so the viewer has to know both specs —
     otherwise every per-scheme change would read as a bare id with no text. */
  function questionText(qid) {
    var found = '';
    (window.SPEC_A.questions || []).forEach(function (q) { if (q.id === qid) found = q.en; });
    if (!found) {
      (window.SPEC_B.questions || []).forEach(function (q) { if (q.id === qid) found = q.en; });
    }
    if (!found) {
      (window.SPEC_B.sections || []).forEach(function (x) {
        if (qid === x.id + ' (whole section)') found = x.en + ' — whole section';
      });
    }
    /* Feature 16 logs branch-tag changes against the scheme itself, so the row
       would otherwise read as a bare "branch" with no explanation. */
    if (!found && qid === 'branch') found = 'Which branch runs this scheme';
    return found;
  }

  /* ---------------- tracker ---------------- */
  function renderTracker(rows, officers) {
    var host = $('adm-tracker');
    host.innerHTML = '';

    CONST.BODIES.forEach(function (body) {
      var r = rows[body.id] || {};
      var st = window.Render.progress(window.SPEC_A.questions, r.answers || {});

      var box = document.createElement('div');
      box.className = 'trow';

      var head = document.createElement('div');
      head.className = 'trow-head';
      var name = document.createElement('div');
      var b = document.createElement('b');
      b.textContent = body.en;
      var g = document.createElement('div');
      g.className = 'guj';
      g.textContent = body.gu;
      name.appendChild(b); name.appendChild(g);

      var pill = document.createElement('span');
      if (r.status === 'submitted') { pill.className = 'pill done'; pill.textContent = 'Submitted'; }
      else if (st.done > 0)        { pill.className = 'pill draft'; pill.textContent = 'In progress'; }
      else                         { pill.className = 'pill todo';  pill.textContent = 'Not started'; }

      head.appendChild(name); head.appendChild(pill);
      box.appendChild(head);

      var bar = document.createElement('div');
      bar.className = 'prog';
      var fill = document.createElement('i');
      fill.style.width = st.percent + '%';
      bar.appendChild(fill);
      box.appendChild(bar);

      var line = document.createElement('p');
      line.className = 'mini';
      line.textContent = st.done + ' of ' + st.total + ' answered'
        + (st.blockingLeft ? ' \u00b7 ' + st.blockingLeft + ' blocking still empty' : '')
        + (r.lastEditedBy ? ' \u00b7 last edited by ' + r.lastEditedBy : '');
      box.appendChild(line);

      /*
       * Part A is a single sheet per body, so a branch cannot have its own
       * percentage — what a branch does have is people. This lists who is
       * registered where, and who has actually touched the sheet, which is the
       * useful question while Part A is the only questionnaire built.
       * Per-scheme progress by branch arrives with Part B, which is branch-tagged.
       */
      if (body.hasBranches && officers) {
        var wrap = document.createElement('div');
        wrap.className = 'branchlist';
        var cap = document.createElement('div');
        cap.className = 'mini';
        cap.textContent = 'Officers registered, by branch / શાખા પ્રમાણે નોંધાયેલ અધિકારીઓ';
        wrap.appendChild(cap);

        CONST.BRANCHES.forEach(function (br) {
          var list = officers.filter(function (o) {
            return o.body === body.id && o.branch === br.id;
          });
          var row = document.createElement('div');
          row.className = 'branchrow';
          var left = document.createElement('span');
          left.textContent = br.en + ' / ' + br.gu;
          var right = document.createElement('span');
          right.className = 'muted';
          right.textContent = list.length
            ? list.map(function (o) { return o.name; }).join(', ')
            : 'no officer registered yet';
          row.appendChild(left); row.appendChild(right);
          wrap.appendChild(row);
        });

        var noBranch = officers.filter(function (o) {
          return o.body === body.id && !o.branch;
        });
        if (noBranch.length) {
          var row2 = document.createElement('div');
          row2.className = 'branchrow';
          var l2 = document.createElement('span');
          l2.textContent = 'No branch recorded';
          var r2 = document.createElement('span');
          r2.className = 'muted';
          r2.textContent = noBranch.map(function (o) { return o.name; }).join(', ');
          row2.appendChild(l2); row2.appendChild(r2);
          wrap.appendChild(row2);
        }
        box.appendChild(wrap);
      }

      host.appendChild(box);
    });
  }

  function loadTracker() {
    var host = $('adm-tracker');
    host.innerHTML = '<p class="mini">Loading\u2026 / લવાય છે…</p>';

    var jobs = CONST.BODIES.map(function (b) {
      return window.FB.db.collection('responsesA').doc(b.id).get()
        .then(function (snap) { return { id: b.id, data: snap.exists ? snap.data() : null }; })
        .catch(function () { return { id: b.id, data: null }; });
    });
    /* Officer list is a nice-to-have; a failure there must not take the
       whole tracker down with it. */
    jobs.push(window.FB.db.collection('users').get()
      .then(function (qs) {
        var list = [];
        qs.forEach(function (d) { list.push(d.data()); });
        return { id: '__users', data: list };
      })
      .catch(function (err) {
        console.warn('[admin] officer list unavailable -', (err && err.code) || err);
        return { id: '__users', data: null };
      }));

    return Promise.all(jobs).then(function (res) {
      var rows = {}, officers = null;
      res.forEach(function (r) {
        if (r.id === '__users') officers = r.data;
        else if (r.data) rows[r.id] = r.data;
      });
      renderTracker(rows, officers);
    });
  }

  /* ---------------- audit viewer ---------------- */
  function auditQuery() {
    var q = window.FB.db.collection('audit')
      .orderBy('ts', 'desc')
      .limit(CONST.AUDIT_PAGE_SIZE);
    if (admin.lastDoc) q = q.startAfter(admin.lastDoc);
    return q;
  }

  function matchesFilter(e) {
    var body = $('adm-f-body').value;
    if (body && e.actorBody !== body) return false;

    var text = ($('adm-f-text').value || '').trim().toLowerCase();
    if (!text) return true;

    return [e.actorName, e.actorRank, e.actorEmail, e.qid, e.oldValue, e.newValue,
            questionText(splitAnswerKey(e.qid).qid)]
      .some(function (v) { return String(v || '').toLowerCase().indexOf(text) !== -1; });
  }

  function renderAudit() {
    var tbody = $('adm-audit-rows');
    tbody.innerHTML = '';

    var shown = admin.auditRows.filter(matchesFilter);

    if (!shown.length) {
      var tr = document.createElement('tr');
      var td = document.createElement('td');
      td.colSpan = 4;
      td.className = 'audit-empty';
      td.textContent = admin.auditRows.length
        ? 'No entries match this filter. / આ ગાળણી સાથે કોઈ નોંધ મળી નથી.'
        : 'No changes recorded yet. / હજુ કોઈ ફેરફાર નોંધાયો નથી.';
      tr.appendChild(td); tbody.appendChild(tr);
    }

    shown.forEach(function (e) {
      var tr = document.createElement('tr');

      var when = document.createElement('td');
      when.className = 'audit-when';
      when.textContent = fmtWhen(e.ts) || '\u2014';
      tr.appendChild(when);

      var who = document.createElement('td');
      var bodyObj = bodyById(e.actorBody);
      var brObj = e.actorBranch ? branchById(e.actorBranch) : null;
      var n = document.createElement('div');
      n.textContent = e.actorName || e.actorEmail;
      var sub = document.createElement('div');
      sub.className = 'muted';
      sub.textContent = [e.actorRank, bodyObj ? bodyObj.en : e.actorBody, brObj ? brObj.en : '']
        .filter(Boolean).join(' \u00b7 ');
      who.appendChild(n); who.appendChild(sub);
      tr.appendChild(who);

      var qcell = document.createElement('td');
      if (e.action === 'submit') {
        qcell.textContent = 'Submitted the questionnaire';
      } else {
        var parts = splitAnswerKey(e.qid);
        var qn = document.createElement('div');
        qn.textContent = parts.qid + (parts.part ? ' \u00b7 ' + parts.part : '');
        var qt = document.createElement('div');
        qt.className = 'muted';
        qt.textContent = questionText(parts.qid);
        qcell.appendChild(qn); qcell.appendChild(qt);
      }
      tr.appendChild(qcell);

      var change = document.createElement('td');
      if (e.action === 'submit') {
        change.textContent = '\u2014';
      } else {
        if (e.oldValue) {
          var o = document.createElement('span');
          o.className = 'audit-old';
          o.textContent = e.oldValue;
          change.appendChild(o);
          var ar = document.createElement('span');
          ar.className = 'audit-arrow';
          ar.textContent = '\u2192';
          change.appendChild(ar);
        }
        var nv = document.createElement('span');
        nv.className = 'audit-new';
        nv.textContent = e.newValue || '(cleared)';
        change.appendChild(nv);
      }
      tr.appendChild(change);

      tbody.appendChild(tr);
    });

    /*
     * Filtering happens over what has been loaded, not over the whole
     * collection — a server-side filter combined with newest-first ordering
     * would need a composite index created by hand in the console. Saying so
     * plainly beats an admin concluding that an entry does not exist.
     */
    var note = $('adm-audit-note');
    var filtering = $('adm-f-body').value || ($('adm-f-text').value || '').trim();
    note.textContent = 'Showing ' + shown.length + ' of ' + admin.auditRows.length + ' loaded'
      + (admin.exhausted ? ' (all entries loaded)' : '')
      + (filtering && !admin.exhausted
          ? ' \u00b7 filters apply to loaded entries \u2014 use Load more to search further back'
          : '');

    $('adm-audit-more').classList.toggle('hidden', admin.exhausted);
  }

  function loadAudit(more) {
    if (admin.loading) return Promise.resolve();
    admin.loading = true;

    if (!more) {
      admin.auditRows = [];
      admin.lastDoc = null;
      admin.exhausted = false;
    }

    return auditQuery().get()
      .then(function (qs) {
        qs.forEach(function (d) { admin.auditRows.push(d.data()); });
        admin.lastDoc = qs.docs.length ? qs.docs[qs.docs.length - 1] : admin.lastDoc;
        if (qs.docs.length < CONST.AUDIT_PAGE_SIZE) admin.exhausted = true;
        admin.loading = false;
        renderAudit();
      })
      .catch(function (err) {
        admin.loading = false;
        console.warn('[admin] audit read failed -', (err && err.code) || err);
        $('adm-audit-note').textContent =
          'Could not load the audit log. / ઓડિટ લોગ લાવી શકાયો નથી.';
      });
  }

  /* ---------------- admin: pending scheme corrections ---------------- */
  function renderFixes(list) {
    var host = $('adm-fixes');
    host.innerHTML = '';

    if (!list.length) {
      var n = document.createElement('div');
      n.className = 'fix-none';
      n.textContent = 'No corrections reported. / કોઈ સુધારો સૂચવાયો નથી.';
      host.appendChild(n);
      return;
    }

    list.forEach(function (f) {
      var x = schemeById(f.schemeId);
      var row = document.createElement('div');
      row.className = 'fixrow';

      var t = document.createElement('div');
      t.style.fontWeight = '600';
      t.style.fontSize = '13.5px';
      t.textContent = f.schemeId + (x ? ' \u00b7 ' + x.nameEN : '');
      row.appendChild(t);

      var mv = document.createElement('div');
      mv.className = 'move';
      var fromBody = bodyById(f.currentBody), toBody = bodyById(f.suggestedBody || f.currentBody);
      var fromBr = f.currentBranch ? branchById(f.currentBranch) : null;
      var toBr = f.suggestedBranch ? branchById(f.suggestedBranch) : fromBr;
      mv.appendChild(document.createTextNode(
        (fromBody ? fromBody.en : f.currentBody) + (fromBr ? ' \u2192 ' + fromBr.en : '')));
      var ar = document.createElement('span');
      ar.className = 'arrow'; ar.textContent = '\u21d2';
      mv.appendChild(ar);
      var to = document.createElement('b');
      to.textContent = (toBody ? toBody.en : '') + (toBr ? ' \u2192 ' + toBr.en : '');
      mv.appendChild(to);
      row.appendChild(mv);

      if (f.note) {
        var nt = document.createElement('div');
        nt.className = 'note-txt';
        nt.textContent = '\u201c' + f.note + '\u201d';
        row.appendChild(nt);
      }

      var who = document.createElement('div');
      who.className = 'who';
      var w = fmtWhen(f.ts);
      who.textContent = 'Reported by ' + (f.byName || f.byEmail)
        + (f.byRank ? ' \u00b7 ' + f.byRank : '') + (w ? ' \u00b7 ' + w : '');
      row.appendChild(who);

      var acts = document.createElement('div');
      acts.className = 'acts';
      var apply = document.createElement('button');
      apply.className = 'btn sm';
      apply.textContent = 'Apply';
      apply.addEventListener('click', function () { resolveFix(f, true, apply); });
      var drop = document.createElement('button');
      drop.className = 'btn ghost sm';
      drop.textContent = 'Dismiss';
      drop.addEventListener('click', function () { resolveFix(f, false, drop); });
      acts.appendChild(apply); acts.appendChild(drop);
      row.appendChild(acts);

      host.appendChild(row);
    });
  }

  /*
   * Applying writes the override first and only then marks the report handled.
   * If the order were reversed a failure would leave a report marked done with
   * the scheme never actually moved — the one outcome nobody would notice.
   */
  function resolveFix(f, apply, btn) {
    btn.disabled = true;
    var pr = session.profile || {};

    var step = Promise.resolve();
    if (apply) {
      var ov = {
        updatedBy: describeProfile(session.profile),
        updatedByEmail: session.user.email,
        updatedAt: window.FB.FieldValue.serverTimestamp(),
        branchConfirmed: true
      };
      if (f.suggestedBody) ov.body = f.suggestedBody;
      if (f.suggestedBranch) ov.branch = f.suggestedBranch;
      step = window.FB.db.collection('schemes').doc(f.schemeId).set(ov, { merge: true });
    }

    step
      .then(function () {
        return window.FB.db.collection('schemeFixes').doc(f.__id).set({
          status: apply ? 'applied' : 'dismissed',
          resolvedBy: session.user.email,
          resolvedAt: window.FB.FieldValue.serverTimestamp()
        }, { merge: true });
      })
      .then(function () { return loadSchemeOverrides(); })
      .then(function () { loadFixes(); })
      .catch(function (err) {
        console.warn('[fix] resolve failed -', (err && err.code) || err);
        btn.disabled = false;
      });
  }

  /* ---------------------------------------------------------------- *
   *  FEATURE 17 — Part B progress, branch by branch.
   *
   *  This is the breakdown that was impossible for Part A: Part A is ONE sheet
   *  per body, so a branch has no percentage of its own. Part B is per scheme,
   *  and schemes carry a branch, so the question finally has an answer.
   *
   *  READ COST: one query per body — never one per scheme. A response document
   *  only exists once somebody has started, so an untouched branch costs
   *  nothing at all. No live listeners, here or anywhere.
   * ---------------------------------------------------------------- */

  /*
   * The groups schemes are counted in. The Commissionerate splits by branch;
   * an Akademi has no branches, so the body IS the group. Anything filed under
   * the Commissionerate with an unrecognised branch still gets a group of its
   * own rather than vanishing from the totals.
   */
  function progressGroups() {
    var groups = [];
    CONST.BRANCHES.forEach(function (b) {
      groups.push({ key: 'commissionerate/' + b.id, body: 'commissionerate', branch: b.id,
                    en: b.en, gu: b.gu });
    });
    CONST.BODIES.forEach(function (b) {
      if (b.id === 'commissionerate') return;
      groups.push({ key: b.id, body: b.id, branch: null, en: b.en, gu: b.gu });
    });
    return groups;
  }

  function groupKeyFor(x) {
    return x.body === 'commissionerate' ? 'commissionerate/' + (x.branch || 'other') : x.body;
  }

  /*
   * sheets — { schemeId: responseB data }, from one query per body.
   *
   * "Blocking still blank" is counted ONLY across schemes somebody has started.
   * Counting untouched schemes too would bury the real signal under 39 × every
   * scheme nobody has opened — and "not started" is already its own column.
   */
  function branchProgress(sheets) {
    var groups = progressGroups();
    var index = {};
    groups.forEach(function (g) {
      g.total = 0; g.notStarted = 0; g.inProgress = 0; g.submitted = 0;
      g.answered = 0; g.asked = 0; g.blocking = 0; g.untouched = [];
      index[g.key] = g;
    });

    /* Establishment lines are excluded: nobody applies for an advertising
       budget, so they are never going to have a questionnaire. Counting them
       would make every branch permanently unfinishable. */
    allSchemes().filter(function (x) { return !x.admin; }).forEach(function (x) {
      var g = index[groupKeyFor(x)];
      if (!g) {
        g = { key: groupKeyFor(x), body: x.body, branch: x.branch || null,
              en: 'Other / not yet tagged', gu: 'અન્ય / હજુ શાખા નક્કી નથી',
              total: 0, notStarted: 0, inProgress: 0, submitted: 0,
              answered: 0, asked: 0, blocking: 0, untouched: [] };
        index[g.key] = g; groups.push(g);
      }
      g.total++;

      var d = sheets[x.id];
      if (!d) {
        g.notStarted++;
        g.untouched.push(x);
        return;
      }
      if (d.status === 'submitted') g.submitted++; else g.inProgress++;

      var route = partBRoute(d.answers || {}, d.naSections);
      var st = window.Render.progress(route.shown, d.answers || {});
      g.answered += st.done;
      g.asked += st.total;
      g.blocking += st.blockingLeft;
    });

    return groups.filter(function (g) { return g.total > 0; });
  }

  /* One query per body. A failed body degrades to "not started" for its
     schemes rather than taking the whole screen down. */
  function loadAllPartBSheets(bodyIds) {
    return Promise.all(bodyIds.map(function (id) {
      return window.FB.db.collection('responsesB').where('body', '==', id).get()
        .then(function (qs) {
          var out = {};
          qs.forEach(function (d) { out[d.id] = d.data() || {}; });
          return out;
        })
        .catch(function (err) {
          console.warn('[progress] read failed for ' + id + ' -', (err && err.code) || err);
          return null;
        });
    })).then(function (parts) {
      var all = {}, failed = 0;
      parts.forEach(function (o) {
        if (!o) { failed++; return; }
        Object.keys(o).forEach(function (k) { all[k] = o[k]; });
      });
      return { sheets: all, failed: failed };
    });
  }

  /* ---------------- admin: the branch tracker ---------------- */

  /*
   * ONE load for the whole admin screen.
   *
   * The branch tracker and the tag panel both want the same Part B sheets — the
   * tracker to count them, the tag panel to say which branch is answering a
   * scheme. Loading separately meant querying the Commissionerate twice every
   * time the screen opened, for no gain.
   */
  function loadAdminPartB() {
    $('adm-b-note').textContent = 'Loading\u2026 / લવાય છે…';
    $('adm-tags-note').textContent = 'Loading\u2026 / લવાય છે…';

    return loadSchemeOverrides()
      .then(function () {
        return loadAllPartBSheets(CONST.BODIES.map(function (b) { return b.id; }));
      })
      .then(function (res) {
        admin.partBSheets = res.sheets;
        renderBranchProgress(branchProgress(res.sheets), res.failed);

        var worked = {};
        Object.keys(res.sheets).forEach(function (id) {
          var v = res.sheets[id];
          if (v && v.lastEditedByBranch) worked[id] = v.lastEditedByBranch;
        });
        renderBranchTags(unconfirmedTags(), worked);
      });
  }

  function renderBranchProgress(groups, failed) {
    var host = $('adm-b-tracker');
    host.innerHTML = '';
    admin.branchGroups = groups;

    var tot = { total: 0, submitted: 0, inProgress: 0, notStarted: 0, blocking: 0 };
    groups.forEach(function (g) {
      tot.total += g.total; tot.submitted += g.submitted;
      tot.inProgress += g.inProgress; tot.notStarted += g.notStarted;
      tot.blocking += g.blocking;
    });

    /*
     * A failed read must never be shown as "nobody has started" — that is the
     * one wrong number that would send an officer chasing work already done.
     */
    $('adm-b-note').textContent = failed
      ? 'Could not read ' + failed + ' of ' + CONST.BODIES.length
        + ' offices — the figures below are incomplete. Press Refresh. '
        + '· અમુક કચેરીની માહિતી મળી નથી — આંકડા અધૂરા છે.'
      : tot.total + ' schemes · ' + tot.submitted + ' submitted · ' + tot.inProgress
        + ' in progress · ' + tot.notStarted + ' not started';

    groups.forEach(function (g) {
      var row = document.createElement('div');
      row.className = 'brow';

      var head = document.createElement('div');
      head.className = 'brow-head';
      var nm = document.createElement('div');
      nm.className = 'brow-name';
      nm.appendChild(document.createTextNode(g.en + ' '));
      var gu = document.createElement('span');
      gu.className = 'guj';
      gu.textContent = '/ ' + g.gu;
      nm.appendChild(gu);
      head.appendChild(nm);

      var counts = document.createElement('div');
      counts.className = 'brow-counts';
      counts.innerHTML = '';
      counts.appendChild(document.createTextNode(g.total + ' schemes \u00b7 '));
      var b1 = document.createElement('b'); b1.textContent = g.submitted + ' submitted';
      counts.appendChild(b1);
      counts.appendChild(document.createTextNode(' \u00b7 ' + g.inProgress + ' in progress \u00b7 '
                                                 + g.notStarted + ' not started'));
      head.appendChild(counts);
      row.appendChild(head);

      var prog = document.createElement('div');
      prog.className = 'prog';
      var bar = document.createElement('i');
      bar.style.width = (g.total ? Math.round((g.submitted / g.total) * 100) : 0) + '%';
      prog.appendChild(bar);
      row.appendChild(prog);

      var sub = document.createElement('div');
      sub.className = 'brow-sub';
      if (g.asked) {
        sub.appendChild(document.createTextNode(
          g.answered + ' of ' + g.asked + ' questions answered across the sheets already started'));
        if (g.blocking) {
          var w = document.createElement('span');
          w.className = 'brow-warn';
          w.textContent = '  \u00b7  ' + g.blocking + ' important questions still blank';
          sub.appendChild(w);
        }
      } else {
        sub.textContent = 'Nothing started yet in this branch \u00b7 આ શાખામાં હજુ કંઈ શરૂ થયું નથી';
      }
      row.appendChild(sub);

      /*
       * "33 not started" tells an admin nothing to act on; WHICH 33 does. Kept
       * folded because Youth Board's list alone would otherwise dominate.
       */
      if (g.untouched.length) {
        var btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'brow-toggle';
        var list = document.createElement('div');
        list.className = 'brow-list hidden';
        g.untouched.forEach(function (x) {
          var d = document.createElement('div');
          d.textContent = x.id + '  \u00b7  ' + x.nameEN;
          list.appendChild(d);
        });
        function label() {
          btn.textContent = (list.classList.contains('hidden') ? 'Show the ' : 'Hide the ')
                          + g.untouched.length + ' nobody has started';
        }
        label();
        btn.addEventListener('click', function () {
          list.classList.toggle('hidden');
          label();
        });
        row.appendChild(btn);
        row.appendChild(list);
      }

      host.appendChild(row);
    });
  }

  /*
   * Plain text, for pasting into an email or a note upward. Built from the same
   * numbers on screen, so the two can never disagree.
   */
  function branchSummaryText() {
    var groups = admin.branchGroups || [];
    var lines = ['Part B progress — cultural schemes questionnaire'];
    var tot = { t: 0, s: 0, p: 0, n: 0, b: 0 };

    groups.forEach(function (g) {
      tot.t += g.total; tot.s += g.submitted; tot.p += g.inProgress;
      tot.n += g.notStarted; tot.b += g.blocking;
      lines.push('');
      lines.push(g.en);
      lines.push('  schemes: ' + g.total
               + ' | submitted: ' + g.submitted
               + ' | in progress: ' + g.inProgress
               + ' | not started: ' + g.notStarted);
      if (g.asked) {
        lines.push('  answered: ' + g.answered + ' of ' + g.asked
                 + ' | important questions still blank: ' + g.blocking);
      }
    });

    lines.push('');
    lines.push('TOTAL: ' + tot.t + ' schemes | ' + tot.s + ' submitted | '
             + tot.p + ' in progress | ' + tot.n + ' not started');
    return lines.join('\n');
  }

  function copyBranchSummary() {
    var text = branchSummaryText();
    var box = $('adm-b-copybox');
    var btn = $('adm-b-copy');

    function fallback() {
      /* Clipboard access is refused on plain http and by some locked-down
         district machines. Showing the text, selected, always works. */
      box.classList.remove('hidden');
      $('adm-b-copytext').value = text;
      $('adm-b-copytext').focus();
      $('adm-b-copytext').select();
    }

    if (!navigator.clipboard || !navigator.clipboard.writeText) return fallback();

    navigator.clipboard.writeText(text).then(function () {
      box.classList.add('hidden');
      var was = btn.textContent;
      btn.textContent = 'Copied \u2713';
      setTimeout(function () { btn.textContent = was; }, 1800);
    }).catch(fallback);
  }

  /* ---------------- the officer's own branch, on Home ---------------- */

  /*
   * Costs NOTHING extra: the picker already queries this officer's body, and
   * this reuses that same result. Their own branch only — an officer does not
   * need the whole department, they need to know where their own work stands.
   */
  function paintMyBranchProgress() {
    var box = $('home-b-mine');
    var pr = session.profile || {};

    if (!picker.loaded) { box.classList.add('hidden'); return; }

    var wantKey = pr.body === 'commissionerate'
      ? 'commissionerate/' + (pr.branch || 'other')
      : pr.body;

    var sheets = {};
    Object.keys(picker.statuses || {}).forEach(function (id) {
      var st = picker.statuses[id];
      sheets[id] = { status: st.status, answers: st.answers || {}, naSections: st.naSections };
    });

    var mine = null;
    branchProgress(sheets).forEach(function (g) { if (g.key === wantKey) mine = g; });
    if (!mine) { box.classList.add('hidden'); return; }

    box.classList.remove('hidden');
    $('home-b-mine-title').textContent = 'Your branch — ' + mine.en;

    var pill = $('home-b-mine-pill');
    var doneAll = mine.total && mine.submitted === mine.total;
    pill.className = 'pill ' + (doneAll ? 'done' : (mine.submitted || mine.inProgress ? 'draft' : 'todo'));
    pill.textContent = doneAll ? 'All submitted' : mine.submitted + ' of ' + mine.total + ' submitted';

    $('home-b-mine-bar').style.width =
      (mine.total ? Math.round((mine.submitted / mine.total) * 100) : 0) + '%';

    $('home-b-mine-text').textContent =
      mine.total + ' schemes \u00b7 ' + mine.submitted + ' submitted \u00b7 '
      + mine.inProgress + ' in progress \u00b7 ' + mine.notStarted + ' not started'
      + '  \u00b7  ' + mine.total + ' યોજના, ' + mine.submitted + ' સબમિટ';
  }

  /* ---------------- FEATURE 16 (admin half) — branch tags ---------------- */

  /*
   * The schemes whose branch is still our guess. Read from the merged list, so
   * anything already confirmed — by an officer or by an applied correction —
   * has already dropped out.
   */
  function unconfirmedTags() {
    return allSchemes().filter(function (x) { return x.branchGuess === true; });
  }

  /*
   * ONE query, and only for the Commissionerate: every unconfirmed tag is a
   * Commissionerate scheme (Patrak-5's 40, plus P8-01/P10-01/P10-02), and the
   * Akademis have no branches to confirm. Nothing is read per scheme.
   */
  /* Both Refresh buttons reload the whole admin picture, so the two panels can
     never drift apart on screen. */
  function loadBranchTags() { return loadAdminPartB(); }

  function renderBranchTags(list, worked) {
    var host = $('adm-tags');
    host.innerHTML = '';

    var total = (window.SCHEMES || []).filter(function (x) { return x.branchGuess; }).length;
    var done = total - list.length;
    $('adm-tags-note').textContent =
      done + ' of ' + total + ' confirmed \u00b7 ' + list.length + ' still to check'
      + '  \u00b7  ' + total + ' માંથી ' + done + ' ખાતરી થઈ';

    if (!list.length) {
      var e = document.createElement('div');
      e.className = 'scheme-empty';
      e.textContent = 'Every branch tag has been confirmed. / બધી શાખાની ખાતરી થઈ ગઈ છે.';
      host.appendChild(e);
      return;
    }

    list.forEach(function (x) {
      var row = document.createElement('div');
      row.className = 'tagrow';

      var nm = document.createElement('div');
      nm.className = 'nm';
      nm.textContent = x.nameEN;
      var gu = document.createElement('div');
      gu.className = 'nm-gu guj';
      gu.textContent = x.nameGU;
      row.appendChild(nm); row.appendChild(gu);

      var meta = document.createElement('div');
      meta.className = 'meta';
      var bits = [x.id];
      if (x.patrak) bits.push('Patrak-' + x.patrak);
      if (typeof x.allocationCr === 'number') bits.push('\u20b9 ' + x.allocationCr.toFixed(2) + ' cr');
      var cur = branchById(x.branch);
      bits.push('we guessed: ' + (cur ? cur.en : x.branch));
      meta.textContent = bits.join('  \u00b7  ');
      row.appendChild(meta);

      /*
       * The one piece of real evidence available: who has actually sat down to
       * answer this scheme's questionnaire. If the Celebration officer is
       * filling it in, it is almost certainly a Celebration scheme. Useless on
       * day one, better every week.
       */
      /*
       * 3 of the 43 are establishment lines (a corpus fund, a theatre
       * establishment, an advertising budget). Those are hidden from officers,
       * so no officer will ever confirm them and no evidence will ever appear.
       * Saying so stops an admin waiting for input that cannot come.
       */
      if (x.admin) {
        var est = document.createElement('div');
        est.className = 'evidence';
        est.textContent = 'Establishment line — officers never see this one, so only you can settle it'
                        + '  ·  સ્થાપના ખર્ચ — અધિકારીઓને દેખાતી નથી, ફક્ત આપ જ નક્કી કરી શકો';
        row.appendChild(est);
      }

      if (worked[x.id]) {
        var ev = document.createElement('div');
        ev.className = 'evidence';
        var w = branchById(worked[x.id]);
        ev.textContent = 'Being answered by the ' + (w ? w.en : worked[x.id])
                       + ' branch' + (worked[x.id] === x.branch ? ' \u2014 agrees with the guess'
                                                                : ' \u2014 DIFFERENT from the guess');
        row.appendChild(ev);
      }

      var acts = document.createElement('div');
      acts.className = 'acts';

      var yes = document.createElement('button');
      yes.className = 'btn sm';
      yes.textContent = 'Confirm';
      yes.addEventListener('click', function () { applyTag(x, null, row); });
      acts.appendChild(yes);

      var sel = document.createElement('select');
      fillSelect(sel, CONST.BRANCHES, 'Change to\u2026 / બદલો…');
      acts.appendChild(sel);

      var move = document.createElement('button');
      move.className = 'btn ghost sm';
      move.textContent = 'Change';
      move.addEventListener('click', function () {
        if (!sel.value || sel.value === x.branch) return;
        applyTag(x, sel.value, row);
      });
      acts.appendChild(move);

      row.appendChild(acts);
      host.appendChild(row);
    });
  }

  function applyTag(x, newBranch, row) {
    row.classList.add('done');
    row.querySelectorAll('button').forEach(function (b) { b.disabled = true; });
    writeBranchTag(x.id, newBranch, x.branch)
      .then(function () { loadAdminPartB(); renderSchemeList(); })
      .catch(function (err) {
        console.warn('[tags] write failed -', (err && err.code) || err);
        row.classList.remove('done');
        row.querySelectorAll('button').forEach(function (b) { b.disabled = false; });
      });
  }

  function loadFixes() {
    return window.FB.db.collection('schemeFixes').where('status', '==', 'open').get()
      .then(function (qs) {
        var list = [];
        qs.forEach(function (d) { var v = d.data() || {}; v.__id = d.id; list.push(v); });
        renderFixes(list);
      })
      .catch(function (err) {
        console.warn('[fix] list failed -', (err && err.code) || err);
        $('adm-fixes').innerHTML = '';
        var n = document.createElement('div');
        n.className = 'fix-none';
        n.textContent = 'Could not load corrections. / સુધારા લાવી શકાયા નથી.';
        $('adm-fixes').appendChild(n);
      });
  }

  function openAdmin() {
    if (!session.isAdmin) return;

    if (!$('adm-f-body').options.length) {
      fillSelect($('adm-f-body'), CONST.BODIES, 'All offices / બધી કચેરી');
    }
    showView('view-admin');
    window.scrollTo(0, 0);
    loadTracker();
    /* One load feeds both the branch tracker and the tag panel; it refreshes
       the scheme overrides first, or a scheme confirmed elsewhere would
       reappear as still unconfirmed. */
    loadAdminPartB();
    loadFixes();
    loadAudit(false);
  }

  /* ---------------------------------------------------------------- *
   *  Boot
   * ---------------------------------------------------------------- */
  function boot() {
    if (!window.FB || !window.FB.ready) {
      /* Two very different failures land here. Say which one it is, or the
         officer is told "paste your config" when the config is already fine. */
      if (window.FB && window.FB.error) {
        $('setup-title').textContent = 'Could not reach Firebase';
        $('setup-title-gu').textContent = '/ ફાયરબેઝ સાથે જોડાણ થયું નહીં';
        $('setup-body').textContent =
          'The config in js/firebase-config.js was rejected, or the Firebase ' +
          'SDK could not load. Check the values against the Firebase console, ' +
          'and check this device’s internet connection.';
      }
      showView('view-setup');
      return;
    }

    /* Surfaces an error from the redirect fallback path, which would otherwise
       land the officer back on a silent login screen. */
    window.FB.auth.getRedirectResult().catch(function (err) {
      showLoginError(signInErrorMessage(err && err.code));
    });

    window.FB.auth.onAuthStateChanged(function (user) {
      if (!user) {
        session.user = null;
        session.profile = null;
        session.isAdmin = false;
        resetPartA();
        resetPartB(null);
        picker.forUid = null;
        paintAppBar();
        $('btn-home').classList.add('hidden');
        $('btn-profile').classList.add('hidden');
        showView('view-login');
        return;
      }

      /* A different officer on the same machine must not inherit the previous
         officer's loaded sheet. */
      if (session.user && session.user.uid !== user.uid) { resetPartA(); resetPartB(null); }

      session.user = user;
      showView('view-loading');

      Promise.all([loadProfile(user), checkAdmin(user)]).then(function (res) {
        session.profile = res[0];
        session.isAdmin = res[1];
        paintAppBar();

        $('btn-home').classList.toggle('hidden', !session.profile);
        $('btn-profile').classList.toggle('hidden', !session.profile);

        /* No profile yet = first login: the officer must identify themselves
           before anything they write can be attributed. */
        if (session.profile) openHome(true);
        else openProfileForm();
      });
    });
  }

  on('btn-google', 'click', signIn);

  on('btn-signout', 'click', function () {
    if (window.FB && window.FB.ready) window.FB.auth.signOut();
  });

  on('btn-home', 'click', function () {
    /* Re-read here: arriving from the profile or admin screen, the copy in
       memory may be older than what a colleague has since saved. Only the
       return-from-the-form path trusts memory, and there it is authoritative
       because this officer just wrote it. */
    if (session.profile) openHome(true);
  });

  on('btn-admin', 'click', openAdmin);
  on('adm-refresh', 'click', loadTracker);
  on('adm-audit-refresh', 'click', function () { loadAudit(false); });
  on('adm-audit-more', 'click', function () { loadAudit(true); });
  on('adm-f-body', 'change', renderAudit);
  on('adm-f-text', 'input', renderAudit);

  on('btn-profile', 'click', openProfileForm);
  on('fix-open', 'click', openFixForm);
  on('fix-cancel', 'click', closeFixForm);
  on('fix-body', 'change', onFixBodyChange);
  on('fix-send', 'click', sendFix);
  on('adm-fix-refresh', 'click', loadFixes);
  on('sp-branch', 'change', renderSchemeList);
  on('sp-search', 'input', renderSchemeList);
  on('pb-back', 'click', leavePartB);
  on('fix-confirm', 'click', confirmBranch);
  on('adm-tags-refresh', 'click', loadBranchTags);
  on('adm-b-refresh', 'click', loadAdminPartB);
  on('adm-b-copy', 'click', copyBranchSummary);
  on('pb-exit', 'click', leavePartB);
  on('pb-submit', 'click', submitPartB);
  on('pb-showall', 'click', showEveryPartBQuestion);
  on('pa-back', 'click', leavePartA);
  on('pa-exit', 'click', leavePartA);
  on('pa-submit', 'click', submitPartA);
  on('home-parta', 'click', openPartA);
  on('pf-body', 'change', onBodyChange);
  on('pf-save', 'click', saveProfile);

  document.addEventListener('DOMContentLoaded', boot);
})();
