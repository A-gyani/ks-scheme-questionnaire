/*
 * A manual that misquotes the app is worse than no manual.
 * Check every UI string the guide reproduces against the real source,
 * and check the counts it states.
 */
const fs = require('fs');
const path = require('path');
const APP = __dirname + path.sep;
const src = ['index.html', 'js/app.js', 'js/render.js', 'js/route-b.js']
  .map(f => fs.readFileSync(APP + f, 'utf8')).join('\n');
const guide = fs.readFileSync(APP + 'guide.html', 'utf8');

const quoted = [
  'સચવાયું ✓', 'સાચવાય છે…', 'સચવાયું નથી — ફરી પ્રયાસ થશે',
  'આ ઉપકરણ પર સચવાયું — પછી સિંક થશે', 'રજૂ થયું',
  'શરૂ થયું નથી', 'ચાલુ છે', 'જરૂરી',
  'તો પણ બતાવો', 'બધા પ્રશ્નો બતાવો', 'આ વિભાગ લાગુ પડતો નથી',
  'સાચવીને બહાર', 'ભાગ A રજૂ કરો', 'આ યોજના રજૂ કરો',
  'Google થી સાઇન ઇન', 'સાચવીને આગળ વધો', 'સાઇન આઉટ', 'પ્રોફાઇલ',
  'ખરી છે', 'સુધારો સૂચવો', 'શા માટે?', 'નોંધાયેલ: ', 'છેલ્લે સુધારનાર: ',
  'ખાતરી બાકી', 'બધી શાખા', 'સ્થાપના બાબતો છુપાવેલ',
  'જરૂરી પ્રશ્નોના જવાબ બાકી છે.', 'તો પણ રજૂ કરવું?',
  'બાજુ પર: આ યોજનામાં અરજદાર નથી',
  'જવાબ સચવાયેલા છે, ભૂંસાયા નથી',
  'કચેરી', 'પૂરું નામ', 'હોદ્દો', 'શાખા',
  'ભાગ A — સામાન્ય પ્રશ્નાવલિ', 'ભાગ B — યોજના દીઠ'
];

let bad = 0;
quoted.forEach(s => {
  if (!src.includes(s))   { console.log('MISSING FROM APP  : "' + s + '"'); bad++; }
  if (!guide.includes(s)) { console.log('MISSING FROM GUIDE: "' + s + '"'); bad++; }
});
console.log(bad === 0
  ? '✓ all ' + quoted.length + ' UI strings match between the app and guide.html'
  : '✗ ' + bad + ' mismatch(es) - the guide and the app disagree');

/* counts the manual states */
global.window = global;
require(APP + 'js/spec-a.js');
require(APP + 'js/spec-b.js');
const A = window.SPEC_A.questions, B = window.SPEC_B.questions;
console.log('Part A questions : ' + A.length + '   (manual says 25)');
console.log('Part B questions : ' + B.length + '   (manual says 58)');
console.log('Part A important : ' + A.filter(q => q.blocking).length + '   (manual says 13)');
console.log('Part B important : ' + B.filter(q => q.blocking).length + '   (manual says 39)');
const starA = A.filter(q => q.parts.some(p => p.star)).map(q => q.id);
const starB = B.filter(q => q.parts.some(p => p.star)).map(q => q.id);
console.log('★ questions      : ' + starA.concat(starB).join(', '));
const codes = B.filter(q => JSON.stringify(q.parts).includes('M or O') ||
                            JSON.stringify(q.parts).includes('A or P')).map(q => q.id);
console.log('letter-code Qs   : ' + codes.join(', ') + '   (manual says B4.3, B9.1, B5.1)');
if (bad) process.exitCode = 1;
