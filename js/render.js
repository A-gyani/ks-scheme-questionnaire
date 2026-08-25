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

  /*
   * ⭐ GUJARATI FIRST, ENGLISH SECOND — always together, never one language per
   * screen (Phase 0 rule). This function and the three call sites marked
   * "⭐ order" below carry the entire instrument's language hierarchy: 83
   * questions, 291 parts, every option, help note and table heading.
   *
   * The argument order stays (en, gu) because the spec files are keyed en/gu.
   * What changed is which one is appended first, and which class it carries.
   */
  function bilingual(parent, en, gu, cls) {
    if (gu) parent.appendChild(el('div', (cls ? cls + ' guj' : 'guj'), gu));
    if (en) parent.appendChild(el('div', (cls ? cls + ' eng' : 'eng'), en));
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
      /*
       * This badge used to read "blocking" — a word out of our own build notes,
       * English only, with the explanation hidden in hover text that does not
       * exist on a phone. A badge that needs explaining is the wrong badge.
       */
      var b = el('span', 'pill block');
      window.Bi.inline(b, 'જરૂરી', 'important');
      idRow.appendChild(b);
    }
    head.appendChild(idRow);

    /* ⭐ order — the question itself. */
    head.appendChild(el('div', 'qtext guj', q.gu));
    head.appendChild(el('div', 'qtext-en eng', q.en));

    if (q.helpEN) {
      var help = el('div', 'qhelp');
      window.Bi.into(help, q.helpGU, q.helpEN, null, true);   /* ⭐ order */
      /*
       * Some help notes carry a long tail — a list of examples, or a note about
       * rare cases. NOT ONE WORD OF THE INSTRUMENT IS REWRITTEN: the tail is
       * moved behind a link so it stops walling off the answer box. Approved
       * for B0.5 and B11.1/B11.3/B11.4 only.
       */
      if (q.helpMoreEN) {
        help.appendChild(window.Bi.why(q.helpMoreGU, q.helpMoreEN,
                                       q.helpMoreLabelGU, q.helpMoreLabelEN));
      }
      head.appendChild(help);
    }

    /*
     * ⛔ NO PRE-FILLED ANSWERS. 19 Part A questions used to carry our own guess
     * from the GR and the pipeline interview, in an amber box headed "not
     * verified — please confirm or correct".
     *
     * Removed on the user's instruction, 2026-08-25: the point of the exercise
     * is to find out what officers actually do, and an answer already written
     * on the page is an answer suggested. A tired clerk confirms it; a junior
     * one does not contradict it. Either way we get our own guess back with a
     * department stamp on it, and no way to tell that from a real finding.
     *
     * The research itself is not lost — it is recorded in
     * `Portal/Pipeline - As Is.md`. It just does not go in front of the person
     * being asked the question.
     *
     * Do NOT reintroduce this without the user saying so explicitly.
     */
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

      /* ⭐ order — every option of every tick-list and choose-one. */
      var textWrap = el('span', 'opt-text');
      textWrap.appendChild(el('span', 'guj', o.gu + ' '));
      textWrap.appendChild(el('span', 'eng block', o.en));
      row.appendChild(textWrap);

      /* A write-in box belongs to its option, and only matters when that
         option is chosen — so it appears with the tick and hides without it. */
      var fill = null;
      if (o.fillEN) {
        fill = document.createElement('input');
        fill.type = 'text';
        fill.className = 'opt-fill';
        fill.maxLength = caps.text;
        fill.placeholder = window.Bi.txt(o.fillGU, o.fillEN);
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
        star.title = window.Bi.txt('સૌથી સામાન્ય પર ★ કરો', 'Mark as the most common');
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
    /* ⭐ order — column headings. */
    p.cols.forEach(function (c) {
      var th = el('th');
      th.appendChild(el('div', 'guj', c.gu));
      th.appendChild(el('div', 'eng', c.en));
      hr.appendChild(th);
    });
    thead.appendChild(hr);
    table.appendChild(thead);

    var tbody = el('tbody');
    p.rows.forEach(function (r, ri) {
      var tr = el('tr');
      /* ⭐ order — row headings. */
      var th = el('th', 'rowhead');
      th.appendChild(el('div', 'guj', r.gu));
      th.appendChild(el('div', 'eng', r.en));
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
