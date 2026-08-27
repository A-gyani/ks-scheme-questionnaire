/*
 * spec-b.js — PART B (per-scheme questionnaire), 58 questions.
 *
 * Transcribed from `Scheme Questionnaire.md`, Part B, which is LOCKED. Do not
 * reword a question here: the wording was agreed question by question with the
 * department, in both languages. Fix the instrument first, then mirror it here.
 *
 * Part B is answered ONCE PER SCHEME, and the same sheet is used by all three
 * bodies (Commissionerate / Lalit Kala Akademi / Sangeet Natak Akademi), so
 * nothing here may assume a single body. Section B6 was dissolved into Part A
 * (A10 overlap rules; A8.4 "has double funding been caught"), so the number B6
 * is deliberately absent — as A4/A5/A9 are absent from spec-a.js.
 *
 * The instrument also drops five items, each with its reason recorded in the
 * file itself: B4.5 (redundant with A1 + B4.4) · B5.4 (troupe size is
 * art-form-level, not scheme-level) · B7.7 (rejection letters are universal →
 * A3.5) · B8.5 (Aadhaar fully covered by B5) · B9.7 (folded into B2.8). They
 * are absent here for the same reason.
 *
 * SHAPE / TYPES / ANSWER KEYS — identical to spec-a.js; render.js renders this
 * file unchanged. Keys read B0.1.confirm, B4.3.docs~aadhaar, B8.6.t1 and so on.
 *
 * B0.5 is the ROUTER. Its ticks decide which of the later blocks a scheme
 * actually needs (grant / artist engaged / award / registration / …). Feature
 * 14 reads B0.5 and hides the blocks that do not apply; until then every
 * question is shown and the officer skips what does not apply, exactly as on
 * paper.
 *
 * THREE PRESENTATION DECISIONS (the instrument is unchanged — only how it is
 * drawn on screen):
 *   1. B8.6's 8×5 timing grid is drawn as EIGHT choose-one rows, one per stage
 *      transition. The engine's `table` type makes typing boxes, not radio
 *      buttons, and picking the usual time must be a choice, not free text.
 *   2. The M/O marker in B4.3 and B9.1, and the A/P marker in B5.1, are the
 *      small write-in box that belongs to each ticked option — the same
 *      mechanism the paper form uses (tick, then write M or O beside it).
 *   3. B3.5's "none" tick per row is a separate tick-list above the min/max
 *      grid, so "there is no rule" stays distinguishable from "not answered".
 */
window.SPEC_B = {

  sections: [
    { id: 'B0',  en: 'Identity & responsibility',
                 gu: 'ઓળખ અને જવાબદારી' },
    { id: 'B1',  en: 'Legal basis',
                 gu: 'કાયદાકીય આધાર' },
    { id: 'B2',  en: 'Eligibility',
                 gu: 'પાત્રતા' },
    { id: 'B3',  en: 'What is funded & how much',
                 gu: 'શેનું ભંડોળ મળે છે અને કેટલું' },
    { id: 'B4',  en: 'How the application is made',
                 gu: 'અરજી કઈ રીતે થાય છે' },
    { id: 'B5',  en: 'Identity details — applicant & event',
                 gu: 'ઓળખની વિગતો — અરજદાર અને કાર્યક્રમ' },
    { id: 'B7',  en: 'Scrutiny & verification',
                 gu: 'ચકાસણી અને ખરાઈ' },
    { id: 'B8',  en: 'Payment specifics',
                 gu: 'ચૂકવણીની વિગતો' },
    { id: 'B9',  en: 'Proof, reports & UC',
                 gu: 'પુરાવા, અહેવાલ અને ઉપયોગિતા પ્રમાણપત્ર' },
    { id: 'B10', en: 'District-run?',
                 gu: 'જિલ્લા કક્ષાએ ચાલે છે?' },
    { id: 'B11', en: 'Officer’s own assessment',
                 gu: 'અધિકારીનો પોતાનો અભિપ્રાય' }
  ],

  questions: [

  /* ================= B0. Identity & ownership ================= */
  {
    id: 'B0.1', section: 'B0', blocking: true,
    en: 'Confirm the scheme name, Patrak item, budget head and allocation shown. Correct anything wrong.',
    gu: 'દર્શાવેલ યોજનાનું નામ, પત્રક ક્રમ, બજેટ સદર અને રકમ (ફાળવણી) ખરાઈ કરો. ખોટું હોય તો સુધારો.',
    helpEN: 'The details to be confirmed are the ones shown at the top of this page.',
    helpGU: 'ખરાઈ કરવાની વિગતો આ પાનાની ઉપર દર્શાવેલ છે.',
    parts: [
      { key: 'confirm', type: 'single', opts: [
        ['ok',     'All correct as shown', 'દર્શાવ્યા મુજબ બધું બરાબર છે'],
        ['wrong',  'Something is wrong — correction written below', 'કંઈક ખોટું છે — સુધારો નીચે લખ્યો છે'],
        ['unsure', 'Not sure', 'ખાતરી નથી']
      ]},
      { key: 'corrections', type: 'longtext',
        en: 'Corrections — scheme name / Patrak item / budget head / allocation',
        gu: 'સુધારા — યોજનાનું નામ / પત્રક ક્રમ / બજેટ સદર / ફાળવણી' }
    ]
  },

  {
    id: 'B0.2', section: 'B0', blocking: false,
    en: 'Which office/body runs this scheme — and, within it, which branch or section?',
    gu: 'આ યોજના કઈ કચેરી/સંસ્થા ચલાવે છે — અને તેની અંદર કઈ શાખા/વિભાગ?',
    parts: [
      { key: 'bodyRuns', type: 'single',
        en: 'Implementing body',
        gu: 'અમલ કરનાર સંસ્થા',
        opts: [
          ['comm',    'Commissionerate of Youth Services & Cultural Activities',
                      'યુવક સેવા અને સાંસ્કૃતિક પ્રવૃત્તિઓની કચેરી (કમિશનરેટ)'],
          ['lalit',   'Gujarat State Lalit Kala Akademi', 'ગુજરાત રાજ્ય લલિત કલા અકાદમી'],
          ['sangeet', 'Gujarat State Sangeet Natak Akademi', 'ગુજરાત રાજ્ય સંગીત નાટક અકાદમી'],
          ['other',   'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'branch', type: 'single',
        en: 'If run by the Commissionerate, which branch / unit?',
        gu: 'કમિશનરેટ ચલાવતું હોય તો, કઈ શાખા / વિભાગ?',
        opts: [
          ['culture',     'Culture', 'સાંસ્કૃતિક'],
          ['celebration', 'Celebration', 'ઉજવણી'],
          ['adventure',   'Adventure', 'સાહસિક'],
          ['youthBoard',  'Youth Board', 'યુવક બોર્ડ'],
          ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B0.3', section: 'B0', blocking: false,
    en: 'Responsible officer — name, designation, phone, email.',
    gu: 'જવાબદાર અધિકારી — નામ, હોદ્દો, ફોન નંબર, ઈમેલ.',
    parts: [
      { key: 'name',        type: 'text', en: 'Name', gu: 'નામ' },
      { key: 'designation', type: 'text', en: 'Designation', gu: 'હોદ્દો' },
      { key: 'phone',       type: 'text', en: 'Phone number', gu: 'ફોન નંબર' },
      { key: 'email',       type: 'text', en: 'Email', gu: 'ઈમેલ' }
    ]
  },

  {
    id: 'B0.4', section: 'B0', blocking: false,
    en: 'Which clerk handles the files? — give the clerk’s name and the desk/table.',
    gu: 'આ યોજનાની ફાઈલ કયો કારકુન સંભાળે છે? — કારકુનનું નામ અને ટેબલ (ડેસ્ક) જણાવો.',
    parts: [
      { key: 'clerkName', type: 'text', en: 'Clerk’s name', gu: 'કારકુનનું નામ' },
      { key: 'desk',      type: 'text', en: 'Desk / table', gu: 'ટેબલ (ડેસ્ક)' }
    ]
  },

  {
    id: 'B0.5', section: 'B0', blocking: true,
    en: 'What does this scheme give, and to whom? Tick every option that applies — a scheme may do several.',
    gu: 'આ યોજના શું આપે છે અને કોને આપે છે? લાગુ પડતા દરેક વિકલ્પ પર ✓ કરો — એક યોજના એક કરતાં વધુ કરી શકે.',
    /*
     * The longest help note in the app (465 characters) and it sits on the one
     * question every officer must answer. The third sentence — the rare/future
     * list — is MOVED behind a link, word for word. Nothing is reworded, and
     * nothing is lost: it is one click away on all 148 schemes.
     */
    helpEN: 'This answer decides the rest of the questionnaire for this scheme. NOT a scheme type — do not tick here: staff salaries / office running (establishment, excluded from the portal), and finance mechanics like honorarium & sitting fees, TA/DA, per diem, boarding-lodging (these are captured later in B8 Payment).',
    helpGU: 'આ જવાબના આધારે આ યોજનાના બાકીના પ્રશ્નો નક્કી થશે. યોજનાનો પ્રકાર નથી — અહીં ✓ ન કરો: સ્ટાફ પગાર / કચેરી ખર્ચ (સ્થાપના — પોર્ટલમાં નથી), તથા માનદ વેતન અને બેઠક ફી, TA/DA, રોજમેળ, રહેવા-જમવા (આ B8 ચૂકવણીમાં પુછાય છે).',
    helpMoreEN: 'Rare / future — just note it below if you see it: youth culture pass or voucher, commissioning a new work, free-venue in-kind support, subsidised training.',
    helpMoreGU: 'ભાગ્યે જ / ભવિષ્યમાં — દેખાય તો નીચે નોંધો: યુવા સાંસ્કૃતિક પાસ કે વાઉચર, નવી કૃતિનું સર્જન સોંપવું, વિનામૂલ્યે સ્થળ સહાય, રાહતદરે તાલીમ.',
    helpMoreLabelEN: 'rare cases', helpMoreLabelGU: 'ભાગ્યે જ બનતા કિસ્સા',
    parts: [
      { key: 'mechanism', type: 'multi', opts: [
        ['grant',       '1. Grant on application — applicant applies for help for their own programme; the office sanctions & pays.',
                        '1. અરજી આધારિત અનુદાન/સહાય — અરજદાર પોતાના કાર્યક્રમ માટે અરજી કરે, કચેરી મંજૂર કરી ચૂકવે.',
                        'one-off / project OR recurring institutional grant-in-aid — say which',
                        'એક વખતનું / નિયમિત સંસ્થાકીય — જણાવો'],
        ['engaged',     '2. Artist engaged & paid — the office runs its own event, selects artists/troupes and pays them.',
                        '2. કચેરી પોતાનો કાર્યક્રમ યોજે, કલાકારો/મંડળી પસંદ કરી મહેનતાણું ચૂકવે.'],
        ['provided',    '3. Artist provided & paid — another body requests performers; the office supplies artists and pays them.',
                        '3. બીજી સંસ્થા/કચેરીની માંગણી મુજબ કચેરી કલાકારો પૂરા પાડે અને મહેનતાણું ચૂકવે.'],
        ['award',       '4. Award / honour — recognition (with or without cash) for achievement.',
                        '4. સિદ્ધિ બદલ પુરસ્કાર/એવોર્ડ (રોકડ સાથે કે વગર) આપવામાં આવે.'],
        ['pension',     '5. Pension / recurring maintenance — regular support to a category (e.g. destitute/aged artists).',
                        '5. નિરાધાર/વૃદ્ધ કલાકારોને નિયમિત નિભાવ સહાય/પેન્શન.'],
        ['scholarship', '6. Scholarship / stipend / fellowship — support a person to train or create.',
                        '6. તાલીમ કે સર્જન માટે વ્યક્તિને શિષ્યવૃત્તિ/સ્ટાઇપેન્ડ/ફેલોશિપ.'],
        ['competition', '7. Competition — registration, participation and prizes to winners.',
                        '7. સ્પર્ધા/મહોત્સવ — નોંધણી, સહભાગિતા અને વિજેતાઓને ઇનામ.'],
        ['sponsorship', '8. Participant sponsorship — the office bears participants’ cost for a camp / exchange / adventure programme.',
                        '8. શિબિર/આદાનપ્રદાન/સાહસિક કાર્યક્રમમાં ભાગ લેનારનો ખર્ચ કચેરી ઉઠાવે.'],
        ['equipment',   '9. Equipment / kit / goods provided — goods given in kind, not cash (instruments, costumes, kits).',
                        '9. સાધન/કીટ/વાદ્ય/પોશાક જેવી ચીજવસ્તુ (રોકડ નહીં) આપવામાં આવે.'],
        ['capital',     '10. Capital grant to an external institution — money to an outside body to build/renovate its facility.',
                        '10. બહારની સંસ્થાને ઇમારત/સ્ટુડિયો બાંધવા/સમારકામ માટે મૂડી ગ્રાન્ટ.'],
        ['combination', '11. Combination — more than one of the above (say which).',
                        '11. ઉપરોક્તમાંથી એક કરતાં વધુ (કઈ કઈ તે જણાવો).',
                        'which ones', 'કઈ કઈ']
      ]},
      { key: 'notes', type: 'longtext',
        en: 'Anything about what this scheme gives that the list above does not cover',
        gu: 'આ યોજના શું આપે છે તે અંગે ઉપરની યાદીમાં ન આવતું કંઈ પણ' }
    ]
  },

  /* ================= B1. Legal basis ================= */
  {
    id: 'B1.1', section: 'B1', blocking: true,
    en: 'List every order that governs this scheme — the original GR, all later amendment GRs, the latest rate-revision circular, and the budget GR — with number, date and issuing department. Can you give a copy of each?',
    gu: 'આ યોજનાને લાગુ પડતા બધા જ હુકમ જણાવો — મૂળ ઠરાવ (GR), ત્યારપછીના સુધારા ઠરાવો, દર સુધારવાનો છેલ્લો પરિપત્ર, અને બજેટ ઠરાવ — દરેકનો ક્રમાંક, તારીખ અને કયા વિભાગનો છે તે સાથે. દરેકની નકલ આપી શકશો?',
    parts: [
      { key: 'orders', type: 'table',
        cols: [
          { en: 'Order number', gu: 'હુકમ ક્રમાંક' },
          { en: 'Date', gu: 'તારીખ' },
          { en: 'Issuing department', gu: 'બહાર પાડનાર વિભાગ' }
        ],
        rows: [
          { en: 'Original GR', gu: 'મૂળ ઠરાવ' },
          { en: 'Amendment GR (1)', gu: 'સુધારા ઠરાવ (1)' },
          { en: 'Amendment GR (2)', gu: 'સુધારા ઠરાવ (2)' },
          { en: 'Latest rate-revision circular', gu: 'દર સુધારવાનો છેલ્લો પરિપત્ર' },
          { en: 'Budget GR', gu: 'બજેટ ઠરાવ' },
          { en: 'Other order', gu: 'અન્ય હુકમ' }
        ]},
      { key: 'moreOrders', type: 'longtext',
        en: 'Any further orders that did not fit above',
        gu: 'ઉપર ન સમાયા હોય તેવા બીજા હુકમ' },
      { key: 'copies', type: 'single',
        en: 'Can you give a copy of each?',
        gu: 'દરેકની નકલ આપી શકશો?',
        opts: [
          ['yes',     'Yes — all of them', 'હા — બધાની'],
          ['some',    'Only some of them', 'ફક્ત અમુકની', 'which', 'કઈ'],
          ['no',      'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  {
    id: 'B1.2', section: 'B1', blocking: true,
    en: 'Which order do you actually rely on today? Is the original still in force, partly superseded, or fully superseded — and if superseded, by which order?',
    gu: 'આજે તમે ખરેખર કયા હુકમ પ્રમાણે કામ કરો છો? મૂળ ઠરાવ હજુ અમલમાં છે, અંશતઃ રદ થયો છે, કે સંપૂર્ણ રદ થયો છે — અને રદ થયો હોય તો કયા હુકમથી?',
    parts: [
      { key: 'reliedOn', type: 'text',
        en: 'The order actually followed today — number and date',
        gu: 'આજે ખરેખર અનુસરાતો હુકમ — ક્રમાંક અને તારીખ' },
      { key: 'status', type: 'single',
        en: 'Status of the original GR',
        gu: 'મૂળ ઠરાવની સ્થિતિ',
        opts: [
          ['inForce',  'Still fully in force', 'હજુ સંપૂર્ણ અમલમાં'],
          ['partly',   'Partly superseded', 'અંશતઃ રદ', 'by which order', 'કયા હુકમથી'],
          ['fully',    'Fully superseded', 'સંપૂર્ણ રદ', 'by which order', 'કયા હુકમથી'],
          ['unsure',   'Not sure', 'ખાતરી નથી']
        ]}
    ]
  },

  {
    id: 'B1.3', section: 'B1', blocking: true,
    en: '(a) What rates / ceilings does the GR state? (b) What rates are actually paid today? If they differ, note the gap.',
    gu: '(a) ઠરાવમાં કયા દર/મર્યાદા લખેલ છે? (b) આજે ખરેખર કયા દરે ચૂકવણી થાય છે? બંને અલગ હોય તો તફાવત નોંધો.',
    parts: [
      { key: 'grRates', type: 'longtext',
        en: '(a) Rates / ceilings as stated in the GR',
        gu: '(a) ઠરાવમાં લખેલ દર / મર્યાદા' },
      { key: 'actualRates', type: 'longtext',
        en: '(b) Rates actually paid today',
        gu: '(b) આજે ખરેખર ચૂકવાતા દર' },
      { key: 'gap', type: 'longtext',
        en: 'If the two differ, what is the gap and why?',
        gu: 'બંને અલગ હોય તો તફાવત શું અને કેમ?' },
      { key: 'unwritten', type: 'longtext',
        en: 'Is there any practice you follow that is not written in any GR?',
        gu: 'કોઈ ઠરાવમાં લખેલ ન હોય એવી કોઈ પ્રથા તમે અનુસરો છો?' }
    ]
  },

  {
    id: 'B1.4', section: 'B1', blocking: true,
    en: 'Does the scheme rest on an Act / Rules / statutory body, or only on an executive GR, or on convention / verbal practice?',
    gu: 'આ યોજના કોઈ કાયદો / નિયમો / વૈધાનિક બોર્ડ પર આધારિત છે, કે ફક્ત વહીવટી ઠરાવ પર, કે પ્રથા / મૌખિક રીતે ચાલે છે?',
    parts: [
      { key: 'basis', type: 'single', opts: [
        ['act',        'An Act / Rules / a statutory body', 'કાયદો / નિયમો / વૈધાનિક બોર્ડ', 'which', 'કયો'],
        ['executive',  'Only an executive GR', 'ફક્ત વહીવટી ઠરાવ'],
        ['convention', 'Convention / verbal practice', 'પ્રથા / મૌખિક']
      ]},
      { key: 'since', type: 'text',
        en: 'If convention / verbal — since when?',
        gu: 'પ્રથા / મૌખિક હોય તો — ક્યારથી?' },
      { key: 'whoDecides', type: 'text',
        en: 'If convention / verbal — who decides the terms?',
        gu: 'પ્રથા / મૌખિક હોય તો — શરતો કોણ નક્કી કરે છે?' },
      { key: 'toWriting', type: 'single',
        en: 'Is there any move to put it in writing?',
        gu: 'લેખિત કરવાની કોઈ કાર્યવાહી ચાલુ છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'at what stage', 'કયા તબક્કે'],
          ['no',  'No', 'ના'],
          ['unsure', 'Not sure', 'ખાતરી નથી']
        ]}
    ]
  },

  {
    id: 'B1.5', section: 'B1', blocking: false,
    en: 'Is there one consolidated guideline document, or only scattered GRs? Any review date, or a date the scheme is due to end? Is a rate/rule revision currently in process?',
    gu: 'યોજનાની એક સંકલિત માર્ગદર્શિકા છે, કે છૂટાછવાયા ઠરાવો જ છે? કોઈ સમીક્ષા/મુદત પૂરી થવાની તારીખ છે? દર/નિયમ સુધારવાની કાર્યવાહી હાલ ચાલુ છે?',
    parts: [
      { key: 'consolidated', type: 'single',
        en: 'Is there one consolidated guideline document?',
        gu: 'એક સંકલિત માર્ગદર્શિકા છે?',
        opts: [
          ['yes',       'Yes — one consolidated guideline', 'હા — એક સંકલિત માર્ગદર્શિકા', 'name / number', 'નામ / ક્રમાંક'],
          ['scattered', 'No — only scattered GRs', 'ના — છૂટાછવાયા ઠરાવો જ']
        ]},
      { key: 'sunset', type: 'single',
        en: 'Any review date, or a date the scheme is due to end?',
        gu: 'કોઈ સમીક્ષા / મુદત પૂરી થવાની તારીખ છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'which date', 'કઈ તારીખ'],
          ['no',  'No', 'ના']
        ]},
      { key: 'revision', type: 'single',
        en: 'Is a rate / rule revision currently in process?',
        gu: 'દર / નિયમ સુધારવાની કાર્યવાહી હાલ ચાલુ છે?',
        opts: [
          ['yes',    'Yes', 'હા', 'at what stage', 'કયા તબક્કે'],
          ['no',     'No', 'ના'],
          ['unsure', 'Not sure', 'ખાતરી નથી']
        ]}
    ]
  },

  /* ================= B2. Eligibility ================= */
  {
    id: 'B2.1', section: 'B2', blocking: true,
    en: 'Who is allowed to apply under this scheme? Tick every type that applies; mark ★ the most common in practice.',
    gu: 'આ યોજનામાં કોણ અરજી કરી શકે? લાગુ પડતા દરેક પ્રકાર પર ✔ કરો; વ્યવહારમાં સૌથી સામાન્ય હોય તેને ★ કરો.',
    parts: [
      { key: 'whoApplies', type: 'multi', star: true, opts: [
        ['individual',   'Individual', 'વ્યક્તિગત'],
        ['groupReg',     'Group / troupe — registered (has reg. no.)', 'જૂથ / મંડળી — નોંધાયેલ (નોંધણી નં. છે)'],
        ['groupUnreg',   'Group / troupe — unregistered (no reg. no.)', 'જૂથ / મંડળી — બિન-નોંધાયેલ (નોંધણી નં. નથી)'],
        ['institution',  'Organising agency / institution (society, trust, academy, mandal)',
                         'આયોજક એજન્સી / સંસ્થા (સોસાયટી, ટ્રસ્ટ, એકેડમી, મંડળ)'],
        ['govt',         'Government body / local body', 'સરકારી સંસ્થા / સ્થાનિક સ્વરાજ્ય સંસ્થા'],
        ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
      ]}
    ]
  },

  {
    id: 'B2.2', section: 'B2', blocking: true,
    en: 'What must an applicant have or prove to qualify — beyond who they are? List every condition.',
    gu: 'અરજદારે લાયક બનવા માટે — પોતે કોણ છે તે ઉપરાંત — શું ધરાવવું કે સાબિત કરવું પડે? દરેક શરત જણાવો.',
    helpEN: 'Age, domicile, caste and registration are asked separately below — don’t repeat them here.',
    helpGU: 'ઉંમર, વતન, જ્ઞાતિ અને નોંધણી નીચે અલગથી પુછાય છે — અહીં ફરી ન લખો.',
    parts: [
      { key: 'conditions', type: 'multi', opts: [
        ['experience',  'Minimum experience / years active', 'ઓછામાં ઓછો અનુભવ / કેટલાં વર્ષથી સક્રિય', 'detail', 'વિગત'],
        ['pastWork',    'Proof of past work / performances', 'ભૂતકાળના કામ / કાર્યક્રમનો પુરાવો', 'detail', 'વિગત'],
        ['recognition', 'Recognition, empanelment or grading by a recognised body',
                        'માન્ય સંસ્થા દ્વારા માન્યતા / પેનલ / ગ્રેડિંગ', 'detail', 'વિગત'],
        ['groupSize',   'Minimum group size', 'ઓછામાં ઓછું જૂથ કદ', 'detail', 'વિગત'],
        ['recommend',   'Recommendation / sponsorship letter', 'ભલામણ / પ્રાયોજન પત્ર', 'detail', 'વિગત'],
        ['none',        'No condition — open to all who apply', 'કોઈ શરત નહીં — અરજી કરનાર સૌ માટે ખુલ્લી'],
        ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'conditionsNotes', type: 'longtext',
        en: 'Anything else an applicant must have or prove',
        gu: 'અરજદારે ધરાવવું / સાબિત કરવું પડે એવું બીજું કંઈ' }
    ]
  },

  {
    id: 'B2.3', section: 'B2', blocking: false,
    en: 'Is there any age limit? If yes, give minimum, maximum, whose age, and the cut-off date.',
    gu: 'કોઈ ઉંમર મર્યાદા છે? હોય તો — ઓછામાં ઓછી, વધુમાં વધુ, કોની ઉંમર, અને કઈ તારીખ મુજબ ગણાય તે જણાવો.',
    parts: [
      { key: 'hasLimit', type: 'single', opts: [
        ['no',  'No age limit', 'ઉંમર મર્યાદા નથી'],
        ['yes', 'Yes, there is an age limit', 'હા, ઉંમર મર્યાદા છે']
      ]},
      { key: 'minAge', type: 'text', en: 'Minimum age', gu: 'ઓછામાં ઓછી ઉંમર' },
      { key: 'maxAge', type: 'text', en: 'Maximum age', gu: 'વધુમાં વધુ ઉંમર' },
      { key: 'appliesTo', type: 'multi',
        en: 'Applies to',
        gu: 'કોને લાગુ',
        opts: [
          ['applicant',   'Individual applicant', 'વ્યક્તિગત અરજદાર'],
          ['eachMember',  'Each participant / member', 'દરેક સહભાગી / સભ્ય'],
          ['leader',      'Group leader', 'જૂથ આગેવાન']
        ]},
      { key: 'asOn', type: 'text',
        en: 'Age counted as on (date)',
        gu: 'ઉંમર કઈ તારીખ મુજબ ગણાય' },
      { key: 'ageProof', type: 'multi',
        en: 'Which documents are accepted as proof of age? Tick all that are allowed.',
        gu: 'ઉંમરના પુરાવા તરીકે કયા દસ્તાવેજ સ્વીકાર્ય છે? સ્વીકાર્ય હોય તે બધા પર ✔ કરો.',
        opts: [
          ['birthCert', 'Birth certificate', 'જન્મ પ્રમાણપત્ર'],
          ['lc',        'School leaving certificate (LC) / SSC certificate', 'શાળા છોડ્યાનું પ્રમાણપત્ર (LC) / SSC પ્રમાણપત્ર'],
          ['aadhaar',   'Aadhaar card', 'આધાર કાર્ડ'],
          ['pan',       'PAN card', 'પાન કાર્ડ'],
          ['passport',  'Passport', 'પાસપોર્ટ'],
          ['dl',        'Driving licence', 'ડ્રાઇવિંગ લાયસન્સ'],
          ['marksheet', 'Marksheet showing date of birth', 'જન્મ તારીખ દર્શાવતી માર્કશીટ'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B2.4', section: 'B2', blocking: false,
    en: 'Is there a Gujarat requirement? Tick what actually applies.',
    gu: 'ગુજરાતનું બંધન છે? ખરેખર શું લાગુ પડે તે પર ✔ કરો.',
    parts: [
      { key: 'requirement', type: 'single', opts: [
        ['domicile', 'Applicant must be domiciled in Gujarat', 'અરજદાર ગુજરાતનો વતની હોવો જોઈએ'],
        ['event',    'The event / activity must be held in Gujarat (applicant may be from outside)',
                     'કાર્યક્રમ / પ્રવૃત્તિ ગુજરાતમાં થવી જોઈએ (અરજદાર બહારનો હોઈ શકે)'],
        ['both',     'Both', 'બંને'],
        ['none',     'No Gujarat requirement', 'ગુજરાતનું કોઈ બંધન નથી']
      ]},
      { key: 'domicileAppliesTo', type: 'multi',
        en: 'If domicile is required, it applies to',
        gu: 'વતનનું બંધન હોય તો, કોને લાગુ',
        opts: [
          ['individual',  'Individual', 'વ્યક્તિ'],
          ['allMembers',  'All members', 'બધા સભ્યો'],
          ['regAddress',  'Institution’s registered address', 'સંસ્થાનું નોંધાયેલ સરનામું']
        ]},
      { key: 'domicileProof', type: 'multi',
        en: 'Which documents are accepted as proof of Gujarat domicile? Tick all that are allowed.',
        gu: 'ગુજરાત વતનના પુરાવા તરીકે કયા દસ્તાવેજ સ્વીકાર્ય છે? સ્વીકાર્ય હોય તે બધા પર ✔ કરો.',
        opts: [
          ['domicileCert', 'Domicile / residence certificate', 'નિવાસી / વતન પ્રમાણપત્ર (Domicile certificate)'],
          ['aadhaar',      'Aadhaar card', 'આધાર કાર્ડ'],
          ['voterId',      'Voter ID (election card)', 'મતદાર ઓળખકાર્ડ (ચૂંટણી કાર્ડ)'],
          ['ration',       'Ration card', 'રેશન કાર્ડ'],
          ['utility',      'Electricity / water / other utility bill', 'વીજળી / પાણી / અન્ય યુટિલિટી બિલ'],
          ['dl',           'Driving licence', 'ડ્રાઇવિંગ લાયસન્સ'],
          ['passport',     'Passport', 'પાસપોર્ટ'],
          ['passbook',     'Bank passbook showing Gujarat address', 'ગુજરાતનું સરનામું ધરાવતી બેંક પાસબુક'],
          ['regCert',      'Institution’s registration certificate showing Gujarat address (for agencies/institutions)',
                           'સંસ્થાનું ગુજરાતનું સરનામું ધરાવતું નોંધણી પ્રમાણપત્ર (એજન્સી/સંસ્થા માટે)'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B2.5', section: 'B2', blocking: false,
    en: 'Is the scheme restricted to a caste / category? Tick one.',
    gu: 'આ યોજના કોઈ જ્ઞાતિ / વર્ગ પૂરતી મર્યાદિત છે? એક પર ✔ કરો.',
    parts: [
      { key: 'category', type: 'single', opts: [
        ['open',  'Open to all (general)', 'સૌ માટે ખુલ્લી (જનરલ)'],
        ['sc',    'SC only', 'ફક્ત SC'],
        ['st',    'ST only', 'ફક્ત ST'],
        ['obc',   'OBC / SEBC only', 'ફક્ત OBC / SEBC'],
        ['other', 'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'groupApplies', type: 'single',
        en: 'If a group: the caste condition applies to',
        gu: 'જૂથ હોય તો: જ્ઞાતિ શરત કોને લાગુ',
        opts: [
          ['leader',   'Leader only', 'ફક્ત આગેવાન'],
          ['all',      'All members', 'બધા સભ્યો'],
          ['majority', 'A majority of members', 'મોટાભાગના સભ્યો'],
          ['na',       'Not applicable — scheme is open to all', 'લાગુ પડતું નથી — યોજના સૌ માટે ખુલ્લી']
        ]},
      { key: 'casteProof', type: 'multi',
        en: 'Which documents are accepted as proof of caste / category? Tick all allowed.',
        gu: 'જ્ઞાતિ / વર્ગના પુરાવા તરીકે કયા દસ્તાવેજ સ્વીકાર્ય છે? સ્વીકાર્ય હોય તે બધા પર ✔ કરો.',
        opts: [
          ['scCert',  'SC caste certificate', 'SC જ્ઞાતિ પ્રમાણપત્ર'],
          ['stCert',  'ST caste certificate', 'ST જ્ઞાતિ પ્રમાણપત્ર'],
          ['obcCert', 'OBC / SEBC certificate', 'OBC / SEBC પ્રમાણપત્ર'],
          ['other',   'Other', 'અન્ય', 'specify', 'જણાવો'],
          ['na',      'Not applicable — scheme is open to all', 'લાગુ પડતું નથી — યોજના સૌ માટે ખુલ્લી']
        ]}
    ]
  },

  {
    id: 'B2.6', section: 'B2', blocking: true,
    en: 'If a group or institution applies, which registration is acceptable, and what proves it?',
    gu: 'જૂથ કે સંસ્થા અરજી કરે તો કઈ નોંધણી સ્વીકાર્ય છે અને શું પુરાવો?',
    helpEN: 'Skip if only individuals apply. The registration NUMBER, used to match duplicates, is asked in B5.1, not here.',
    helpGU: 'ફક્ત વ્યક્તિ અરજી કરે તો છોડો. નોંધણી નંબર (બેવડી અરજી શોધવા માટે) B5.1 માં પુછાય છે, અહીં નહીં.',
    parts: [
      { key: 'regTypes', type: 'multi', opts: [
        ['trust',   'Public Trust (Charity Commissioner)', 'પબ્લિક ટ્રસ્ટ (ચેરિટી કમિશનર)'],
        ['society', 'Society (Registrar of Societies)', 'સોસાયટી'],
        ['sec8',    'Section-8 company', 'કલમ-8 કંપની'],
        ['coop',    'Co-operative', 'સહકારી'],
        ['dept',    'Department / Akademi / board registration', 'વિભાગ / અકાદમી / બોર્ડ નોંધણી'],
        ['other',   'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'proof', type: 'multi',
        en: 'Proof required',
        gu: 'જરૂરી પુરાવો',
        opts: [
          ['certificate', 'Registration certificate', 'નોંધણી પ્રમાણપત્ર'],
          ['renewal',     'Up-to-date renewal status', 'ચાલુ નવીકરણ સ્થિતિ']
        ]}
    ]
  },

  {
    id: 'B2.7', section: 'B2', blocking: true,
    en: 'Is there a limit on how much one applicant can take? Give the number, the amount, and — importantly — how "one applicant" is counted.',
    gu: 'એક અરજદાર વધુમાં વધુ કેટલી સહાય લઈ શકે તેની મર્યાદા છે? સંખ્યા, રકમ, અને "એક અરજદાર" કઈ રીતે ગણાય તે જણાવો.',
    parts: [
      { key: 'timesPerYear', type: 'text',
        en: 'Times the same applicant may apply per year',
        gu: 'એક જ અરજદાર વર્ષમાં કેટલી વાર અરજી કરી શકે' },
      { key: 'maxPerYear', type: 'text',
        en: 'Maximum total amount per applicant per year (₹)',
        gu: 'એક અરજદારને વર્ષમાં વધુમાં વધુ કુલ રકમ (₹)' },
      { key: 'noLimit', type: 'multi',
        en: 'Tick where there is no limit at all',
        gu: 'જ્યાં કોઈ મર્યાદા જ નથી ત્યાં ✔ કરો',
        opts: [
          ['times',  'No limit on the number of applications', 'અરજીની સંખ્યા પર મર્યાદા નથી'],
          ['amount', 'No limit on the total amount', 'કુલ રકમ પર મર્યાદા નથી']
        ]},
      { key: 'cooldown', type: 'text',
        en: 'Any minimum waiting period between two applications?',
        gu: 'બે અરજી વચ્ચે કોઈ લઘુતમ સમય-અંતર?' },
      { key: 'countedPer', type: 'multi',
        en: 'The limit is counted per —',
        gu: 'મર્યાદા કઈ રીતે ગણાય —',
        opts: [
          ['individual', 'Individual', 'વ્યક્તિ'],
          ['group',      'Group / troupe', 'જૂથ / મંડળી'],
          ['event',      'Event', 'કાર્યક્રમ'],
          ['household',  'Household / family', 'કુટુંબ'],
          ['bank',       'Bank account', 'બેંક ખાતું']
        ]},
      { key: 'differentName', type: 'longtext',
        en: 'How would you catch the same applicant applying again under a different name or a different leader?',
        gu: 'એ જ અરજદાર બીજા નામે કે બીજા આગેવાન હેઠળ ફરી અરજી કરે તો કેવી રીતે પકડાય?' }
    ]
  },

  {
    id: 'B2.8', section: 'B2', blocking: false,
    en: 'Is any applicant currently blacklisted or debarred — and on what grounds would someone be?',
    gu: 'હાલ કોઈ અરજદાર બ્લેકલિસ્ટ / પ્રતિબંધિત છે — અને કયા કારણોસર કોઈને પ્રતિબંધિત કરવો જોઈએ?',
    parts: [
      { key: 'listExists', type: 'single',
        en: 'Does a blacklist / debarment list exist today?',
        gu: 'આજે બ્લેકલિસ્ટ / પ્રતિબંધ યાદી છે?',
        opts: [
          ['yes',    'Yes', 'હા', 'who keeps it, and where', 'કોણ રાખે છે, ક્યાં'],
          ['no',     'No', 'ના'],
          ['unsure', 'Not that I know of', 'ખબર નથી']
        ]},
      { key: 'everHappened', type: 'multi',
        en: 'Has anyone in this scheme ever actually been debarred or had money recovered?',
        gu: 'આ યોજનામાં આજ સુધી ખરેખર કોઈને પ્રતિબંધિત કરાયા કે નાણાં વસૂલ કરાયા છે?',
        opts: [
          ['debarred',  'Yes — debarred', 'હા — પ્રતિબંધિત', 'roughly how many', 'અંદાજે કેટલા'],
          ['recovered', 'Yes — money recovered', 'હા — નાણાં વસૂલ', 'roughly how many', 'અંદાજે કેટલા'],
          ['never',     'No — never', 'ના — ક્યારેય નહીં'],
          ['unsure',    'Not that I know of', 'ખબર નથી']
        ]},
      { key: 'writtenRecord', type: 'single',
        en: 'If yes, is there a written record / list of them?',
        gu: 'હોય તો, તેમની લેખિત નોંધ / યાદી છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]},
      { key: 'grounds', type: 'multi',
        en: 'What should debar an applicant? Tick all that apply.',
        gu: 'અરજદારને શેના કારણે પ્રતિબંધિત કરવો? લાગુ પડે તે બધા પર ✔ કરો.',
        opts: [
          ['fraud',      'Fraud / fake bills', 'છેતરપિંડી / ખોટા બિલ'],
          ['doubleFund', 'Double funding (same event, two grants)', 'બેવડું ભંડોળ (એક જ કાર્યક્રમ, બે સહાય)'],
          ['ghost',      'Event never held', 'કાર્યક્રમ થયો જ નહીં'],
          ['noBills',    'Failure to submit bills / UC', 'બિલ / UC જમા ન કરવા'],
          ['falseInfo',  'False information in application', 'અરજીમાં ખોટી માહિતી'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'duration', type: 'text',
        en: 'For how long should debarment last?',
        gu: 'પ્રતિબંધ કેટલા સમય માટે?' },
      { key: 'scope', type: 'single',
        en: 'Should debarment apply to',
        gu: 'પ્રતિબંધ ક્યાં લાગુ',
        opts: [
          ['scheme', 'This scheme only', 'ફક્ત આ યોજના'],
          ['branch', 'All schemes in this branch', 'આ શાખાની બધી યોજના'],
          ['dept',   'All schemes across the department', 'વિભાગની બધી યોજના']
        ]}
    ]
  },

  /* ============ B3. What is funded & how much ============ */
  {
    id: 'B3.1', section: 'B3', blocking: true,
    en: 'Exactly which expenses does this scheme pay for? Tick every head that is funded.',
    gu: 'આ યોજના ચોક્કસ કયા ખર્ચ ચૂકવે છે? ભંડોળ મળતું હોય તે દરેક પર ✔ કરો.',
    helpEN: 'Anything explicitly NOT funded goes in the box below the list.',
    helpGU: 'સ્પષ્ટ રીતે ભંડોળ ન મળતું હોય તે યાદી નીચેના ખાનામાં લખો.',
    parts: [
      { key: 'heads', type: 'multi', opts: [
        ['artistFee',  'Artist / performer fee (honorarium, remuneration)', 'કલાકાર / પરફોર્મર મહેનતાણું (ઓનરેરિયમ)'],
        ['travel',     'Travel (TA)', 'મુસાફરી (TA)'],
        ['boarding',   'Boarding & lodging / DA', 'રહેવા-જમવા / DA'],
        ['stage',      'Stage, sound, lighting, pandal', 'સ્ટેજ, સાઉન્ડ, લાઇટિંગ, પંડાલ'],
        ['venueRent',  'Venue rent', 'સ્થળ ભાડું'],
        ['publicity',  'Publicity / printing / invitations', 'પ્રચાર / છપાઈ / આમંત્રણ'],
        ['equipment',  'Equipment / instruments / costumes / kit', 'સાધન / વાદ્ય / પોશાક / કીટ'],
        ['prizes',     'Prizes / awards / certificates', 'ઇનામ / પુરસ્કાર / પ્રમાણપત્ર'],
        ['food',       'Food / refreshments', 'ભોજન / નાસ્તો'],
        ['documentation', 'Documentation (photos / video)', 'દસ્તાવેજીકરણ (ફોટા / વિડિયો)'],
        ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'notFunded', type: 'longtext',
        en: 'Anything explicitly NOT fundable?',
        gu: 'સ્પષ્ટ રીતે ભંડોળ ન મળે એવું કંઈ?' }
    ]
  },

  {
    id: 'B3.2', section: 'B3', blocking: true,
    en: 'What amount is actually paid, and what is it paid for — per event, per day, per artist? Give the figure used today.',
    gu: 'આજે ખરેખર કેટલી રકમ ચૂકવાય છે અને તે શેના "દીઠ" છે? આજે વપરાતો આંકડો આપો.',
    helpEN: 'Today’s figure, not the old GR figure — that one is B1.3.',
    helpGU: 'આજનો આંકડો, જૂના ઠરાવનો નહીં — તે B1.3 માં.',
    parts: [
      { key: 'kind', type: 'single',
        en: 'The amount is',
        gu: 'રકમ છે',
        opts: [
          ['fixed',   'A fixed amount', 'નિશ્ચિત રકમ'],
          ['ceiling', 'A maximum ceiling (up to)', 'મહત્તમ મર્યાદા (સુધી)'],
          ['slab',    'A slab / tiered table', 'સ્લેબ / તબક્કાવાર કોષ્ટક']
        ]},
      { key: 'figure', type: 'text', en: 'Figure (₹)', gu: 'આંકડો (₹)' },
      { key: 'per', type: 'single',
        en: 'This amount is per —',
        gu: 'આ રકમ દીઠ —',
        opts: [
          ['event',       'Event / programme', 'કાર્યક્રમ'],
          ['day',         'Day', 'દિવસ'],
          ['artist',      'Artist / participant', 'કલાકાર / સહભાગી'],
          ['troupe',      'Troupe', 'મંડળી'],
          ['item',        'Item', 'વસ્તુ'],
          ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'slabs', type: 'longtext',
        en: 'If tiered, list the slabs (e.g. by event level, group size, district vs state)',
        gu: 'સ્લેબ હોય તો યાદી આપો (દા.ત. કાર્યક્રમ સ્તર, જૂથ કદ, જિલ્લા/રાજ્ય પ્રમાણે)' },
      { key: 'varies', type: 'longtext',
        en: 'Is this the same across the state, or does it vary by district / venue?',
        gu: 'આ આખા રાજ્યમાં એકસરખી છે કે જિલ્લા / સ્થળ પ્રમાણે બદલાય?' }
    ]
  },

  {
    id: 'B3.3', section: 'B3', blocking: true,
    en: 'For a given application, how is the exact amount decided? Tick one and name who decides.',
    gu: 'કોઈ એક અરજી માટે ચોક્કસ રકમ કેવી રીતે નક્કી થાય? એક પર ✔ કરો અને કોણ નક્કી કરે તે જણાવો.',
    parts: [
      { key: 'method', type: 'single', opts: [
        ['fixed',      'Fixed / slab rate — same for everyone, no discretion (portal can compute it)',
                       'નિશ્ચિત / સ્લેબ દર — બધા માટે એકસરખો, વિવેકાધીન નહીં (પોર્ટલ ગણી શકે)'],
        ['percentage', 'Percentage of the event’s cost (needs a cost estimate from the applicant)',
                       'કાર્યક્રમના ખર્ચની ટકાવારી (અરજદાર પાસેથી ખર્ચ અંદાજ જોઈએ)', 'what %', 'કેટલા %'],
        ['officer',    'A named officer decides, within a ceiling', 'નિયત અધિકારી મર્યાદામાં નક્કી કરે', 'who', 'કોણ'],
        ['committee',  'A committee decides', 'સમિતિ નક્કી કરે', 'which committee', 'કઈ સમિતિ'],
        ['negotiated', 'Negotiated / other', 'વાટાઘાટ / અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'requestMatters', type: 'longtext',
        en: 'Does the applicant’s requested amount matter, or is it set purely by rule/authority?',
        gu: 'અરજદારે માંગેલ રકમનું મહત્ત્વ છે, કે ફક્ત નિયમ/સત્તા પ્રમાણે નક્કી થાય?' }
    ]
  },

  {
    id: 'B3.4', section: 'B3', blocking: true,
    en: 'What are this year’s limits for this scheme?',
    gu: 'આ યોજનાની આ વર્ષની મર્યાદા શું છે?',
    helpEN: 'GR condition 18 — the department head must stay within both the beneficiary ceiling and the budget.',
    helpGU: 'ઠરાવ શરત 18 — વિભાગના વડાએ લાભાર્થી સંખ્યા અને બજેટ, બંને મર્યાદામાં રહેવું.',
    parts: [
      { key: 'maxBeneficiaries', type: 'single',
        en: 'Is a maximum number of beneficiaries fixed for FY 2026-27?',
        gu: 'FY 2026-27 માટે લાભાર્થીઓની મહત્તમ સંખ્યા નિયત છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'how many', 'કેટલા'],
          ['no',  'No number is fixed', 'કોઈ સંખ્યા નિયત નથી']
        ]},
      { key: 'allocation', type: 'text',
        en: 'Budget allocation for this scheme, FY 2026-27 (₹) — shown at the top of this page, from the GR; correct it if wrong',
        gu: 'આ યોજનાની બજેટ ફાળવણી, FY 2026-27 (₹) — ઠરાવ પરથી ઉપર દર્શાવેલ છે; ખોટું હોય તો સુધારો' },
      { key: 'runningCount', type: 'single',
        en: 'Is the running count tracked anywhere today?',
        gu: 'આજે ક્યાંય ચાલુ ગણતરી રખાય છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]},
      { key: 'onExhaust', type: 'single',
        en: 'When the beneficiary number or the budget is reached, what happens?',
        gu: 'લાભાર્થી સંખ્યા અથવા બજેટ પૂરું થાય ત્યારે શું થાય?',
        opts: [
          ['stop',      'Stop taking applications', 'અરજી લેવાનું બંધ'],
          ['waitlist',  'Waitlist', 'પ્રતીક્ષા યાદી'],
          ['moreFunds', 'Seek additional funds', 'વધારાનું ભંડોળ માંગવું'],
          ['noRule',    'No rule / keep sanctioning', 'કોઈ નિયમ નહીં / ચાલુ રાખવું'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B3.5', section: 'B3', blocking: false,
    en: 'Is there any minimum or maximum on the event’s size?',
    gu: 'કાર્યક્રમના કદ પર કોઈ લઘુતમ કે મહત્તમ મર્યાદા છે?',
    helpEN: 'First tick anything that has no rule at all, then fill the numbers for the rest.',
    helpGU: 'પહેલાં જેના પર કોઈ નિયમ જ નથી તેના પર ✔ કરો, પછી બાકીના આંકડા ભરો.',
    parts: [
      { key: 'noRule', type: 'multi',
        en: 'No rule at all for —',
        gu: 'આના પર કોઈ નિયમ જ નથી —',
        opts: [
          ['audience', 'Audience / participants', 'પ્રેક્ષક / સહભાગી'],
          ['artists',  'Number of artists / performers', 'કલાકાર / પરફોર્મરની સંખ્યા'],
          ['duration', 'Duration (days)', 'અવધિ (દિવસ)'],
          ['shows',    'Number of shows / sessions', 'શો / સત્રની સંખ્યા']
        ]},
      { key: 'limits', type: 'table',
        en: 'Where there is a rule, give the numbers',
        gu: 'નિયમ હોય ત્યાં આંકડા આપો',
        cols: [
          { en: 'Minimum', gu: 'લઘુતમ' },
          { en: 'Maximum', gu: 'મહત્તમ' }
        ],
        rows: [
          { en: 'Audience / participants', gu: 'પ્રેક્ષક / સહભાગી' },
          { en: 'Number of artists / performers', gu: 'કલાકાર / પરફોર્મરની સંખ્યા' },
          { en: 'Duration (days)', gu: 'અવધિ (દિવસ)' },
          { en: 'Number of shows / sessions', gu: 'શો / સત્રની સંખ્યા' }
        ]}
    ]
  },

  /* ============ B4. How the application is made ============ */
  {
    id: 'B4.1', section: 'B4', blocking: true,
    en: 'Where does an applicant submit today? Tick every channel actually used; mark ★ the most common.',
    gu: 'આજે અરજદાર ક્યાં અરજી કરે છે? ખરેખર વપરાતી દરેક રીત પર ✔ કરો; સૌથી સામાન્ય પર ★ કરો.',
    parts: [
      { key: 'channels', type: 'multi', star: true, opts: [
        ['stateOffice', 'In person at the State office (Commissionerate / Lalit Kala Akademi / Sangeet Natak Akademi)',
                        'રાજ્ય કચેરીએ રૂબરૂ (કમિશનર / લલિત કલા અકાદમી / સંગીત નાટક અકાદમી)'],
        ['district',    'At the district office (DYDO / district)', 'જિલ્લા કચેરીએ (DYDO / જિલ્લા)'],
        ['post',        'By post', 'ટપાલ દ્વારા'],
        ['online',      'Online (any existing portal / email)', 'ઓનલાઈન (કોઈ પોર્ટલ / ઈમેલ)', 'which', 'કયું'],
        ['reference',   'Through an MLA / MP / public-representative reference',
                        'ધારાસભ્ય / સાંસદ / લોકપ્રતિનિધિની ભલામણ દ્વારા']
      ]}
    ]
  },

  {
    id: 'B4.2', section: 'B4', blocking: true,
    en: 'Is there a prescribed application form, or is the application written on plain paper?',
    gu: 'અરજી માટે નિયત ફોર્મ છે, કે સાદા કાગળ પર અરજી લખાય છે?',
    parts: [
      { key: 'form', type: 'single', opts: [
        ['prescribed', 'There is a prescribed form — please attach a blank copy (it becomes the basis for the online form)',
                       'નિયત ફોર્મ છે — કોરી નકલ જોડો (ઓનલાઈન ફોર્મનો આધાર બનશે)'],
        ['freehand',   'No form — the applicant writes the application on plain paper',
                       'ફોર્મ નથી — અરજદાર સાદા કાગળ પર અરજી લખે છે']
      ]},
      { key: 'expected', type: 'longtext',
        en: 'If on plain paper: what information is the application expected to contain, even informally? (e.g. applicant details, event, dates, amount sought, bank details)',
        gu: 'સાદા કાગળ પર હોય તો: અરજીમાં અનૌપચારિક રીતે પણ કઈ માહિતી હોવી જોઈએ? (દા.ત. અરજદારની વિગત, કાર્યક્રમ, તારીખ, માંગેલ રકમ, બેંક વિગત)' }
    ]
  },

  {
    id: 'B4.3', section: 'B4', blocking: true,
    en: 'Exactly which documents must the applicant attach WITH the application? Tick every one required today, and write M = mandatory / O = optional beside each.',
    gu: 'અરજી સાથે અરજદારે બરાબર કયા દસ્તાવેજ જોડવા પડે? આજે જરૂરી હોય તે દરેક પર ✔ કરો, અને દરેક સામે M = ફરજિયાત / O = મરજિયાત લખો.',
    helpEN: 'Post-event bills are asked separately in B9.1.',
    helpGU: 'કાર્યક્રમ પછીના બિલ B9.1 માં અલગથી પૂછાય છે.',
    parts: [
      { key: 'docs', type: 'multi', opts: [
        ['aadhaar',    'Identity & bank — Aadhaar', 'ઓળખ અને બેંક — આધાર', 'M or O', 'M કે O'],
        ['pan',        'Identity & bank — PAN', 'ઓળખ અને બેંક — પાન', 'M or O', 'M કે O'],
        ['passbook',   'Identity & bank — bank passbook / cancelled cheque', 'ઓળખ અને બેંક — બેંક પાસબુક / રદ કરેલ ચેક', 'M or O', 'M કે O'],
        ['artistCard', 'Identity & bank — artist card', 'ઓળખ અને બેંક — કલાકાર કાર્ડ', 'M or O', 'M કે O'],
        ['regCert',    'Applicant / organisation — registration certificate (group/institution)',
                       'અરજદાર / સંસ્થા — નોંધણી પ્રમાણપત્ર (જૂથ/સંસ્થા)', 'M or O', 'M કે O'],
        ['roster',     'Applicant / organisation — member / artist roster', 'અરજદાર / સંસ્થા — સભ્ય / કલાકાર યાદી', 'M or O', 'M કે O'],
        ['pastWork',   'Merit & eligibility — proof of past work / performance record',
                       'યોગ્યતા — ભૂતકાળના કામનો પુરાવો', 'M or O', 'M કે O'],
        ['recommend',  'Merit & eligibility — recommendation / sponsorship letter', 'યોગ્યતા — ભલામણ / પ્રાયોજન પત્ર', 'M or O', 'M કે O'],
        ['ageProof',   'Merit & eligibility — age proof', 'યોગ્યતા — ઉંમર પુરાવો', 'M or O', 'M કે O'],
        ['domicile',   'Merit & eligibility — domicile proof', 'યોગ્યતા — વતન પુરાવો', 'M or O', 'M કે O'],
        ['caste',      'Merit & eligibility — caste certificate', 'યોગ્યતા — જ્ઞાતિ પ્રમાણપત્ર', 'M or O', 'M કે O'],
        ['proposal',   'Event — event proposal / concept note', 'કાર્યક્રમ — કાર્યક્રમ દરખાસ્ત / કન્સેપ્ટ નોંધ', 'M or O', 'M કે O'],
        ['budget',     'Event — event budget / cost estimate', 'કાર્યક્રમ — કાર્યક્રમ ખર્ચ અંદાજ', 'M or O', 'M કે O'],
        ['invitation', 'Event — invitation / organiser letter', 'કાર્યક્રમ — આમંત્રણ / આયોજક પત્ર', 'M or O', 'M કે O'],
        ['venuePerm',  'Event — venue permission', 'કાર્યક્રમ — સ્થળ પરવાનગી', 'M or O', 'M કે O'],
        ['gst',        'Tax — GST or GST-exemption certificate', 'કર — GST કે GST-મુક્તિ પ્રમાણપત્ર', 'M or O', 'M કે O'],
        ['noOther',    'Declarations — "no other grant for this event" declaration',
                       'ઘોષણા — "આ કાર્યક્રમ માટે બીજી કોઈ સહાય નથી લીધી" ઘોષણા', 'M or O', 'M કે O'],
        ['undertaking','Declarations — undertaking', 'ઘોષણા — બાંહેધરી', 'M or O', 'M કે O'],
        ['other',      'Other', 'અન્ય', 'specify + M or O', 'જણાવો + M કે O']
      ]}
    ]
  },

  {
    id: 'B4.4', section: 'B4', blocking: true,
    en: 'When can an applicant apply? Tick one.',
    gu: 'અરજદાર ક્યારે અરજી કરી શકે? એક પર ✔ કરો.',
    parts: [
      { key: 'window', type: 'single', opts: [
        ['rolling',  'Open all year (rolling — apply anytime)', 'આખું વર્ષ ખુલ્લી (ગમે ત્યારે અરજી)'],
        ['fixed',    'Fixed dates / annual cycle', 'નિશ્ચિત તારીખ / વાર્ષિક ચક્ર', 'which', 'કઈ'],
        ['round',    'Only when a round is invited / advertised', 'ફક્ત રાઉન્ડ જાહેર/આમંત્રિત થાય ત્યારે'],
        ['adhoc',    'No fixed rule / ad hoc', 'કોઈ નિશ્ચિત નિયમ નહીં / જરૂર મુજબ']
      ]},
      { key: 'whoOpens', type: 'text',
        en: 'Who decides and announces when a round opens?',
        gu: 'રાઉન્ડ ક્યારે ખૂલે તે કોણ નક્કી કરી જાહેર કરે?' },
      { key: 'deadline', type: 'single',
        en: 'Is there a hard deadline per round?',
        gu: 'દરેક રાઉન્ડ માટે છેલ્લી તારીખ (ડેડલાઇન) છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'what deadline', 'કઈ છેલ્લી તારીખ'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'B4.6', section: 'B4', blocking: true,
    en: 'Does the applicant sign a promise that they have not taken any other grant for the same event? And can we make this compulsory in the portal?',
    gu: 'અરજદાર એવું બાંહેધરીપત્ર આપે છે કે આ જ કાર્યક્રમ માટે બીજી કોઈ સહાય લીધી નથી? અને પોર્ટલમાં આ ફરજિયાત કરી શકાય?',
    parts: [
      { key: 'takenToday', type: 'single',
        en: 'Is such a promise taken today?',
        gu: 'આજે આવું બાંહેધરીપત્ર લેવાય છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'compulsory', type: 'single',
        en: 'Can it be made compulsory for every applicant on the portal?',
        gu: 'પોર્ટલ પર દરેક અરજદાર માટે ફરજિયાત કરી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  /* ========== B5. Identity details — applicant & event ========== */
  {
    id: 'B5.1', section: 'B5', blocking: true,
    en: 'Which ID numbers or ID documents do you collect from the applicant? Tick all; for each, write WHEN it is collected — A = at application, P = at payment / after the event. Add M if compulsory.',
    gu: 'અરજદાર પાસેથી કયા ID/ઓળખ-દસ્તાવેજ લેવાય છે? બધા પર ✔ કરો; દરેક સામે ક્યારે લેવાય તે લખો — A = અરજી વખતે, P = ચૂકવણી / કાર્યક્રમ પછી. ફરજિયાત હોય તો M ઉમેરો.',
    parts: [
      { key: 'ids', type: 'multi', opts: [
        ['aadhaar',  'Aadhaar', 'આધાર', 'A or P (+M)', 'A કે P (+M)'],
        ['pan',      'PAN', 'પાન', 'A or P (+M)', 'A કે P (+M)'],
        ['bank',     'Bank account number', 'બેંક ખાતા નંબર', 'A or P (+M)', 'A કે P (+M)'],
        ['mobile',   'Mobile number', 'મોબાઈલ નંબર', 'A or P (+M)', 'A કે P (+M)'],
        ['artistCard','Artist card', 'કલાકાર કાર્ડ', 'A or P (+M)', 'A કે P (+M)'],
        ['groupReg', 'Group / troupe registration number', 'જૂથ / મંડળી નોંધણી નંબર', 'A or P (+M)', 'A કે P (+M)'],
        ['instReg',  'Institution registration number', 'સંસ્થા નોંધણી નંબર', 'A or P (+M)', 'A કે P (+M)'],
        ['gst',      'GST number', 'GST નંબર', 'A or P (+M)', 'A કે P (+M)'],
        ['voterId',  'Voter ID', 'મતદાર ઓળખકાર્ડ', 'A or P (+M)', 'A કે P (+M)'],
        ['none',     'None / only name & address', 'કંઈ નહીં / ફક્ત નામ-સરનામું'],
        ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'mainId', type: 'text',
        en: 'Which single ID is treated as the main one today?',
        gu: 'કઈ એક ઓળખ મુખ્ય ગણાય?' }
    ]
  },

  {
    id: 'B5.2', section: 'B5', blocking: true,
    en: 'Does the body issue an artist / member ID card? If so, is it mandatory, numbered, and backed by a register?',
    gu: 'શું સંસ્થા કલાકાર / સભ્ય ઓળખકાર્ડ આપે છે? હોય તો — ફરજિયાત, નંબરવાળું, રજિસ્ટર સાથે?',
    helpEN: 'Culture / performing-arts schemes only — skip if this is a youth, sports, yoga or adventure scheme.',
    helpGU: 'ફક્ત સાંસ્કૃતિક / પર્ફોર્મિંગ-આર્ટ્સ યોજના — યુવા, રમતગમત, યોગ કે સાહસિક યોજના હોય તો છોડો.',
    parts: [
      { key: 'exists', type: 'single',
        en: 'Is there such a card?',
        gu: 'આવું કાર્ડ છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No / not applicable', 'ના / લાગુ નથી']
        ]},
      { key: 'issuedBy', type: 'text', en: 'If yes: issued by whom?', gu: 'હોય તો: કોણ આપે છે?' },
      { key: 'mandatory', type: 'single',
        en: 'Is it mandatory to have one to apply?',
        gu: 'અરજી કરવા કાર્ડ ફરજિયાત છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'uniqueNumber', type: 'single',
        en: 'Does it carry a unique card number?',
        gu: 'કાર્ડ પર યુનિક નંબર છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'register', type: 'single',
        en: 'Is there a register / list of card-holders?',
        gu: 'કાર્ડધારકોનું રજિસ્ટર / યાદી છે?',
        opts: [
          ['digital', 'Yes — digital', 'હા — ડિજિટલ'],
          ['manual',  'Yes — manual / register only', 'હા — ફક્ત મેન્યુઅલ / ચોપડે'],
          ['no',      'No', 'ના']
        ]},
      { key: 'criteria', type: 'longtext',
        en: 'On what criteria is it issued?',
        gu: 'કયા ધોરણે કાર્ડ અપાય છે?' }
    ]
  },

  {
    id: 'B5.3', section: 'B5', blocking: true,
    en: 'For a group/troupe, do you collect every member’s details, or only the leader’s?',
    gu: 'જૂથ/મંડળી માટે — દરેક સભ્યની વિગત લો છો કે ફક્ત આગેવાનની?',
    helpEN: 'Skip for individual-only schemes.',
    helpGU: 'ફક્ત વ્યક્તિગત યોજના હોય તો છોડો.',
    parts: [
      { key: 'collected', type: 'single',
        en: 'Today you collect',
        gu: 'આજે તમે લો છો',
        opts: [
          ['leader',  'Only the leader’s details', 'ફક્ત આગેવાનની વિગત'],
          ['roster',  'The full member roster', 'આખી સભ્ય યાદી'],
          ['noGroup', 'No group applies here', 'અહીં જૂથ અરજી કરતું નથી']
        ]},
      { key: 'perMember', type: 'multi',
        en: 'If a roster is collected, what is recorded per member?',
        gu: 'યાદી લેવાય તો દરેક સભ્ય દીઠ શું નોંધાય?',
        opts: [
          ['name',      'Name', 'નામ'],
          ['phone',     'Phone', 'ફોન'],
          ['aadhaar',   'Aadhaar', 'આધાર'],
          ['age',       'Age', 'ઉંમર'],
          ['signature', 'Signature', 'સહી'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'whenCollected', type: 'single',
        en: 'When is the roster collected?',
        gu: 'યાદી ક્યારે લેવાય?',
        opts: [
          ['application', 'At application', 'અરજી વખતે'],
          ['payment',     'At payment / after the event', 'ચૂકવણી / કાર્યક્રમ પછી']
        ]},
      { key: 'couldBeMandatory', type: 'single',
        en: 'Could a full roster (with Aadhaar) be made mandatory at application?',
        gu: 'આખી યાદી (આધાર સાથે) અરજી વખતે ફરજિયાત કરી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  {
    id: 'B5.5', section: 'B5', blocking: true,
    en: 'Whose bank account is the payment made into?',
    gu: 'ચૂકવણી કોના બેંક ખાતામાં થાય છે?',
    parts: [
      { key: 'account', type: 'single', opts: [
        ['individual',  'Individual applicant’s own account', 'વ્યક્તિગત અરજદારના પોતાના ખાતામાં'],
        ['leader',      'Group leader’s personal account', 'જૂથ આગેવાનના અંગત ખાતામાં'],
        ['groupOwn',    'Group’s / troupe’s own account (in the group’s name)', 'જૂથ / મંડળીના પોતાના ખાતામાં (જૂથના નામે)'],
        ['institution', 'Institution’s account', 'સંસ્થાના ખાતામાં'],
        ['varies',      'Either / varies', 'કોઈપણ / બદલાય']
      ]},
      { key: 'sameEachTime', type: 'longtext',
        en: 'Is this account compulsorily the same each time, or can it change per application?',
        gu: 'આ ખાતું દર વખતે એક જ હોવું ફરજિયાત છે, કે અરજી પ્રમાણે બદલી શકાય?' },
      { key: 'aadhaarLinked', type: 'single',
        en: 'For Direct Benefit Transfer (DBT), must it be an Aadhaar-linked account?',
        gu: 'ડાયરેક્ટ બેનિફિટ ટ્રાન્સફર (Direct Benefit Transfer, DBT) માટે ખાતું આધાર-લિંક હોવું જરૂરી છે?',
        opts: [
          ['yes',    'Yes', 'હા'],
          ['no',     'No', 'ના'],
          ['unsure', 'Not sure', 'ખાતરી નથી']
        ]}
    ]
  },

  {
    id: 'B5.6', section: 'B5', blocking: true,
    en: 'What is recorded today to identify the event/activity itself? Tick all that are captured.',
    gu: 'કાર્યક્રમ / પ્રવૃત્તિને ઓળખવા આજે શું નોંધાય છે? નોંધાતું હોય તે બધા પર ✔ કરો.',
    parts: [
      { key: 'captured', type: 'multi', opts: [
        ['name',      'Event name / title', 'કાર્યક્રમનું નામ / શીર્ષક'],
        ['dates',     'Date(s)', 'તારીખ(ઓ)'],
        ['venue',     'Venue / place', 'સ્થળ / જગ્યા'],
        ['organiser', 'Organiser / host body', 'આયોજક / યજમાન સંસ્થા'],
        ['audience',  'Audience size / scale', 'પ્રેક્ષક સંખ્યા / કદ'],
        ['nothing',   'Nothing specific — only the applicant’s details', 'કંઈ ખાસ નહીં — ફક્ત અરજદારની વિગત']
      ]},
      { key: 'eventId', type: 'single',
        en: 'Is any unique event number / ID assigned to a programme today?',
        gu: 'કોઈ કાર્યક્રમને યુનિક ઇવેન્ટ નંબર / ID અપાય છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'how', 'કેવી રીતે'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'B5.7', section: 'B5', blocking: false,
    en: 'Do members of the same family/household apply separately for this scheme? How would you spot it, and is anything done about it?',
    gu: 'આ યોજનામાં એક જ કુટુંબ/ઘરના સભ્યો અલગ-અલગ અરજી કરે છે? કેવી રીતે ખબર પડે, અને કંઈ કરાય છે?',
    parts: [
      { key: 'happens', type: 'single',
        en: 'Does this happen?',
        gu: 'આવું થાય છે?',
        opts: [
          ['yes',    'Yes', 'હા'],
          ['no',     'No', 'ના'],
          ['unsure', 'Not that I know of', 'ખબર નથી']
        ]},
      { key: 'signals', type: 'multi',
        en: 'What would signal that two applicants are from one household?',
        gu: 'બે અરજદાર એક જ ઘરના છે તે શેનાથી ખબર પડે?',
        opts: [
          ['address', 'Same address', 'એક જ સરનામું'],
          ['phone',   'Same phone', 'એક જ ફોન'],
          ['bank',    'Same bank account', 'એક જ બેંક ખાતું'],
          ['surname', 'Same surname', 'એક જ અટક'],
          ['nothing', 'Nothing would show it', 'કંઈથી ખબર ન પડે']
        ]},
      { key: 'doneToday', type: 'single',
        en: 'Is anything done about it today?',
        gu: 'આજે એ અંગે કંઈ કરાય છે?',
        opts: [
          ['nothing',  'Nothing', 'કંઈ નહીં'],
          ['informal', 'Informally checked', 'અનૌપચારિક તપાસ'],
          ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  /* ============ B7. Scrutiny & verification ============ */
  {
    id: 'B7.1', section: 'B7', blocking: true,
    en: 'Who checks/scrutinises an application — and is there an informal "in-principle" go-ahead before the formal approval process starts?',
    gu: 'અરજી કોણ તપાસે/ચકાસે છે — અને ઔપચારિક મંજૂરી પ્રક્રિયા શરૂ થાય તે પહેલાં કોઈ અનૌપચારિક "સૈદ્ધાંતિક" મંજૂરી હોય છે?',
    parts: [
      { key: 'whoScrutinises', type: 'multi',
        en: 'Who scrutinises?',
        gu: 'કોણ ચકાસે?',
        opts: [
          ['clerk',     'Dealing clerk (documents / completeness)', 'સંબંધિત કારકુન (દસ્તાવેજ / પૂર્ણતા)'],
          ['ad',        'Assistant Director / designated officer (eligibility / merit)',
                        'મદદનીશ નિયામક / નિયુક્ત અધિકારી (પાત્રતા / ગુણવત્તા)'],
          ['committee', 'Committee', 'સમિતિ'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'whatEachChecks', type: 'longtext',
        en: 'What does each one check? (documents / eligibility / merit / amount)',
        gu: 'દરેક શું તપાસે? (દસ્તાવેજ / પાત્રતા / ગુણવત્તા / રકમ)' },
      { key: 'inPrinciple', type: 'single',
        en: 'Before the formal (e-file) approval begins, is there an informal in-principle approval to proceed?',
        gu: 'ઔપચારિક (e-file) મંજૂરી શરૂ થાય તે પહેલાં અનૌપચારિક સૈદ્ધાંતિક મંજૂરી હોય છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'who gives it', 'કોણ આપે છે'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'B7.2', section: 'B7', blocking: true,
    en: 'Before the grant is sanctioned, is anything verified beyond the papers submitted? Tick what actually happens.',
    gu: 'સહાય મંજૂર થાય તે પહેલાં જમા કરેલ કાગળો ઉપરાંત કંઈ ચકાસાય છે? ખરેખર શું થાય તે પર ✔ કરો.',
    parts: [
      { key: 'checks', type: 'multi', opts: [
        ['nothing',   'Nothing — decided purely on the documents', 'કંઈ નહીં — ફક્ત દસ્તાવેજ પરથી નિર્ણય'],
        ['phone',     'Phone / verbal check with the applicant', 'અરજદાર સાથે ફોન / મૌખિક ખરાઈ'],
        ['district',  'Check with the district office', 'જિલ્લા કચેરી સાથે ખરાઈ'],
        ['siteVisit', 'Physical site / venue visit', 'સ્થળ / વેન્યુની રૂબરૂ મુલાકાત'],
        ['exists',    'Confirmation the troupe/organisation genuinely exists', 'મંડળી/સંસ્થા ખરેખર અસ્તિત્વ ધરાવે છે તેની ખાતરી'],
        ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'whoChecks', type: 'text',
        en: 'Who does the check, if any?',
        gu: 'ચકાસણી કોણ કરે છે (જો કરે તો)?' }
    ]
  },

  {
    id: 'B7.3', section: 'B7', blocking: false,
    en: 'If a site inspection were to be added, who could actually do it, and what would they confirm?',
    gu: 'જો સ્થળ તપાસ ઉમેરવી હોય, તો ખરેખર કોણ કરી શકે અને શું ખાતરી કરે?',
    parts: [
      { key: 'whoCould', type: 'multi',
        en: 'Who could do it?',
        gu: 'કોણ કરી શકે?',
        opts: [
          ['dydo',      'District Youth Development Officer (DYDO)', 'જિલ્લા યુવા વિકાસ અધિકારી (DYDO)'],
          ['prant',     'Prant Youth Development Officer', 'પ્રાંત યુવા વિકાસ અધિકારી'],
          ['thirdParty','Third party / social audit', 'ત્રાહિત / સામાજિક ઓડિટ'],
          ['selfCert',  'Self-certification with photos/video', 'ફોટા/વિડિયો સાથે સ્વ-પ્રમાણન'],
          ['other',     'Other designated officer', 'અન્ય નિયુક્ત અધિકારી', 'specify', 'જણાવો']
        ]},
      { key: 'whatConfirm', type: 'multi',
        en: 'What should they confirm?',
        gu: 'શું ખાતરી કરે?',
        opts: [
          ['exists',   'The troupe/organisation exists', 'મંડળી/સંસ્થા અસ્તિત્વ'],
          ['venue',    'The venue is booked', 'સ્થળ બુક'],
          ['happened', 'The event actually happened', 'કાર્યક્રમ ખરેખર થયો'],
          ['audience', 'Audience / scale', 'પ્રેક્ષક / કદ'],
          ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'stage', type: 'single',
        en: 'At what stage?',
        gu: 'કયા તબક્કે?',
        opts: [
          ['before', 'Before sanction', 'મંજૂરી પહેલાં'],
          ['during', 'During the event', 'કાર્યક્રમ દરમિયાન'],
          ['after',  'After, before payment', 'પછી, ચૂકવણી પહેલાં']
        ]}
    ]
  },

  {
    id: 'B7.4', section: 'B7', blocking: true,
    en: 'Is a committee involved in deciding this scheme’s applications? When?',
    gu: 'આ યોજનાની અરજીઓ નક્કી કરવામાં સમિતિ સામેલ છે? ક્યારે?',
    parts: [
      { key: 'involvement', type: 'single', opts: [
        ['none',   'No committee — an officer decides', 'સમિતિ નહીં — અધિકારી નક્કી કરે'],
        ['all',    'A committee decides all applications', 'સમિતિ બધી અરજીઓ નક્કી કરે'],
        ['bigOnly','Committee only for big / high-value cases', 'ફક્ત મોટા / વધુ રકમના કેસ માટે',
                   'above what size or amount', 'કેટલા કદ/રકમથી ઉપર']
      ]},
      { key: 'decides', type: 'multi',
        en: 'What does the committee decide?',
        gu: 'સમિતિ શું નક્કી કરે?',
        opts: [
          ['eligibility', 'Eligibility', 'પાત્રતા'],
          ['selection',   'Selection among applicants', 'અરજદારોમાંથી પસંદગી'],
          ['amount',      'The amount', 'રકમ'],
          ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B7.5', section: 'B7', blocking: false,
    en: 'Who is on the committee, who appoints it, and how often does it meet?',
    gu: 'સમિતિમાં કોણ છે, કોણ નિમણૂક કરે, અને કેટલી વાર મળે છે?',
    helpEN: 'Only if a committee exists — skip otherwise.',
    helpGU: 'ફક્ત સમિતિ હોય તો — નહીંતર છોડો.',
    parts: [
      { key: 'members',  type: 'longtext', en: 'Members (designations)', gu: 'સભ્યો (હોદ્દા)' },
      { key: 'appoints', type: 'text', en: 'Who nominates / appoints the members?', gu: 'સભ્યોની નિમણૂક કોણ કરે છે?' },
      { key: 'frequency',type: 'text', en: 'How often does it meet?', gu: 'કેટલી વાર મળે છે?' },
      { key: 'quorum',   type: 'text', en: 'Is there a minimum quorum?', gu: 'લઘુતમ કોરમ છે?' }
    ]
  },

  {
    id: 'B7.6', section: 'B7', blocking: true,
    en: 'When there are more eligible applicants than budget/slots, how are the ones who get funded chosen?',
    gu: 'પાત્ર અરજદારો બજેટ/જગ્યા કરતાં વધુ હોય ત્યારે, કોને સહાય મળે તે કેવી રીતે પસંદ થાય?',
    helpEN: 'GR condition 27 — selection must be transparent.',
    helpGU: 'ઠરાવ શરત 27 — પસંદગી પારદર્શક હોવી જોઈએ.',
    parts: [
      { key: 'method', type: 'single', opts: [
        ['fcfs',       'First come, first served (by application date)', 'પહેલા આવો પહેલા મેળવો (અરજી તારીખ પ્રમાણે)'],
        ['merit',      'Merit / scoring / ranking', 'ગુણવત્તા / સ્કોરિંગ / ક્રમ', 'on what criteria', 'કયા ધોરણે'],
        ['committee',  'Committee selects', 'સમિતિ પસંદ કરે'],
        ['lottery',    'Lottery / draw', 'ડ્રો / ચિઠ્ઠી'],
        ['discretion', 'Officer’s discretion', 'અધિકારીની વિવેકબુદ્ધિ'],
        ['none',       'No fixed method today', 'આજે કોઈ નિશ્ચિત પદ્ધતિ નથી']
      ]},
      { key: 'written', type: 'single',
        en: 'Is the selection method written anywhere?',
        gu: 'પસંદગી પદ્ધતિ ક્યાંય લખેલ છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  /* ============ B8. Payment specifics ============ */
  {
    id: 'B8.1', section: 'B8', blocking: true,
    en: 'Is any amount disbursed to the beneficiary prior to completion of the event/activity, or is payment released only after completion?',
    gu: 'કાર્યક્રમ/પ્રવૃત્તિ પૂર્ણ થયા પહેલાં લાભાર્થીને કોઈ રકમ ચૂકવવામાં આવે છે, કે ચૂકવણું ફક્ત પૂર્ણ થયા પછી જ કરવામાં આવે છે?',
    parts: [
      { key: 'timing', type: 'single', opts: [
        ['afterOnly', 'No advance — payment released only after completion, on submission of bills/vouchers (reimbursement basis)',
                      'પેશગી નહીં — ચૂકવણું ફક્ત કાર્યક્રમ પૂર્ણ થયા બાદ, બિલ/વાઉચર રજૂ થયેથી (ખર્ચ ભરપાઈ ધોરણે)'],
        ['partAdvance','Advance admissible — part payment in advance, balance after completion',
                      'પેશગી માન્ય — અમુક રકમ પેશગી, બાકીની રકમ પૂર્ણ થયા બાદ'],
        ['fullAdvance','Full amount disbursed in advance (e.g. award/puraskar; honorarium payable on the occasion)',
                      'સંપૂર્ણ રકમ પેશગી ચૂકવાય (દા.ત. પુરસ્કાર; પ્રસંગે ચૂકવવાપાત્ર માનદ વેતન)']
      ]},
      { key: 'quantum', type: 'text',
        en: 'If an advance is admissible — quantum of advance: ____ % of sanctioned amount / fixed ₹ ____',
        gu: 'પેશગી માન્ય હોય તો — પેશગીની રકમ: મંજૂર થયેલ રકમના ____ % / નિયત ₹ ____' },
      { key: 'advanceStage', type: 'single',
        en: 'Stage at which the advance is released',
        gu: 'પેશગી કયા તબક્કે છૂટી કરવામાં આવે',
        opts: [
          ['workOrder', 'On issue of work order / administrative permission', 'વર્ક ઓર્ડર / વહીવટી મંજૂરી થયેથી'],
          ['sanction',  'On sanction', 'મંજૂરી થયેથી'],
          ['beforeEvent','Immediately prior to the event', 'કાર્યક્રમ તુરત પહેલાં']
        ]},
      { key: 'security', type: 'single',
        en: 'Security obtained against the advance',
        gu: 'પેશગી સામે લેવાતી જામીનગીરી',
        opts: [
          ['bankGuarantee', 'Bank Guarantee', 'બેંક ગેરંટી'],
          ['undertaking',   'Written undertaking / bond', 'લેખિત બાંહેધરી / બોન્ડ'],
          ['nil',           'Nil', 'કંઈ નહીં']
        ]},
      { key: 'advanceOrder', type: 'text',
        en: 'Government Resolution / order under which the advance is admissible',
        gu: 'પેશગી કયા ઠરાવ / હુકમ હેઠળ માન્ય છે' }
    ]
  },

  {
    id: 'B8.2', section: 'B8', blocking: true,
    en: 'By which office, and through which channel, is the payment actually disbursed to the beneficiary?',
    gu: 'કઈ કચેરી દ્વારા અને કઈ પ્રણાલી મારફતે લાભાર્થીને ચૂકવણું ખરેખર કરવામાં આવે છે?',
    parts: [
      { key: 'ddo', type: 'single',
        en: 'Disbursing office (DDO / Drawing & Disbursing Officer)',
        gu: 'ચૂકવણું કરનાર કચેરી (DDO / આહરણ-વિતરણ અધિકારી)',
        opts: [
          ['state',    'State office directly (Commissionerate / Lalit Kala Akademi / Sangeet Natak Akademi)',
                       'રાજ્ય કચેરી સીધી (કમિશનરેટ / લલિત કલા અકાદમી / સંગીત નાટક અકાદમી)'],
          ['district', 'District office (DYDO / district establishment) → district treasury',
                       'જિલ્લા કચેરી (DYDO / જિલ્લા સ્થાપના) → જિલ્લા તિજોરી'],
          ['akademi',  'Akademi / autonomous body, from its own grant-in-aid account',
                       'અકાદમી / સ્વાયત્ત સંસ્થા, પોતાના સહાયક અનુદાન ખાતામાંથી'],
          ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'channel', type: 'single',
        en: 'Channel / system of payment',
        gu: 'ચૂકવણીની પ્રણાલી / માધ્યમ',
        opts: [
          ['ifms',   'Treasury via IFMS', 'IFMS મારફતે તિજોરી'],
          ['pfms',   'PFMS', 'PFMS'],
          ['direct', 'Direct bank transfer (RTGS/NEFT) from office account', 'કચેરીના ખાતામાંથી સીધું બેંક ટ્રાન્સફર (RTGS/NEFT)'],
          ['cheque', 'Account-payee cheque', 'એકાઉન્ટ-પેયી ચેક'],
          ['other',  'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'route', type: 'single',
        en: 'Is the amount credited straight to the final beneficiary’s bank account, or first to an intermediary who pays onward?',
        gu: 'રકમ સીધી અંતિમ લાભાર્થીના બેંક ખાતામાં જમા થાય છે, કે પહેલાં કોઈ મધ્યસ્થને, જે આગળ ચૂકવે છે?',
        opts: [
          ['dbt',          'Straight to beneficiary (DBT)', 'સીધી લાભાર્થીને (DBT)'],
          ['intermediary', 'Via intermediary — organiser / district office / other',
                           'મધ્યસ્થ મારફતે — આયોજક / જિલ્લા કચેરી / અન્ય', 'who', 'કોણ']
        ]}
    ]
  },

  {
    id: 'B8.3', section: 'B8', blocking: true,
    en: 'Which sanction/order documents are issued for this scheme, and at what stage?',
    gu: 'આ યોજના માટે કયા મંજૂરી/હુકમ દસ્તાવેજો બહાર પાડવામાં આવે છે, અને કયા તબક્કે?',
    parts: [
      { key: 'orders', type: 'single', opts: [
        ['two',    'Two orders — (a) work order / administrative permission before the event/activity, (b) grant order / payment sanction after completion (expected default)',
                   'બે હુકમ — (અ) કાર્યક્રમ/પ્રવૃત્તિ પહેલાં વર્ક ઓર્ડર / વહીવટી મંજૂરી, (બ) પૂર્ણ થયા બાદ ગ્રાન્ટ ઓર્ડર / ચૂકવણી મંજૂરી (અપેક્ષિત મૂળભૂત)'],
        ['single', 'Single order — one sanction order', 'એક જ હુકમ — એક જ મંજૂરી હુકમ', 'at what stage', 'કયા તબક્કે'],
        ['other',  'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'workOrderStage', type: 'single',
        en: 'Work order / permission — stage',
        gu: 'વર્ક ઓર્ડર / પરવાનગી — તબક્કો',
        opts: [
          ['inPrinciple', 'On in-principle approval', 'સૈદ્ધાંતિક મંજૂરી થયેથી'],
          ['formal',      'On formal sanction', 'ઔપચારિક મંજૂરી થયેથી'],
          ['na',          'Not applicable', 'લાગુ નથી']
        ]},
      { key: 'grantOrderStage', type: 'single',
        en: 'Grant order / payment sanction — stage',
        gu: 'ગ્રાન્ટ ઓર્ડર / ચૂકવણી મંજૂરી — તબક્કો',
        opts: [
          ['afterEvent', 'After event/activity completion', 'કાર્યક્રમ / પ્રવૃત્તિ પૂર્ણ થયા બાદ'],
          ['onSanction', 'On sanction (if advance)', 'મંજૂરી થયેથી (પેશગી હોય તો)'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'B8.4', section: 'B8', blocking: true,
    en: 'Is this scheme registered on the DBT portal, and what is its scheme code?',
    gu: 'આ યોજના DBT પોર્ટલ પર નોંધાયેલ છે, અને તેનો સ્કીમ કોડ શું છે?',
    helpEN: 'GR condition 30 makes DBT-portal registration compulsory.',
    helpGU: 'ઠરાવ શરત 30 મુજબ DBT પોર્ટલ પર નોંધણી ફરજિયાત છે.',
    parts: [
      { key: 'registered', type: 'single',
        en: 'Registered on the State DBT portal?',
        gu: 'રાજ્ય DBT પોર્ટલ પર નોંધાયેલ છે?',
        opts: [
          ['yes',    'Yes', 'હા'],
          ['no',     'No', 'ના'],
          ['unsure', 'Don’t know / not confirmed', 'ખબર નથી / ખાતરી નથી']
        ]},
      { key: 'dbtCode', type: 'text',
        en: 'DBT scheme code / ID (if allotted)',
        gu: 'DBT સ્કીમ કોડ / ID (ફાળવેલ હોય તો)' },
      { key: 'otherSystem', type: 'multi',
        en: 'Registered on any other payment system?',
        gu: 'અન્ય કોઈ ચૂકવણી પ્રણાલી પર નોંધાયેલ?',
        opts: [
          ['pfms',  'PFMS', 'PFMS', 'code', 'કોડ'],
          ['other', 'Other', 'અન્ય', 'specify', 'જણાવો'],
          ['none',  'None', 'કોઈ નહીં']
        ]},
      { key: 'ifNotRegistered', type: 'longtext',
        en: 'If not registered — current status / reason',
        gu: 'નોંધાયેલ ન હોય તો — હાલની સ્થિતિ / કારણ' }
    ]
  },

  {
    id: 'B8.6', section: 'B8', blocking: false,
    en: 'How long does each stage take? Tick the usual time taken between each stage.',
    gu: 'દરેક તબક્કામાં કેટલો સમય લાગે છે? દરેક તબક્કા વચ્ચે સામાન્ય રીતે કેટલો સમય લાગે છે તે પર ✔ કરો.',
    parts: [
      { key: 't1', type: 'single',
        en: 'Application → Work order (permission)', gu: 'અરજી → વર્ક ઓર્ડર (પરવાનગી)',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't2', type: 'single',
        en: 'Work order → Event / activity completion', gu: 'વર્ક ઓર્ડર → કાર્યક્રમ / પ્રવૃત્તિ પૂર્ણ',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't3', type: 'single',
        en: 'Event / activity completion → Grant order', gu: 'કાર્યક્રમ / પ્રવૃત્તિ પૂર્ણ → ગ્રાન્ટ ઓર્ડર',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't4', type: 'single',
        en: 'Grant order → Bill submission', gu: 'ગ્રાન્ટ ઓર્ડર → બિલ રજૂઆત',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't5', type: 'single',
        en: 'Bill submission → Audit', gu: 'બિલ રજૂઆત → ઓડિટ',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't6', type: 'single',
        en: 'Audit → District office', gu: 'ઓડિટ → જિલ્લા કચેરી',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't7', type: 'single',
        en: 'District office → Treasury', gu: 'જિલ્લા કચેરી → તિજોરી',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 't8', type: 'single',
        en: 'Treasury → Final payment (credited)', gu: 'તિજોરી → આખરી ચૂકવણી (જમા)',
        opts: [
          ['u15',    'Up to 15 days', '15 દિવસ સુધી'],
          ['15to30', '15–30 days', '15–30 દિવસ'],
          ['1to2m',  '1–2 months', '1–2 મહિના'],
          ['o2m',    'Over 2 months', '2 મહિનાથી વધુ'],
          ['varies', 'Varies', 'બદલાય']
        ]},
      { key: 'prescribed', type: 'single',
        en: 'Is any timeline prescribed anywhere (GR / departmental circular / citizen charter)?',
        gu: 'શું કોઈ સમયમર્યાદા ક્યાંય નિયત કરેલ છે (ઠરાવ / વિભાગીય પરિપત્ર / નાગરિક અધિકારપત્ર)?',
        opts: [
          ['yes', 'Yes', 'હા', 'where and what', 'ક્યાં અને શું'],
          ['no',  'No', 'ના']
        ]},
      { key: 'delays', type: 'multi',
        en: 'Where do delays usually arise?',
        gu: 'વિલંબ સામાન્ય રીતે ક્યાં થાય છે?',
        opts: [
          ['approval',  'Getting approval / work order', 'મંજૂરી / વર્ક ઓર્ડર મેળવવામાં'],
          ['grantOrder','Grant order issuance', 'ગ્રાન્ટ ઓર્ડર બહાર પાડવામાં'],
          ['billDefect','Bill deficiency / resubmission', 'બિલમાં ત્રુટિ / ફેરરજૂઆત'],
          ['auditObj',  'Audit objection', 'ઓડિટ વાંધા'],
          ['district',  'District office forwarding', 'જિલ્લા કચેરીથી આગળ મોકલવામાં'],
          ['treasury',  'Treasury / IFMS payment', 'તિજોરી / IFMS ચૂકવણી'],
          ['funds',     'Fund availability', 'ભંડોળની ઉપલબ્ધતા'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  /* ============ B9. Proof, reports & UC ============ */
  {
    id: 'B9.1', section: 'B9', blocking: true,
    en: 'Once the sanctioned activity/event is completed, exactly which documents must be submitted before payment? Tick all required, and write M = mandatory / O = optional beside each.',
    gu: 'મંજૂર થયેલ પ્રવૃત્તિ/કાર્યક્રમ પૂર્ણ થયા પછી, ચૂકવણી પહેલાં બરાબર કયા દસ્તાવેજ રજૂ કરવા પડે? જરૂરી હોય તે દરેક પર ✔ કરો, અને દરેક સામે M = ફરજિયાત / O = મરજિયાત લખો.',
    helpEN: 'Application-time enclosures (B4.3) and the Utilisation Certificate itself (B9.2) are asked separately.',
    helpGU: 'અરજી સાથેના દસ્તાવેજ (B4.3) અને ઉપયોગિતા પ્રમાણપત્ર પોતે (B9.2) અલગથી પૂછાય છે.',
    parts: [
      { key: 'anyRequired', type: 'single',
        en: 'Is any document / bill required after completion, before payment?',
        gu: 'પૂર્ણ થયા પછી, ચૂકવણી પહેલાં કોઈ દસ્તાવેજ / બિલ જરૂરી છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No — payment is made without any further documents (e.g. award / pension); skip the list below',
                  'ના — કોઈ વધુ દસ્તાવેજ વિના ચૂકવણું થાય (દા.ત. પુરસ્કાર / પેન્શન); નીચેની યાદી છોડો']
        ]},
      { key: 'docs', type: 'multi',
        en: 'Which documents — tick each, and write M or O beside it',
        gu: 'કયા દસ્તાવેજ — દરેક પર ✔ કરો અને સામે M કે O લખો',
        opts: [
          ['finalBill',    'Bills & financial — final bill / claim', 'બિલ અને નાણાકીય — આખરી બિલ / દાવો', 'M or O', 'M કે O'],
          ['vouchers',     'Bills & financial — original vouchers & receipts (itemised)',
                           'બિલ અને નાણાકીય — મૂળ વાઉચર અને પહોંચ (વિગતવાર)', 'M or O', 'M કે O'],
          ['advanceAdj',   'Bills & financial — advance-adjustment receipt (if advance paid)',
                           'બિલ અને નાણાકીય — પેશગી-સમાયોજન પહોંચ (પેશગી ચૂકવી હોય તો)', 'M or O', 'M કે O'],
          ['tickets',      'Bills & financial — travel tickets / fare receipts (if travel funded)',
                           'બિલ અને નાણાકીય — મુસાફરી ટિકિટ / ભાડાની પહોંચ (મુસાફરી સહાયપાત્ર હોય તો)', 'M or O', 'M કે O'],
          ['stampedRcpt',  'Bills & financial — stamped / revenue-stamp receipt',
                           'બિલ અને નાણાકીય — રેવન્યુ સ્ટેમ્પવાળી પહોંચ', 'M or O', 'M કે O'],
          ['completionCert','Completion & output — completion certificate', 'પૂર્ણતા અને પરિણામ — પૂર્ણતા પ્રમાણપત્ર', 'M or O', 'M કે O'],
          ['output',       'Completion & output — the finished work / output (publication · recording · artwork · asset created)',
                           'પૂર્ણતા અને પરિણામ — તૈયાર થયેલ કૃતિ / પરિણામ (પ્રકાશન · રેકોર્ડિંગ · કલાકૃતિ · સર્જિત મિલકત)', 'M or O', 'M કે O'],
          ['auditedAccts', 'Completion & output — audited statement of accounts (institutions / larger or capital grants)',
                           'પૂર્ણતા અને પરિણામ — ઓડિટ થયેલ હિસાબ પત્રક (સંસ્થા / મોટી કે મૂડી સહાય)', 'M or O', 'M કે O'],
          ['valuation',    'Completion & output — valuation / asset proof (capital works)',
                           'પૂર્ણતા અને પરિણામ — મૂલ્યાંકન / મિલકત પુરાવો (મૂડી કામ)', 'M or O', 'M કે O'],
          ['eventReport',  'Event / activity evidence — activity / event report', 'કાર્યક્રમ પુરાવો — પ્રવૃત્તિ / કાર્યક્રમ અહેવાલ', 'M or O', 'M કે O'],
          ['photos',       'Event / activity evidence — photographs', 'કાર્યક્રમ પુરાવો — ફોટોગ્રાફ',
                           'how many? how many copies? M or O', 'કેટલા? કેટલી નકલ? M કે O'],
          ['video',        'Event / activity evidence — video / media coverage', 'કાર્યક્રમ પુરાવો — વિડિયો / મીડિયા કવરેજ', 'M or O', 'M કે O'],
          ['beneficiaryList','Event / activity evidence — audience / participant (beneficiary) list',
                           'કાર્યક્રમ પુરાવો — પ્રેક્ષક / સહભાગી (લાભાર્થી) યાદી', 'M or O', 'M કે O'],
          ['attendance',   'Event / activity evidence — attendance record (training / camp)',
                           'કાર્યક્રમ પુરાવો — હાજરી પત્રક (તાલીમ / શિબિર)', 'M or O', 'M કે O'],
          ['pressClips',   'Event / activity evidence — press clippings / publicity showing department credit',
                           'કાર્યક્રમ પુરાવો — પ્રેસ કટિંગ / વિભાગનો ઉલ્લેખ દર્શાવતી પ્રસિદ્ધિ', 'M or O', 'M કે O'],
          ['workOrderCopy','Reference orders — copy of work order', 'સંદર્ભ હુકમ — વર્ક ઓર્ડરની નકલ', 'M or O', 'M કે O'],
          ['grantOrderCopy','Reference orders — copy of grant order', 'સંદર્ભ હુકમ — ગ્રાન્ટ ઓર્ડરની નકલ', 'M or O', 'M કે O'],
          ['payeePassbook','Identity & bank — payee bank passbook / cancelled cheque',
                           'ઓળખ અને બેંક — ચૂકવણું મેળવનારની બેંક પાસબુક / રદ કરેલ ચેક', 'M or O', 'M કે O'],
          ['pan',          'Identity & bank — PAN', 'ઓળખ અને બેંક — પાન', 'M or O', 'M કે O'],
          ['gst',          'Identity & bank — GST / GST-exemption certificate', 'ઓળખ અને બેંક — GST / GST-મુક્તિ પ્રમાણપત્ર', 'M or O', 'M કે O'],
          ['artistList',   'Identity & bank — artist / member list + undertaking', 'ઓળખ અને બેંક — કલાકાર / સભ્ય યાદી + બાંહેધરી', 'M or O', 'M કે O'],
          ['heldCert',     'Declarations — certificate the activity was held / completed as sanctioned',
                           'ઘોષણા — પ્રવૃત્તિ મંજૂરી મુજબ યોજાઈ / પૂર્ણ થઈ તે અંગેનું પ્રમાણપત્ર', 'M or O', 'M કે O'],
          ['other',        'Other', 'અન્ય', 'specify + M or O', 'જણાવો + M કે O']
        ]}
    ]
  },

  {
    id: 'B9.2', section: 'B9', blocking: true,
    en: 'Is a formal Utilisation Certificate (UC) required, certifying the grant was spent on the sanctioned purpose? In what format?',
    gu: 'ગ્રાન્ટ મંજૂર થયેલ હેતુ માટે વપરાઈ છે તે પ્રમાણિત કરતું ઔપચારિક ઉપયોગિતા પ્રમાણપત્ર (Utilisation Certificate, UC) જરૂરી છે? કયા નમૂનામાં?',
    parts: [
      { key: 'mandatory', type: 'single',
        en: 'Is a formal UC mandatory today?',
        gu: 'આજે ઔપચારિક UC ફરજિયાત છે?',
        opts: [
          ['yes',    'Yes', 'હા'],
          ['no',     'No', 'ના'],
          ['unsure', 'Don’t know', 'ખબર નથી'],
          ['na',     'Not applicable (award / pension — no grant to account for)', 'લાગુ નથી (પુરસ્કાર / પેન્શન — હિસાબ આપવાની ગ્રાન્ટ નથી)']
        ]},
      { key: 'format', type: 'single',
        en: 'Format used',
        gu: 'વપરાતો નમૂનો',
        opts: [
          ['prescribed', 'Prescribed departmental / body UC format (attach a blank copy)',
                         'નિયત વિભાગીય / સંસ્થાકીય UC નમૂનો (કોરી નકલ જોડો)'],
          ['freehand',   'Statement / letter on plain paper', 'સાદા કાગળ પર લખેલ પત્રક / પત્ર'],
          ['none',       'No set format', 'કોઈ નિશ્ચિત નમૂનો નહીં']
        ]},
      { key: 'frequency', type: 'single',
        en: 'The UC is submitted',
        gu: 'UC કઈ રીતે રજૂ થાય',
        opts: [
          ['perActivity', 'Per activity / event', 'દરેક પ્રવૃત્તિ / કાર્યક્રમ દીઠ'],
          ['annual',      'Annually (per financial year)', 'વાર્ષિક (નાણાકીય વર્ષ દીઠ)'],
          ['both',        'Both', 'બંને']
        ]},
      { key: 'certifies', type: 'multi',
        en: 'What must the UC certify?',
        gu: 'UC શું પ્રમાણિત કરે?',
        opts: [
          ['spent',     'The sanctioned amount was actually spent on the sanctioned purpose',
                        'મંજૂર રકમ ખરેખર મંજૂર થયેલ હેતુ માટે વપરાઈ'],
          ['itemised',  'Itemised expenditure against the sanction', 'મંજૂરી સામે વિગતવાર ખર્ચ'],
          ['refund',    'Any unspent balance refunded (with cheque / refund details)',
                        'વણવપરાયેલ રકમ પરત (ચેક / પરત વિગત સાથે)'],
          ['completed', 'The activity was completed as approved', 'પ્રવૃત્તિ મંજૂરી મુજબ પૂર્ણ થઈ'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'compulsoryOnPortal', type: 'single',
        en: 'Can a UC be made compulsory for every grant on the portal?',
        gu: 'પોર્ટલ પર દરેક ગ્રાન્ટ માટે UC ફરજિયાત કરી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  {
    id: 'B9.3', section: 'B9', blocking: true,
    en: 'Who must sign and certify the UC?',
    gu: 'UC પર કોણે સહી કરી પ્રમાણિત કરવું પડે?',
    parts: [
      { key: 'signatory', type: 'single',
        en: 'Applicant-side signatory (depends on who the applicant is)',
        gu: 'અરજદાર-પક્ષે સહી કરનાર (અરજદાર કોણ છે તેના પર આધાર)',
        opts: [
          ['individual', 'The individual applicant (self-certified)', 'વ્યક્તિગત અરજદાર પોતે (સ્વ-પ્રમાણિત)'],
          ['leader',     'Group / troupe leader', 'જૂથ / મંડળીના આગેવાન'],
          ['head',       'Head of institution / organisation', 'સંસ્થા / સંગઠનના વડા'],
          ['officeBearer','Authorised office-bearer', 'અધિકૃત હોદ્દેદાર'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'caSign', type: 'single',
        en: 'Is a Chartered Accountant / auditor counter-signature required?',
        gu: 'ચાર્ટર્ડ એકાઉન્ટન્ટ (CA) / ઓડિટરની પ્રતિ-સહી જરૂરી છે?',
        opts: [
          ['always',   'Yes, always', 'હા, હંમેશા'],
          ['aboveAmt', 'Yes, only above a certain amount', 'હા, ફક્ત અમુક રકમથી વધુ હોય ત્યારે', 'above ₹', '₹ થી વધુ'],
          ['no',       'No', 'ના']
        ]},
      { key: 'officerSign', type: 'single',
        en: 'Does a government officer also certify / counter-sign the UC?',
        gu: 'કોઈ સરકારી અધિકારી પણ UC પ્રમાણિત કરે / પ્રતિ-સહી કરે છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'who (AD / district officer / …)', 'કોણ (મદદનીશ નિયામક / જિલ્લા અધિકારી / …)'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'B9.4', section: 'B9', blocking: true,
    en: 'By when must the bills / UC be submitted after the activity/event is completed?',
    gu: 'પ્રવૃત્તિ/કાર્યક્રમ પૂર્ણ થયા પછી બિલ / UC ક્યાં સુધીમાં રજૂ કરવા પડે?',
    parts: [
      { key: 'hasLimit', type: 'single',
        en: 'Is there a prescribed time limit?',
        gu: 'નિયત સમયમર્યાદા છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No — no fixed limit today', 'ના — આજે કોઈ નિશ્ચિત મર્યાદા નથી']
        ]},
      { key: 'limit', type: 'single',
        en: 'If yes, what is the limit?',
        gu: 'હોય તો, મર્યાદા શું?',
        opts: [
          ['days',      'Within ____ days of completion', 'પૂર્ણ થયાના ____ દિવસમાં', 'how many days', 'કેટલા દિવસ'],
          ['months',    'Within ____ months of the grant order', 'ગ્રાન્ટ ઓર્ડરના ____ મહિનામાં', 'how many months', 'કેટલા મહિના'],
          ['financial', 'By 31 March / within the financial year', '31 માર્ચ સુધીમાં / નાણાકીય વર્ષમાં'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'extendable', type: 'single',
        en: 'Can it be extended?',
        gu: 'મુદત વધારી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા', 'who approves', 'કોણ મંજૂર કરે'],
          ['no',  'No', 'ના']
        ]},
      { key: 'enforced', type: 'single',
        en: 'Is the deadline enforced in practice today?',
        gu: 'આજે વ્યવહારમાં આ મુદત પળાય છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No / rarely', 'ના / ભાગ્યે જ']
        ]}
    ]
  },

  {
    id: 'B9.5', section: 'B9', blocking: false,
    en: 'How are bills / UC submitted today — and can this scheme accept online submission instead?',
    gu: 'આજે બિલ / UC કેવી રીતે રજૂ થાય છે — અને આ યોજનામાં તેના બદલે ઓનલાઈન રજૂઆત સ્વીકાર્ય છે?',
    parts: [
      { key: 'submittedToday', type: 'multi',
        en: 'Submitted today',
        gu: 'આજે રજૂઆત',
        opts: [
          ['district', 'In person at the district office', 'જિલ્લા કચેરીએ રૂબરૂ'],
          ['state',    'In person at the State office', 'રાજ્ય કચેરીએ રૂબરૂ'],
          ['post',     'By post', 'ટપાલથી'],
          ['online',   'Already online', 'પહેલેથી ઓનલાઈન', 'where', 'ક્યાં'],
          ['email',    'Email', 'ઈમેલ']
        ]},
      { key: 'onlineOk', type: 'single',
        en: 'Would online submission (scanned upload) be acceptable for this scheme?',
        gu: 'આ યોજના માટે ઓનલાઈન રજૂઆત (સ્કેન કરેલ અપલોડ) સ્વીકાર્ય થશે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]},
      { key: 'originals', type: 'single',
        en: 'Even with online upload, must the physical originals still be produced?',
        gu: 'ઓનલાઈન અપલોડ છતાં, મૂળ (ઓરિજિનલ) દસ્તાવેજ રૂબરૂ આપવા પડે?',
        opts: [
          ['yes',      'Yes — for audit / records', 'હા — ઓડિટ / રેકોર્ડ માટે'],
          ['onAsk',    'Only if specifically asked', 'ફક્ત ખાસ માંગવામાં આવે ત્યારે'],
          ['no',       'No — scanned copies suffice', 'ના — સ્કેન કરેલ નકલ પૂરતી']
        ]}
    ]
  },

  {
    id: 'B9.6', section: 'B9', blocking: true,
    en: 'If the bills / UC are never submitted, what happens?',
    gu: 'બિલ / UC ક્યારેય રજૂ ન થાય તો શું થાય?',
    parts: [
      { key: 'consequence', type: 'multi', opts: [
        ['nothing',   'Nothing formal — no grant order issues, so no payment; the file is simply closed (the reimbursement default)',
                      'ઔપચારિક કંઈ નહીં — ગ્રાન્ટ ઓર્ડર ન નીકળે, તેથી ચૂકવણું નહીં; ફાઈલ બંધ થાય (ખર્ચ ભરપાઈ ધોરણનું મૂળભૂત)'],
        ['recovered', 'If an advance was paid, it is recovered', 'પેશગી ચૂકવી હોય તો, તે વસૂલ કરાય',
                      'how — future grant / demand notice / legal recovery', 'કેવી રીતે — ભવિષ્યની ગ્રાન્ટમાંથી / માંગણી નોટિસ / કાયદેસર વસૂલાત'],
        ['blacklist', 'The applicant is blacklisted / debarred from future schemes',
                      'અરજદારને ભવિષ્યની યોજનાઓમાંથી બ્લેકલિસ્ટ / બાકાત કરાય'],
        ['audit',     'Reported to audit / noted on record', 'ઓડિટને જાણ / રેકોર્ડ પર નોંધ'],
        ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'actuallyDone', type: 'single',
        en: 'Is any of this actually done today, or does the file just lapse without action?',
        gu: 'આજે આમાંનું ખરેખર કંઈ કરાય છે, કે ફાઈલ કંઈ કર્યા વગર જ પડી રહે?',
        opts: [
          ['acted',  'Acted on', 'પગલાં લેવાય'],
          ['lapses', 'Lapses quietly', 'ચૂપચાપ પડી રહે']
        ]}
    ]
  },

  /* ============ B10. District-run? ============ */
  {
    id: 'B10.1', section: 'B10', blocking: true,
    en: 'How much of this scheme is run at the district / field level rather than the State office?',
    gu: 'આ યોજના રાજ્ય કચેરીને બદલે કેટલા અંશે જિલ્લા / ક્ષેત્ર કક્ષાએ ચાલે છે?',
    parts: [
      { key: 'decidedWhere', type: 'single',
        en: 'Where is it decided?',
        gu: 'નિર્ણય ક્યાં થાય છે?',
        opts: [
          ['district', 'Entirely at district level (application → sanction → work order → payment all in the district; the file never reaches the State office)',
                       'સંપૂર્ણ જિલ્લા કક્ષાએ (અરજી → મંજૂરી → વર્ક ઓર્ડર → ચૂકવણું બધું જિલ્લામાં; ફાઈલ ક્યારેય રાજ્ય કચેરીએ પહોંચતી નથી)'],
          ['state',    'Entirely at the State office (no district role)', 'સંપૂર્ણ રાજ્ય કચેરીએ (જિલ્લાનો કોઈ ભાગ નહીં)'],
          ['mixed',    'Mixed', 'મિશ્ર', 'which steps at district vs State office', 'કયા તબક્કા જિલ્લાએ અને કયા રાજ્ય કચેરીએ']
        ]},
      { key: 'districtOfficer', type: 'single',
        en: 'Which office / officer runs it at the district?',
        gu: 'જિલ્લામાં કઈ કચેરી / અધિકારી ચલાવે છે?',
        opts: [
          ['dydo',      'District Youth Development Officer (DYDO)', 'જિલ્લા યુવા વિકાસ અધિકારી (DYDO)'],
          ['collector', 'District Collector / DDO', 'જિલ્લા કલેક્ટર / DDO'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'approvingAuthority', type: 'text',
        en: 'Approving authority at the district',
        gu: 'જિલ્લામાં મંજૂરી અધિકારી' },
      { key: 'howManyDistricts', type: 'single',
        en: 'How many districts run this scheme?',
        gu: 'કેટલા જિલ્લા આ યોજના ચલાવે છે?',
        opts: [
          ['all',  'All districts', 'બધા જિલ્લા'],
          ['some', 'Only some', 'ફક્ત અમુક', 'which / how many', 'કયા / કેટલા']
        ]},
      { key: 'timing', type: 'single',
        en: 'Within what timing must the district run it?',
        gu: 'જિલ્લાએ કયા સમય-બંધનમાં એ ચલાવવું પડે?',
        opts: [
          ['fixedWindow', 'The State office sets a fixed period and last date the district must open and close within',
                          'કચેરી નિયત સમયગાળો / છેલ્લી તારીખ નક્કી કરે જેમાં જિલ્લાએ ખોલી-બંધ કરવું પડે'],
          ['ownPace',     'The district sets its own timing / runs at its own pace', 'જિલ્લો પોતાનો સમય નક્કી કરે / પોતાની ગતિએ'],
          ['noRule',      'No fixed rule', 'કોઈ નિશ્ચિત નિયમ નહીં']
        ]},
      { key: 'records', type: 'multi',
        en: 'What records does the district keep, and in what form?',
        gu: 'જિલ્લો કયા સ્વરૂપે રેકોર્ડ રાખે છે?',
        opts: [
          ['register', 'Written register', 'લેખિત રજિસ્ટર'],
          ['loose',    'Loose paper files', 'છૂટી ફાઈલો / કાગળ'],
          ['computer', 'A computer system', 'કમ્પ્યુટર સિસ્ટમ', 'which', 'કઈ'],
          ['none',     'Nothing standard — each district in its own way', 'કોઈ પ્રમાણભૂત નહીં — દરેક જિલ્લો પોતાની રીતે']
        ]},
      { key: 'stateSeesApplicants', type: 'single',
        en: 'Does the State office get to see each individual applicant today?',
        gu: 'આજે રાજ્ય કચેરીને દરેક વ્યક્તિગત અરજદાર દેખાય છે?',
        opts: [
          ['yes',    'Yes — every application is visible centrally', 'હા — દરેક અરજી કેન્દ્રીય રીતે દેખાય'],
          ['no',     'No — only the district sees them', 'ના — ફક્ત જિલ્લો જ જુએ'],
          ['unsure', 'Don’t know', 'ખબર નથી']
        ]}
    ]
  },

  {
    id: 'B10.2', section: 'B10', blocking: false,
    en: 'How is each district’s share of the money fixed?',
    gu: 'દરેક જિલ્લાના ભાગની રકમ કેવી રીતે નક્કી થાય છે?',
    helpEN: 'Answer only if this scheme is run at district level.',
    helpGU: 'ફક્ત યોજના જિલ્લા કક્ષાએ ચાલતી હોય તો જ જવાબ આપો.',
    parts: [
      { key: 'basis', type: 'single', opts: [
        ['equal',       'Equal share to every district', 'દરેક જિલ્લાને સરખો ભાગ'],
        ['population',  'By population (or SC/ST population)', 'વસ્તી (કે SC/ST વસ્તી) મુજબ'],
        ['utilisation', 'By last year’s utilisation / expenditure', 'ગયા વર્ષના વપરાશ / ખર્ચ મુજબ'],
        ['demand',      'By number of applications / demand', 'અરજીઓની સંખ્યા / માંગ મુજબ'],
        ['proposal',    'On the district’s own proposal', 'જિલ્લાની પોતાની દરખાસ્ત પર'],
        ['hq',          'State office / HQ discretion', 'રાજ્ય કચેરી / મુખ્ય કચેરીની વિવેકબુદ્ધિ'],
        ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'whoFixes', type: 'single',
        en: 'Who fixes each district’s amount?',
        gu: 'દરેક જિલ્લાની રકમ કોણ નક્કી કરે?',
        opts: [
          ['hq',        'State office (HQ)', 'રાજ્ય કચેરી (મુખ્ય કચેરી)'],
          ['committee', 'Committee', 'સમિતિ'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'revisable', type: 'single',
        en: 'Is it a fixed annual amount, or can it be revised / topped up mid-year?',
        gu: 'આ રકમ વાર્ષિક નિશ્ચિત છે, કે વર્ષ દરમિયાન સુધારી / વધારી શકાય?',
        opts: [
          ['fixed',    'Fixed', 'નિશ્ચિત'],
          ['revisable','Can be revised', 'સુધારી શકાય', 'how', 'કેવી રીતે']
        ]},
      { key: 'written', type: 'single',
        en: 'Is the basis written anywhere (GR / circular)?',
        gu: 'આ ધોરણ ક્યાંય લેખિત છે (ઠરાવ / પરિપત્ર)?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'B10.3', section: 'B10', blocking: true,
    en: 'After the scheme runs, what does the district send back to the State office — named beneficiaries, or only totals?',
    gu: 'યોજના ચાલ્યા પછી જિલ્લો રાજ્ય કચેરીને શું પરત મોકલે છે — નામવાર લાભાર્થીઓ, કે ફક્ત કુલ આંકડા?',
    helpEN: 'Answer only if this scheme is run at district level.',
    helpGU: 'ફક્ત યોજના જિલ્લા કક્ષાએ ચાલતી હોય તો જ જવાબ આપો.',
    parts: [
      { key: 'comesBack', type: 'single',
        en: 'What comes back today?',
        gu: 'આજે શું પરત આવે છે?',
        opts: [
          ['namedList', 'A full named beneficiary list', 'સંપૂર્ણ નામવાર લાભાર્થી યાદી'],
          ['totals',    'Only a total amount / total count', 'ફક્ત કુલ રકમ / કુલ સંખ્યા'],
          ['billsOnly', 'Only the bills (seen at audit)', 'ફક્ત બિલ (ઓડિટ વખતે જોવાય)'],
          ['nothing',   'Nothing / no report', 'કંઈ નહીં / કોઈ અહેવાલ નહીં']
        ]},
      { key: 'listContents', type: 'multi',
        en: 'If a named list, what does it include?',
        gu: 'નામવાર યાદી હોય તો, તેમાં શું હોય?',
        opts: [
          ['name',     'Name', 'નામ'],
          ['address',  'Address', 'સરનામું'],
          ['amount',   'Amount paid', 'ચૂકવેલ રકમ'],
          ['event',    'Event / activity', 'કાર્યક્રમ / પ્રવૃત્તિ'],
          ['bank',     'Bank account', 'બેંક ખાતું'],
          ['aadhaar',  'Aadhaar / PAN', 'આધાર / પાન'],
          ['namesOnly','Nothing beyond names', 'નામ સિવાય કંઈ નહીં']
        ]},
      { key: 'form', type: 'single',
        en: 'In what form?',
        gu: 'કયા સ્વરૂપે?',
        opts: [
          ['register',  'Register', 'રજિસ્ટર'],
          ['statement', 'Written statement', 'લેખિત પત્રક'],
          ['online',    'Online', 'ઓનલાઈન', 'where', 'ક્યાં']
        ]},
      { key: 'frequency', type: 'single',
        en: 'How often?',
        gu: 'કેટલી વાર?',
        opts: [
          ['perEvent', 'Per event', 'દરેક કાર્યક્રમ દીઠ'],
          ['monthly',  'Monthly', 'માસિક'],
          ['annually', 'Annually', 'વાર્ષિક']
        ]},
      { key: 'couldEnterOnPortal', type: 'single',
        en: 'Could the district be required to enter every beneficiary on the portal?',
        gu: 'જિલ્લાને દરેક લાભાર્થી પોર્ટલ પર દાખલ કરવાનું ફરજિયાત કરી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  /* ============ B11. Officer’s own assessment ============ */
  {
    id: 'B11.1', section: 'B11', blocking: false,
    en: 'In your experience, what are the 3 biggest problems or difficulties in running this scheme?',
    gu: 'તમારા અનુભવે, આ યોજના ચલાવવામાં સૌથી મોટી 3 સમસ્યાઓ / મુશ્કેલીઓ કઈ છે?',
    /* Example list MOVED behind a link, word for word — an open question should
       open with a box to write in, not three lines of prompts. */
    helpEN: 'Your candid view — this is not attributed to you.',
    helpGU: 'તમારો નિખાલસ અભિપ્રાય — આ તમારા નામે નોંધાશે નહીં.',
    helpMoreEN: 'If it helps, problems might be about: delays · paperwork · unclear rules · fund shortage · applicant behaviour · duplication · reporting · anything else.',
    helpMoreGU: 'મદદ માટે — સમસ્યાઓ આ અંગે હોઈ શકે: વિલંબ · કાગળિયાં · અસ્પષ્ટ નિયમો · ભંડોળની અછત · અરજદારનું વર્તન · બેવડાપણું · અહેવાલ · અન્ય કંઈપણ.',
    helpMoreLabelEN: 'examples', helpMoreLabelGU: 'ઉદાહરણ',
    parts: [
      { key: 'p1', type: 'longtext', en: '1.', gu: '1.' },
      { key: 'p2', type: 'longtext', en: '2.', gu: '2.' },
      { key: 'p3', type: 'longtext', en: '3.', gu: '3.' }
    ]
  },

  {
    id: 'B11.2', section: 'B11', blocking: false,
    en: 'In your experience, where is this scheme hardest to verify — where could an ineligible applicant still receive assistance?',
    gu: 'તમારા અનુભવે, આ યોજનામાં ક્યાં ખરાઈ કરવી સૌથી અઘરી છે — ક્યાં કોઈ અરજદાર પાત્ર ન હોવા છતાં રકમ મેળવી શકે?',
    helpEN: 'This is about the scheme’s weak points, not about any person. Not attributed to you.',
    helpGU: 'આ યોજનાના નબળા મુદ્દા વિશે છે, કોઈ વ્યક્તિ વિશે નહીં. તમારા નામે નોંધાશે નહીં.',
    parts: [
      { key: 'risks', type: 'multi',
        en: 'Which of these could happen here, in your view?',
        gu: 'તમારા મતે આમાંનું શું અહીં થઈ શકે?',
        opts: [
          ['ghost',      'An event shown bigger than it was, or not held at all', 'કાર્યક્રમ હતો તેના કરતાં મોટો બતાવાય, કે થયો જ ન હોય'],
          ['newLeader',  'The same troupe / applicant applying under a different leader or name',
                         'એ જ મંડળી / અરજદાર જુદા આગેવાન કે નામે અરજી કરે'],
          ['household',  'Family / household members applying separately for the same thing',
                         'કુટુંબ / ઘરના સભ્યો એક જ વસ્તુ માટે અલગ-અલગ અરજી કરે'],
          ['doubleFund', 'The same event funded by more than one scheme', 'એ જ કાર્યક્રમને એકથી વધુ યોજનામાંથી ભંડોળ'],
          ['bills',      'Inflated or duplicated bills / vouchers', 'ફૂલાવેલ કે બેવડાં બિલ / વાઉચર'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'cannotCheck', type: 'longtext',
        en: 'What can you not check today, even if you suspect something is wrong?',
        gu: 'આજે તમે શું ચકાસી શકતા નથી, ભલે તમને શંકા હોય?' },
      { key: 'weakestStep', type: 'longtext',
        en: 'At which step is the scheme most open to misuse, and why?',
        gu: 'પ્રક્રિયાના કયા તબક્કે યોજના સૌથી વધુ ગેરરીતિ માટે ખુલ્લી છે, અને કેમ?' }
    ]
  },

  {
    id: 'B11.3', section: 'B11', blocking: false,
    en: 'If the portal could do one or two things to make running this scheme easier for you, what should they be?',
    gu: 'આ યોજના ચલાવવી તમારા માટે સહેલી બનાવવા પોર્ટલ એક-બે શું કરી શકે?',
    helpEN: 'Your view — not attributed.',
    helpGU: 'તમારો અભિપ્રાય — નામે નોંધાશે નહીં.',
    helpMoreEN: 'If it helps, it could be things like: a ready application form · automatic checking for duplicates · online bills so no one comes in person · status updates the applicant can see themselves · ready reports / lists · reminders for pending bills · fewer paper copies · anything else.',
    helpMoreGU: 'મદદ માટે — આ જેવું હોઈ શકે: તૈયાર અરજી ફોર્મ · બેવડી અરજીની આપોઆપ તપાસ · ઓનલાઈન બિલ જેથી કોઈને રૂબરૂ ન આવવું પડે · અરજદાર પોતે જોઈ શકે તેવા સ્ટેટસ અપડેટ · તૈયાર અહેવાલ / યાદી · બાકી બિલ માટે રિમાઇન્ડર · ઓછી કાગળની નકલ · અન્ય કંઈપણ.',
    helpMoreLabelEN: 'examples', helpMoreLabelGU: 'ઉદાહરણ',
    parts: [
      { key: 'w1', type: 'longtext', en: '1.', gu: '1.' },
      { key: 'w2', type: 'longtext', en: '2.', gu: '2.' }
    ]
  },

  {
    id: 'B11.4', section: 'B11', blocking: false,
    en: 'Is there anything the portal should NOT do — something that could get in the way of your work, or block genuine cases?',
    gu: 'પોર્ટલે એવું શું ન કરવું જોઈએ — જે તમારા કામમાં અડચણ કરે કે સાચા કેસ અટકાવે?',
    helpEN: 'Your honest view — not attributed.',
    helpGU: 'તમારો પ્રામાણિક અભિપ્રાય — નામે નોંધાશે નહીં.',
    helpMoreEN: 'For example: steps that would slow down payments · rules so rigid that genuine applicants get blocked · extra data entry with no staff to do it · trouble where internet / staff are limited (districts) · removing flexibility you need for special cases · anything else.',
    helpMoreGU: 'દા.ત.: ચૂકવણું ધીમું કરે તેવા તબક્કા · એટલા કડક નિયમ કે સાચા અરજદાર અટકી જાય · સ્ટાફ વગર વધારાની ડેટા એન્ટ્રી · જ્યાં ઇન્ટરનેટ / સ્ટાફ મર્યાદિત હોય (જિલ્લા) ત્યાં મુશ્કેલી · ખાસ કેસ માટે જરૂરી છૂટ છીનવી લે · અન્ય કંઈપણ.',
    helpMoreLabelEN: 'examples', helpMoreLabelGU: 'ઉદાહરણ',
    parts: [
      { key: 'n1', type: 'longtext', en: '1.', gu: '1.' },
      { key: 'n2', type: 'longtext', en: '2.', gu: '2.' }
    ]
  }

  ]
};
