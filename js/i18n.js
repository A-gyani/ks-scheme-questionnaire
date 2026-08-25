/*
 * i18n.js — the ONE place that decides how a bilingual pair is drawn.
 *
 * ⭐ GUJARATI FIRST, ENGLISH SECOND. Before this file existed, "English then
 * Gujarati, separated by a slash" was written out by hand in about 103 places,
 * so changing it meant 103 edits. Now the order, the separator and the styling
 * live here and in the two CSS classes `.guj` (primary) and `.eng` (secondary).
 *
 * Consequences worth knowing:
 *   - flipping back, or adding a ગુજરાતી / English switch, is an edit to THIS
 *     file plus two CSS rules — not a rewrite of the app;
 *   - every bilingual string in the chrome can be listed for proof-reading with
 *     one search for `Bi.` — a Gujarati reader can check them in one sitting.
 *
 * ARGUMENT ORDER IS ALWAYS (gu, en). Never the other way round: a swapped pair
 * is silent — it renders, it just renders the wrong language as primary.
 *
 * The instrument (the 83 questions) does NOT come through here. It flows
 * through render.js, which holds the same order in four places.
 */
window.Bi = (function () {
  'use strict';

  /* Plain-text contexts have no styling to carry the hierarchy, so they get a
     separator instead. A slash reads as "or"; a middle dot reads as "and also". */
  var SEP = ' · ';

  function el(tag, cls, text) {
    var n = document.createElement(tag);
    if (cls) n.className = cls;
    if (text != null) n.textContent = text;
    return n;
  }

  /*
   * Two nodes appended to `parent`: Gujarati, then English.
   * `cls`   — a class put on BOTH nodes, e.g. 'qhelp'
   * `block` — true when each language needs its own line
   */
  function into(parent, gu, en, cls, block) {
    var gc = 'guj' + (cls ? ' ' + cls : '') + (block ? ' block' : '');
    var ec = 'eng' + (cls ? ' ' + cls : '') + (block ? ' block' : '');
    if (gu) parent.appendChild(el('div', gc, gu));
    if (en) parent.appendChild(el('div', ec, en));
    return parent;
  }

  /* Same pair, but inline inside one line (buttons, pills, labels). */
  function inline(parent, gu, en) {
    if (gu) parent.appendChild(document.createTextNode(gu + ' '));
    if (en) parent.appendChild(el('span', 'eng', en));
    return parent;
  }

  /* Replace an element's contents with an inline pair. Takes an id or a node. */
  function set(target, gu, en) {
    var node = typeof target === 'string' ? document.getElementById(target) : target;
    if (!node) return null;
    node.innerHTML = '';
    return inline(node, gu, en);
  }

  /* Plain text, for window.confirm, placeholders and textContent-only slots. */
  function txt(gu, en) {
    if (!en) return gu || '';
    if (!gu) return en;
    return gu + SEP + en;
  }

  /*
   * A "શા માટે? / why?" disclosure — the long explanation is written once,
   * kept out of the way, and one click away. Used wherever a note is true and
   * worth keeping but too long to sit on screen 148 times.
   *
   * Returns the wrapper so the caller can place it.
   */
  function why(gu, en, labelGu, labelEn) {
    var wrap = el('span', 'why-wrap');

    var btn = el('button', 'why');
    btn.type = 'button';
    inline(btn, labelGu || 'શા માટે?', labelEn || 'why?');

    var body = el('div', 'why-body hidden');
    into(body, gu, en, null, true);

    btn.addEventListener('click', function () {
      var open = body.classList.toggle('hidden');
      btn.setAttribute('aria-expanded', String(!open));
    });
    btn.setAttribute('aria-expanded', 'false');

    wrap.appendChild(btn);
    wrap.appendChild(body);
    return wrap;
  }

  return { into: into, inline: inline, set: set, txt: txt, why: why, el: el, SEP: SEP };
})();
