/*
 * render.js — turns a question spec into a form, and reads answers back out.
 *
 * Deliberately knows nothing about Firebase. It renders, it reports changes
 * through onCommit, and it can be handed a set of saved answers to restore.
 * Saving, autosave and the audit trail are wired on top of this in Feature 5,
 * and the same engine will render Part B unchanged.
 *
 * ANSWER KEYS — these end up in the audit log, so they must stay stable:
 *   A1.1.channels          the part's own value (array for multi, string otherwise)
 *   A1.1.channels~news     the write-in box attached to option "news"
 *   A1.1.channels~~star    the ★ marker on a tick-list
 *   A3.2.bands~r0c1        one cell of a table
 *
 * COMMIT MODEL — a change is reported on `change` for tick-boxes and choices,
 * and on `blur` for typed text, never per keystroke. Feature 5 debounces on top
 * of this. Both matter on the free tier: every saved change also writes one
 * audit record, so keystroke-level saving would multiply writes for nothing.
 */
window.Render = (function () {
  'use strict';

  var SEP = '~';        /* part value  ->  option write-in */
  var STAR = '~~star';  /* the ★ marker on a tick-list     */

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /* English then Gujarati, always together — never one language per screen. */
  function bilingual(parent, en, gu, cls) {
    if (en) parent.appendChild(el('div', cls, en));
    if (gu) parent.appendChild(el('div', (cls ? cls + ' guj' : 'guj'), gu));
  }

  function optionOf(o) {
    return { id: o[0], en: o[1], gu: o[2], fillEN: o[3], fillGU: o[4] };
  }

  /* ------------------------------------------------------------------ *
   *  Engine
   * ------------------------------------------------------------------ */

  /*
   * spec      — one entry of SPEC_A.questions
   * answers   — { key: value } already saved; missing keys render empty
   * onCommit  — fn(key, newValue) called once per committed change
   * caps      — { text, longtext } character limits
   */
  function renderQuestion(q, answers, onCommit, caps) {
    answers = answers || {};
    caps = caps || { text: 2000, longtext: 5000 };

    var card = el('div', 'q');
    card.dataset.qid = q.id;

    /* --- header: id, blocking badge, both languages, helper, pre-fill --- */
    var head = el('div', 'q-head');
    var idRow = el('div', 'qid-row');
    idRow.appendChild(el('span', 'qid', q.id));
    if (q.blocking) {
      var b = el('span', 'pill block', 'blocking');
      b.title = 'This answer blocks the portal design — please try not to leave it empty.';
      idRow.appendChild(b);
    }
    head.appendChild(idRow);
    head.appendChild(el('div', 'qtext', q.en));
    head.appendChild(el('div', 'guj qtext-gu', q.gu));
    if (q.helpEN) bilingual(head, q.helpEN, q.helpGU, 'qhelp');

    if (q.prefill) {
      /*
       * Pre-filled answers are our guesses from the GR and the pipeline
       * interview. They are shown as a hint, never written into the field:
       * the officer must actively confirm, or the guess would launder itself
       * into a verified answer.
       */
      var pf = el('div', 'prefill');
      pf.appendChild(el('b', null, 'Not verified — please confirm or correct: '));
      pf.appendChild(document.createTextNode(q.prefill));
      pf.appendChild(el('div', 'guj', 'ચકાસાયેલ નથી — ખરાઈ કરો અથવા સુધારો.'));
      head.appendChild(pf);
    }
    card.appendChild(head);

    q.parts.forEach(function (p) {
      card.appendChild(renderPart(q, p, answers, onCommit, caps));
    });

    return card;
  }

  function renderPart(q, p, answers, onCommit, caps) {
    var key = q.id + '.' + p.key;
    var wrap = el('div', 'qpart');

    /* A part often has no label of its own — it simply continues the question. */
    if (p.en) bilingual(wrap, p.en, p.gu, 'plabel');

    switch (p.type) {
      case 'multi':    renderChoice(wrap, key, p, answers, onCommit, caps, true);  break;
      case 'single':   renderChoice(wrap, key, p, answers, onCommit, caps, false); break;
      case 'text':     renderText(wrap, key, p, answers, onCommit, caps.text, false); break;
      case 'longtext': renderText(wrap, key, p, answers, onCommit, caps.longtext, true); break;
      case 'table':    renderTable(wrap, key, p, answers, onCommit, caps.text); break;
      default:
        wrap.appendChild(el('div', 'muted', 'Unsupported question type: ' + p.type));
    }
    return wrap;
  }

  /* Tick-list (multi) and choose-one (single) share everything but the input
     type and whether the stored value is an array or a string. */
  function renderChoice(wrap, key, p, answers, onCommit, caps, isMulti) {
    var box = el('div', 'opts');
    var saved = answers[key];
    var chosen = isMulti ? (Array.isArray(saved) ? saved.slice() : []) : (saved || '');
    var starKey = key + STAR;

    p.opts.forEach(function (raw) {
      var o = optionOf(raw);
      var row = el('label', 'opt');

      var input = document.createElement('input');
      input.type = isMulti ? 'checkbox' : 'radio';
      input.name = key;
      input.value = o.id;
      input.checked = isMulti ? chosen.indexOf(o.id) !== -1 : chosen === o.id;
      row.appendChild(input);

      var textWrap = el('span', 'opt-text');
      textWrap.appendChild(document.createTextNode(o.en + ' '));
      textWrap.appendChild(el('span', 'guj', '/ ' + o.gu));
      row.appendChild(textWrap);

      /* A write-in box belongs to its option, and only matters when that
         option is chosen — so it appears with the tick and hides without it. */
      var fill = null;
      if (o.fillEN) {
        fill = document.createElement('input');
        fill.type = 'text';
        fill.className = 'opt-fill';
        fill.maxLength = caps.text;
        fill.placeholder = o.fillEN + ' / ' + o.fillGU;
        fill.value = answers[key + SEP + o.id] || '';
        fill.classList.toggle('hidden', !input.checked);
        commitOnBlur(fill, key + SEP + o.id, onCommit);
      }

      input.addEventListener('change', function () {
        if (isMulti) {
          var i = chosen.indexOf(o.id);
          if (input.checked && i === -1) chosen.push(o.id);
          if (!input.checked && i !== -1) chosen.splice(i, 1);
          onCommit(key, chosen.slice());
        } else {
          chosen = input.value;
          onCommit(key, chosen);
          /* Only one write-in can be live at a time in a choose-one list. */
          box.querySelectorAll('.opt-fill').forEach(function (f) { f.classList.add('hidden'); });
        }
        if (fill) {
          fill.classList.toggle('hidden', !input.checked);
          if (input.checked) fill.focus();
        }
      });

      box.appendChild(row);
      if (fill) box.appendChild(fill);

      /* ★ marks the one channel that actually brings in the applications —
         a different question from "which channels exist", and the more
         useful one, so it gets its own stored value. */
      if (p.star) {
        var star = el('button', 'star', '★');
        star.type = 'button';
        star.title = 'Mark as the most common / સૌથી સામાન્ય પર ★ કરો';
        star.setAttribute('aria-label', 'Mark ' + o.en + ' as most common');
        if (answers[starKey] === o.id) star.classList.add('on');
        star.addEventListener('click', function () {
          var already = star.classList.contains('on');
          box.querySelectorAll('.star').forEach(function (s) { s.classList.remove('on'); });
          if (!already) star.classList.add('on');
          onCommit(starKey, already ? '' : o.id);
        });
        row.appendChild(star);
      }
    });

    wrap.appendChild(box);
  }

  function renderText(wrap, key, p, answers, onCommit, cap, isLong) {
    var input = document.createElement(isLong ? 'textarea' : 'input');
    if (!isLong) input.type = 'text';
    if (isLong) input.rows = 3;
    input.className = 'qinput';
    input.maxLength = cap;
    if (p.placeholder) input.placeholder = p.placeholder;
    input.value = answers[key] || '';
    commitOnBlur(input, key, onCommit);
    wrap.appendChild(input);
  }

  function renderTable(wrap, key, p, answers, onCommit, cap) {
    var scroll = el('div', 'table-scroll');
    var table = el('table', 'qtable');

    var thead = el('thead');
    var hr = el('tr');
    hr.appendChild(el('th', null, ''));
    p.cols.forEach(function (c) {
      var th = el('th');
      th.appendChild(el('div', null, c.en));
      th.appendChild(el('div', 'guj', c.gu));
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el('tbody');
    p.rows.forEach(function (r, ri) {
      var tr = el('tr');
      var th = el('th', 'rowhead');
      th.appendChild(el('div', null, r.en));
      th.appendChild(el('div', 'guj', r.gu));
      tr.appendChild(th);

      p.cols.forEach(function (c, ci) {
        var td = el('td');
        /* Some cells genuinely have no answer — nothing sits above the
           Minister, so that cell is a dash rather than an empty invitation. */
        if (r.skipCols && r.skipCols.indexOf(ci) !== -1) {
          td.appendChild(el('span', 'muted', '—'));
        } else {
          var cellKey = key + SEP + 'r' + ri + 'c' + ci;
          var input = document.createElement('input');
          input.type = 'text';
          input.className = 'qinput';
          input.maxLength = cap;
          input.value = answers[cellKey] || '';
          commitOnBlur(input, cellKey, onCommit);
          td.appendChild(input);
        }
        tr.appendChild(td);
      });
      tbody.appendChild(tr);
    });
    table.appendChild(tbody);
    scroll.appendChild(table);
    wrap.appendChild(scroll);
  }

  /*
   * Typed text commits when the officer leaves the field, and only if the value
   * actually changed. The no-op guard is what stops tabbing through a long form
   * from writing a hundred identical records to the audit trail.
   */
  function commitOnBlur(input, key, onCommit) {
    var last = input.value;
    input.addEventListener('blur', function () {
      var now = input.value;
      if (now === last) return;
      last = now;
      onCommit(key, now);
    });
  }

  /* ------------------------------------------------------------------ *
   *  Progress
   *
   *  Counts a question as answered when its first part has a value. Judging by
   *  the first part avoids punishing the officer for follow-up lines that do
   *  not apply to them ("if yes, which…"), which would make a fully answered
   *  form read as permanently incomplete.
   * ------------------------------------------------------------------ */
  function isFilled(v) {
    if (v == null) return false;
    if (Array.isArray(v)) return v.length > 0;
    return String(v).trim() !== '';
  }

  function progress(questions, answers) {
    answers = answers || {};
    var total = questions.length, done = 0, blockingLeft = 0;

    questions.forEach(function (q) {
      var first = q.parts[0];
      var key = q.id + '.' + first.key;
      var filled;

      if (first.type === 'table') {
        /* A table counts once any cell in it has been filled. */
        filled = Object.keys(answers).some(function (k) {
          return k.indexOf(key + SEP) === 0 && isFilled(answers[k]);
        });
      } else {
        filled = isFilled(answers[key]);
      }

      if (filled) done++;
      else if (q.blocking) blockingLeft++;
    });

    return { total: total, done: done, blockingLeft: blockingLeft,
             percent: total ? Math.round((done / total) * 100) : 0 };
  }

  return {
    renderQuestion: renderQuestion,
    progress: progress,
    SEP: SEP,
    STAR: STAR
  };
})();
