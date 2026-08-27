/*
 * Prove the language pass changed only display text.
 *
 * Every answer key (question id + part key), every option id, and every
 * routing driver must be byte-identical to the version before the edit —
 * otherwise saved answers would orphan and the fold rules would misfire.
 */
global.window = global;
const BASE = process.env.SPEC_DIR + '/';
require(BASE + 'spec-a.js');
require(BASE + 'spec-b.js');
require(BASE + 'route-b.js');

function shape(spec) {
  const out = [];
  spec.sections.forEach(s => out.push('SEC:' + s.id));
  spec.questions.forEach(q => {
    out.push('Q:' + q.id + '|sec=' + q.section + '|blocking=' + !!q.blocking);
    q.parts.forEach(p => {
      out.push('  P:' + q.id + '.' + p.key + '|' + p.type + (p.star ? '|star' : ''));
      (p.opts || []).forEach(o => out.push('    O:' + o[0] + (o[3] ? '|fill' : '')));
      (p.rows || []).forEach((r, i) => out.push('    R:' + i));
      (p.cols || []).forEach((c, i) => out.push('    C:' + i));
    });
  });
  return out.join('\n');
}

const dump = shape(window.SPEC_A) + '\n@@@\n' + shape(window.SPEC_B);
console.log(dump);

// routing drivers must still resolve
const drivers = window.RouteB.WATCHED;
console.error('--- watched routing keys: ' + drivers.join(', '));
const allKeys = new Set();
[window.SPEC_A, window.SPEC_B].forEach(sp =>
  sp.questions.forEach(q => q.parts.forEach(p => allKeys.add(q.id + '.' + p.key))));
drivers.forEach(k => {
  if (!allKeys.has(k)) { console.error('!! MISSING ROUTING KEY: ' + k); process.exitCode = 1; }
});
console.error('--- Part A questions: ' + window.SPEC_A.questions.length);
console.error('--- Part B questions: ' + window.SPEC_B.questions.length);
