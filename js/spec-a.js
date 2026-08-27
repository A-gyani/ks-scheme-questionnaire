/*
 * spec-a.js — PART A (universal questionnaire), 25 questions.
 *
 * Transcribed from `Scheme Questionnaire.md`, Part A, which is LOCKED. Do not
 * reword a question here: the wording was agreed question by question with the
 * department, in both languages. Fix the instrument first, then mirror it here.
 *
 * Part A is answered ONCE PER BODY (Commissionerate / Lalit Kala Akademi /
 * Sangeet Natak Akademi), so nothing here may name a single body. Sections A4,
 * A5 and A9 were dissolved into Part B and are deliberately absent; the numbers
 * A1, A2, A3, A6, A7, A8, A10 are kept as they are what the department knows.
 *
 * ⛔ NO PRE-FILLED ANSWERS. 19 questions used to carry a `prefill` — our own
 * guess from the GR and the pipeline interview, drawn above the answer box.
 * Removed 2026-08-25 on the user's instruction: the exercise is to find out
 * what officers actually do, and an answer already on the page is an answer
 * suggested. The research itself is kept in `Portal/Pipeline - As Is.md`.
 * Do not add the field back without the user saying so.
 *
 * SHAPE
 *   question = { id, section, blocking, en, gu, helpEN, helpGU, parts:[…] }
 *   part     = { key, type, en, gu, opts:[…], rows/cols for tables }
 *   option   = [id, English, ગુજરાતી]                  — plain option
 *              [id, English, ગુજરાતી, fillEN, fillGU]  — option with a write-in box
 *
 * TYPES
 *   multi     tick all that apply      (add star:true for the "★ most common" marker)
 *   single    choose one
 *   text      one line
 *   longtext  a paragraph
 *   table     fixed rows × columns of write-in boxes
 *
 * ANSWER KEYS (used by the audit log, so they must stay stable)
 *   A1.1.channels             value of the part
 *   A1.1.channels~news        the write-in box attached to option "news"
 *   A1.1.channels~~star       the ★ marker on a tick-list
 *   A3.2.bands~r0c1           one cell of a table
 */
window.SPEC_A = {

  sections: [
    { id: 'A1',  en: 'Publicity & opening the application period',
                 gu: 'પ્રસિદ્ધિ અને અરજી-તબક્કો શરૂ કરવો' },
    { id: 'A2',  en: 'Inward, acknowledgement & application status',
                 gu: 'આવક, પહોંચ અને અરજીની સ્થિતિ' },
    { id: 'A3',  en: 'The approval chain',
                 gu: 'મંજૂરી-શૃંખલા' },
    { id: 'A6',  en: 'Audit — the check before payment',
                 gu: 'ઓડિટ — ચૂકવણી પહેલાંની ચકાસણી' },
    { id: 'A7',  en: 'Reporting to Government & compliance',
                 gu: 'ઉપલી કક્ષાએ અહેવાલ અને પાલન' },
    { id: 'A8',  en: 'Records & duplicate detection as practised today',
                 gu: 'હાલની રેકોર્ડ-પદ્ધતિ અને બેવડી અરજી શોધવાની રીત' },
    { id: 'A10', en: 'Rules on assistance from more than one scheme',
                 gu: 'એકથી વધુ યોજનામાંથી સહાય અને બેવડા ભંડોળના નિયમો' }
  ],

  questions: [

  /* ================= A1. Publicity & round opening ================= */
  {
    id: 'A1.1', section: 'A1', blocking: false,
    en: 'How does a scheme currently become public once its funds are sanctioned in the budget GR?',
    gu: 'અંદાજપત્ર ઠરાવમાં યોજનાનું ભંડોળ મંજૂર થયા પછી, હાલમાં યોજના જાહેર જનતા સુધી કઈ રીતે પહોંચે છે?',
    helpEN: 'Tick every channel used today; ★ the one that actually brings in most applications.',
    helpGU: 'આજે વપરાતાં તમામ માધ્યમો પર ✔ કરો; સૌથી વધુ અરજીઓ લાવતા માધ્યમ પર ★ કરો.',
    parts: [
      { key: 'channels', type: 'multi', star: true, opts: [
        ['news',    'Newspaper advertisement', 'છાપામાં જાહેરાત', 'which papers', 'કયા છાપાં'],
        ['website', 'Department / State office website', 'વિભાગ / કચેરીની વેબસાઇટ', 'which', 'કઈ'],
        ['portal',  'State scheme portal — Digital Gujarat / MyScheme / other',
                    'રાજ્ય યોજના પોર્ટલ — ડિજિટલ ગુજરાત / MyScheme / અન્ય', 'which', 'કઈ'],
        ['social',  'Official social media', 'સત્તાવાર સોશિયલ મીડિયા', 'which', 'કયું'],
        ['letter',  'Written letter / circular to district offices only (not public)',
                    'ફક્ત જિલ્લા કચેરીઓને લેખિત પત્ર / પરિપત્ર (જાહેર નહીં)'],
        ['board',   'District / State office notice board', 'જિલ્લા / કચેરીના નોટિસ બોર્ડ પર'],
        ['none',    'No public step — only applicants already known to the office / the existing artist–institution network are informed or approached',
                    'કોઈ જાહેર પગલું નહીં — ફક્ત કચેરીને પહેલેથી ઓળખીતા અરજદારો / હાલના કલાકાર–સંસ્થા વર્તુળને જાણ કરાય/સંપર્ક કરાય છે'],
        ['other',   'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'howKnow', type: 'longtext',
        en: 'If nothing formal is issued, how do applicants actually come to know the application period has opened?',
        gu: 'જો કોઈ ઔપચારિક જાહેરાત ન થતી હોય, તો અરજી-તબક્કો શરૂ થયાની જાણ અરજદારોને ખરેખર કઈ રીતે થાય છે?' }
    ]
  },

  {
    id: 'A1.2', section: 'A1', blocking: false,
    en: 'Across all schemes, is there one fixed procedure for when applications open, or does it vary scheme to scheme?',
    gu: 'તમામ યોજનાઓમાં અરજી ક્યારે શરૂ થાય તેની એક જ નિયત પદ્ધતિ છે, કે યોજના પ્રમાણે અલગ-અલગ છે?',
    parts: [
      { key: 'model', type: 'single', opts: [
        ['standard', 'One uniform procedure for (almost) all schemes',
                     'લગભગ બધી યોજનાઓ માટે એક જ નિયત પદ્ધતિ',
                     'specify — open year-round / rolling · fixed annual dates · opened each time funds are released · ad hoc, no fixed pattern',
                     'જણાવો — આખું વર્ષ ખુલ્લી / દર વર્ષે નિયત તારીખો · ભંડોળ છૂટું થયા પછી તબક્કાવાર · કોઈ નિશ્ચિત ઢબ વગર'],
        ['varies',   'It varies scheme to scheme (each scheme’s own procedure is recorded in its own section)',
                     'યોજના પ્રમાણે અલગ-અલગ (દરેક યોજનાની પદ્ધતિ તેના પોતાના વિભાગમાં નોંધાય છે)']
      ]},
      { key: 'trigger', type: 'multi',
        en: 'Across the department, what actually starts the application period?',
        gu: 'વિભાગ-કક્ષાએ અરજીનો તબક્કો ખરેખર શેનાથી શરૂ થાય છે?',
        opts: [
          ['budgetGR',     'The budget GR itself', 'અંદાજપત્ર ઠરાવ'],
          ['fundRelease',  'A fund-release / grant order to districts', 'જિલ્લાઓને ભંડોળ-ફાળવણી / અનુદાન હુકમ'],
          ['circular',     'A circular inviting applications', 'અરજી મંગાવતો પરિપત્ર'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'districtPace', type: 'single',
        en: 'Once the State office releases funds/information, do districts then open and run applications at their own pace?',
        gu: 'કચેરી દ્વારા ભંડોળ/માહિતી છૂટી કર્યા પછી, જિલ્લાઓ પોતાની ગતિએ અરજીઓ સ્વીકારે/ચલાવે છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['varies','Varies','અલગ-અલગ']] }
    ]
  },

  {
    id: 'A1.4', section: 'A1', blocking: false,
    en: 'Who approves the application period being announced to the public, and how much time do applicants get before the deadline?',
    gu: 'અરજી-તબક્કો જાહેર કરવાની મંજૂરી કોણ આપે છે, અને છેલ્લી તારીખ પહેલાં અરજદારોને કેટલો સમય મળે છે?',
    parts: [
      { key: 'approver', type: 'single',
        en: 'Who approves that the application period can be publicly announced / opened?',
        gu: 'તબક્કો જાહેર / ખુલ્લો કરવાની મંજૂરી કોણ આપે છે?',
        opts: [
          ['ad',       'AD / branch head', 'મદદનીશ નિયામક (AD) / શાખા વડા'],
          ['osd',      'OSD', 'ઓ.એસ.ડી. (OSD)'],
          ['head',     'Head of the State office', 'રાજ્ય કચેરીના વડા'],
          ['district', 'District officer (for district-run)', 'જિલ્લા અધિકારી (જિલ્લા-કક્ષાની યોજના માટે)'],
          ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'minNotice', type: 'single',
        en: 'Is there a minimum notice period — a rule that the application period must stay open at least so many days?',
        gu: 'ઓછામાં ઓછો સૂચના સમય — તબક્કો ઓછામાં ઓછા અમુક દિવસ ખુલ્લો રાખવો પડે એવો કોઈ નિયમ છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'how many days', 'કેટલા દિવસ'],
          ['no',  'No fixed rule', 'કોઈ નિશ્ચિત નિયમ નહીં']
        ]},
      { key: 'gap', type: 'single',
        en: 'In practice, how long is the gap between announcement and the last date to apply?',
        gu: 'વ્યવહારમાં, જાહેરાત અને અરજીની છેલ્લી તારીખ વચ્ચે કેટલો સમય હોય છે?',
        opts: [
          ['u7',    'Under 7 days', '7 દિવસથી ઓછો'],
          ['7to15', '7–15 days', '7–15 દિવસ'],
          ['15to30','15–30 days', '15–30 દિવસ'],
          ['o30',   'Over 30 days', '30 દિવસથી વધુ'],
          ['varies','Varies', 'અલગ-અલગ']
        ]}
    ]
  },

  /* ============ A2. Inward, acknowledgement & tracking ============ */
  {
    id: 'A2.1', section: 'A2', blocking: false,
    en: 'Where is an application first physically received, before any processing?',
    gu: 'અરજી કોઈપણ કાર્યવાહી પહેલાં સૌપ્રથમ ક્યાં મળે છે?',
    helpEN: 'Tick all that happen; ★ the most common.',
    helpGU: 'જે થાય તે બધા પર ✔ કરો; સૌથી સામાન્ય પર ★ કરો.',
    parts: [
      { key: 'points', type: 'multi', star: true, opts: [
        ['registry', 'Central registry / inward desk of the State office', 'રાજ્ય કચેરીની મધ્યસ્થ આવક શાખા / ઇનવર્ડ ડેસ્ક'],
        ['branch',   'Directly at the concerned branch', 'સીધી સંબંધિત શાખામાં'],
        ['district', 'District / field office', 'જિલ્લા / ક્ષેત્ર કચેરીએ'],
        ['post',     'By post', 'ટપાલ મારફતે'],
        ['mlaMp',    'Through an MLA / MP reference', 'ધારાસભ્ય / સાંસદની ભલામણ મારફતે'],
        ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'stamped', type: 'single',
        en: 'Is every application stamped with a receiving number at this first point, whatever the channel?',
        gu: 'દરેક અરજીને, ગમે તે માધ્યમથી આવે, આ પ્રથમ તબક્કે જ આવક નંબર અપાય છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['some','Only some channels','ફક્ત અમુક માધ્યમ માટે']] }
    ]
  },

  {
    id: 'A2.2', section: 'A2', blocking: false,
    en: 'What does the applicant get back as proof of submission, and can they use it to track the file?',
    gu: 'અરજી જમા કરાવ્યાના પુરાવા તરીકે અરજદારને શું મળે છે, અને એનાથી તે ફાઈલ ટ્રેક કરી શકે?',
    parts: [
      { key: 'receives', type: 'multi',
        en: 'What does the applicant receive?',
        gu: 'અરજદારને શું મળે છે?',
        opts: [
          ['stampedCopy', 'A stamped receiving copy of their letter', 'પોતાના પત્રની સિક્કાવાળી આવક નકલ'],
          ['slip',        'A separate acknowledgement slip', 'અલગ પહોંચ / સ્વીકૃતિ સ્લિપ'],
          ['smsEmail',    'An SMS / email', 'SMS / ઇમેઇલ'],
          ['nothing',     'Nothing', 'કંઈ નહીં'],
          ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'uniqueNumber', type: 'single',
        en: 'Does it carry a unique number?', gu: 'એના પર અનન્ય (યુનિક) નંબર હોય છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'uniqueKind', type: 'single',
        en: 'Is that number unique to the application (traceable to this one file), or just a daily inward serial?',
        gu: 'એ નંબર અરજી માટે અનન્ય છે (આ એક જ ફાઈલ સુધી ટ્રેસ થાય), કે ફક્ત રોજની આવક ક્રમાંક?',
        opts: [
          ['unique',    'Unique to the application', 'અરજી માટે અનન્ય'],
          ['dailySerial','Daily inward serial', 'રોજની આવક ક્રમાંક'],
          ['dontKnow',  'Don’t know', 'ખબર નથી']
        ]},
      { key: 'canTrack', type: 'single',
        en: 'Can the applicant use it later to ask the status of their file?',
        gu: 'એ નંબરથી અરજદાર પછીથી પોતાની ફાઈલની સ્થિતિ પૂછી શકે?',
        opts: [
          ['yes','Yes','હા'],
          ['no', 'No — they must phone / visit to find out', 'ના — જાણવા માટે ફોન / રૂબરૂ જવું પડે']
        ]}
    ]
  },

  {
    id: 'A2.3', section: 'A2', blocking: false,
    en: 'In what system is the inward entry recorded when an application is first received?',
    gu: 'અરજી સૌપ્રથમ મળે ત્યારે આવક નોંધ કઈ સિસ્ટમમાં થાય છે?',
    helpEN: 'Tick all that are used; ★ the main one.',
    helpGU: 'જે વપરાય તે બધા પર ✔ કરો; મુખ્ય પર ★ કરો.',
    parts: [
      { key: 'systems', type: 'multi', star: true, opts: [
        ['register', 'Manual paper register (inward book)', 'હાથે લખેલ કાગળનું આવક રજિસ્ટર (ઇનવર્ડ બુક)'],
        ['excel',    'Excel / spreadsheet on a clerk’s computer', 'ક્લાર્કના કમ્પ્યુટર પર એક્સેલ / સ્પ્રેડશીટ'],
        ['eTappal',  'e-Tappal — the e-Sarkar inward (tappal) system (the application is logged as a tappal at receipt)',
                     'ઈ-ટપાલ — ઈ-સરકારની આવક (ટપાલ) સિસ્ટમ (અરજી મળતાં ટપાલ તરીકે નોંધાય)'],
        ['eFile',    'e-Sarkar e-file (a formal e-file is opened)', 'ઈ-સરકાર ઈ-ફાઈલ (ઔપચારિક ઈ-ફાઈલ ખૂલે)'],
        ['software', 'A departmental / scheme software', 'વિભાગનું / યોજનાનું સોફ્ટવેર', 'which', 'કયું'],
        ['nothing',  'Nothing recorded until later', 'ત્યારે કંઈ નોંધાતું નથી, પછીથી નોંધાય છે'],
        ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'searchable', type: 'single',
        en: 'Is this inward record centrally searchable across branches, or does each branch / clerk keep its own?',
        gu: 'આ આવક નોંધ બધી શાખાઓમાં કેન્દ્રીય રીતે શોધી શકાય છે, કે દરેક શાખા / ક્લાર્ક પોતાની અલગ રાખે છે?',
        opts: [
          ['central',  'Centrally searchable', 'કેન્દ્રીય રીતે શોધી શકાય'],
          ['separate', 'Each branch / clerk separate', 'દરેક શાખા / ક્લાર્ક અલગ'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]}
    ]
  },

  {
    id: 'A2.4', section: 'A2', blocking: true,
    en: 'At exactly what point does an application become a formal e-file in e-Sarkar?',
    gu: 'અરજી ઈ-સરકારમાં ઔપચારિક ઈ-ફાઈલ ક્યારે બને છે?',
    parts: [
      { key: 'whenOpened', type: 'single',
        en: 'When is the e-file opened?', gu: 'ઈ-ફાઈલ ક્યારે ખૂલે છે?',
        opts: [
          ['atReceipt',     'At first receipt (inward itself)', 'સૌપ્રથમ મળે ત્યારે જ (આવક વખતે)'],
          ['afterScrutiny', 'After the clerk’s initial scrutiny', 'ક્લાર્કની પ્રાથમિક ચકાસણી પછી'],
          ['afterAD',       'Only after the AD / officer decides to proceed', 'ફક્ત મદદનીશ નિયામક / અધિકારી આગળ વધવાનું નક્કી કરે તે પછી'],
          ['atSanction',    'At sanction stage', 'મંજૂરીના તબક્કે'],
          ['never',         'Never — handled on paper', 'ક્યારેય નહીં — કાગળ પર જ ચાલે'],
          ['other',         'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'paperOnlyStage', type: 'single',
        en: 'So is there a stage where an application exists only as a tappal / on paper, with no e-file yet?',
        gu: 'તો શું એવો કોઈ તબક્કો છે જ્યાં અરજી ફક્ત ટપાલ / કાગળ પર હોય, ઈ-ફાઈલ વગર?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'traceIfDropped', type: 'single',
        en: 'If yes — during that stage, if the application is dropped or rejected, does any digital trace remain?',
        gu: 'જો હા — એ તબક્કામાં અરજી પડતી મૂકાય / નામંજૂર થાય, તો કોઈ ડિજિટલ નિશાની રહે છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'coverage', type: 'single',
        en: 'Of the applications that do proceed (clear the informal in-principle approval), are all of them filed on e-Sarkar, or do some go ahead on paper, outside the system?',
        gu: 'જે અરજીઓ આગળ વધે છે (અનૌપચારિક સૈદ્ધાંતિક મંજૂરી મળી હોય), તે બધી ઈ-સરકાર પર દાખલ થાય છે, કે અમુક કાગળ પર / સિસ્ટમ બહાર આગળ ચાલે છે?',
        opts: [
          ['all',      'All on e-Sarkar', 'બધી ઈ-સરકાર પર'],
          ['some',     'Some proceed without an e-file', 'અમુક ઈ-ફાઈલ વગર આગળ ચાલે', 'which', 'કઈ'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'droppedBefore', type: 'single',
        en: 'Roughly how many applications are dropped before an e-file is ever opened?',
        gu: 'ઈ-ફાઈલ ખૂલે એ પહેલાં આશરે કેટલી અરજીઓ પડતી મૂકાય છે?',
        opts: [
          ['most','Most','મોટા ભાગની'], ['some','Some','અમુક'],
          ['few','Few','થોડી'], ['dontKnow','Don’t know','ખબર નથી']
        ]},
      { key: 'differsByScheme', type: 'single',
        en: 'Does the e-file-opening point differ for any type of scheme (e.g. small awards handled entirely on paper)?',
        gu: 'ઈ-ફાઈલ ખૂલવાનો તબક્કો કોઈ પ્રકારની યોજના માટે અલગ પડે છે? (દા.ત. નાના પુરસ્કાર ફક્ત કાગળ પર)',
        opts: [
          ['no',  'No, same for all', 'ના, બધા માટે સરખો'],
          ['yes', 'Yes', 'હા', 'which', 'કઈ']
        ]}
    ]
  },

  {
    id: 'A2.5', section: 'A2', blocking: false,
    en: 'Who decides which branch / body an application belongs to, and on what basis?',
    gu: 'અરજી કઈ શાખા / કચેરીની છે તે કોણ નક્કી કરે છે, અને શેના આધારે?',
    parts: [
      { key: 'whoAssigns', type: 'single',
        en: 'Who assigns the application to the owning branch / body?',
        gu: 'અરજી સંબંધિત શાખા / કચેરીને કોણ સોંપે છે?',
        opts: [
          ['registry',   'Central registry / inward desk', 'મધ્યસ્થ આવક શાખા / ઇનવર્ડ ડેસ્ક'],
          ['admin',      'Admin / establishment section', 'વહીવટી / મહેકમ શાખા'],
          ['branchHead', 'The branch head', 'શાખા વડા'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'basis', type: 'single',
        en: 'How is the correct branch / body decided?',
        gu: 'સાચી શાખા / કચેરી શેના આધારે નક્કી થાય છે?',
        opts: [
          ['scheme',   'By the scheme named in the application', 'અરજીમાં જણાવેલ યોજના પરથી'],
          ['activity', 'By the type of activity', 'પ્રવૃત્તિના પ્રકાર પરથી'],
          ['judgment', 'By the officer’s judgment', 'અધિકારીની સૂઝ પરથી'],
          ['other',    'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'written', type: 'single',
        en: 'Is the rule for assigning applications written anywhere, or is it by experience/custom?',
        gu: 'આ સોંપણીનો નિયમ ક્યાંય લેખિત છે, કે અનુભવ / રિવાજથી થાય છે?',
        opts: [
          ['written', 'Written', 'લેખિત', 'where', 'ક્યાં'],
          ['custom',  'Custom / experience', 'રિવાજ / અનુભવ']
        ]},
      { key: 'multiBranch', type: 'longtext',
        en: 'When a scheme could sit in more than one branch or body, who decides, and can it be sent to the wrong branch?',
        gu: 'જ્યારે કોઈ યોજના એકથી વધુ શાખા કે કચેરીમાં બંધ બેસે, ત્યારે કોણ નક્કી કરે, અને શું ખોટી શાખામાં જઈ શકે?' },
      { key: 'notOurs', type: 'single',
        en: 'If a received application doesn’t belong to this department at all, but to another office / department, what happens to it?',
        gu: 'જે અરજી આ વિભાગની કોઈ પણ શાખા/કચેરીની નહીં, પણ બીજી કચેરી / વિભાગની હોય, ત્યારે તેનું શું થાય છે?',
        opts: [
          ['fwdWith',    'Forwarded to the correct office — with intimation to the applicant', 'સાચી કચેરીને મોકલી અપાય — અરજદારને જાણ સાથે'],
          ['fwdWithout', 'Forwarded to the correct office — without intimation', 'સાચી કચેરીને મોકલી અપાય — જાણ વગર'],
          ['returned',   'Returned to the applicant with guidance', 'અરજદારને માર્ગદર્શન સાથે પરત'],
          ['lapses',     'No action / it just lapses', 'કોઈ કાર્યવાહી નહીં / પડતી મૂકાય'],
          ['dontKnow',   'Don’t know', 'ખબર નથી']
        ]}
    ]
  },

  /* ==================== A3. The approval chain ==================== */
  {
    id: 'A3.1', section: 'A3', blocking: false,
    en: 'Confirm the approval chain a file travels, in order, for this office.',
    gu: 'આ કચેરી માટે ફાઈલ કઈ મંજૂરી-શૃંખલામાંથી, કયા ક્રમે પસાર થાય છે તે જણાવો.',
    parts: [
      { key: 'chain', type: 'text',
        en: 'List, in order, the officers the file passes through — from first handling to final sanction (use → between them).',
        gu: 'ફાઈલ જે અધિકારીઓ પાસેથી ક્રમશઃ પસાર થાય તે પ્રથમ કાર્યવાહીથી અંતિમ મંજૂરી સુધી ક્રમમાં લખો (વચ્ચે → વાપરો).',
        placeholder: '____ → ____ → ____ → ____ → ____ → ____' },
      { key: 'variesByAmount', type: 'single',
        en: 'Does the chain change with the amount (small sums stop lower, large sums go higher)?',
        gu: 'રકમ પ્રમાણે શૃંખલા બદલાય છે (નાની રકમ નીચે અટકે, મોટી રકમ ઉપર જાય)?',
        opts: [
          ['yes', 'Yes — the amount decides how high it goes', 'હા — રકમ નક્કી કરે કે કેટલે ઉપર જાય'],
          ['no',  'No — same chain every time', 'ના — દર વખતે એ જ શૃંખલા']
        ]},
      { key: 'informalApproval', type: 'single',
        en: 'Before this formal chain, is there an informal in-principle approval (a nod to proceed) that isn’t part of the e-file chain?',
        gu: 'આ ઔપચારિક શૃંખલા પહેલાં, કોઈ અનૌપચારિક સૈદ્ધાંતિક મંજૂરી (આગળ વધવાની સંમતિ) હોય છે જે ઈ-ફાઈલ શૃંખલાનો ભાગ નથી?',
        opts: [
          ['yes', 'Yes', 'હા', 'who gives it', 'કોણ આપે'],
          ['no',  'No', 'ના']
        ]},
      { key: 'finalSanction', type: 'text',
        en: 'Who gives the final sanction in the usual case?',
        gu: 'સામાન્ય કિસ્સામાં અંતિમ મંજૂરી કોણ આપે છે?' }
    ]
  },

  {
    id: 'A3.2', section: 'A3', blocking: true,
    en: 'Up to what amount can each authority give final sanction? (the financial delegation limits)',
    gu: 'દરેક અધિકારી પોતાની કક્ષાએ કેટલી રકમ સુધીની અંતિમ મંજૂરી આપી શકે? (નાણાકીય સત્તા-સોંપણીની મર્યાદા)',
    helpEN: 'Fill the rupee limit each level can finally approve on its own.',
    helpGU: 'દરેક કક્ષા પોતાની રીતે જે રકમ સુધી મંજૂર કરી શકે તે ભરો.',
    parts: [
      { key: 'bands', type: 'table',
        cols: [
          { en: 'Can finally sanction up to ₹', gu: '₹ ______ સુધી અંતિમ મંજૂરી' },
          { en: 'Above that, goes to', gu: 'એથી વધુ હોય તો કોને જાય' }
        ],
        rows: [
          { en: 'AD / branch head', gu: 'મદદનીશ નિયામક / શાખા વડા' },
          { en: 'OSD / Joint–Deputy Director', gu: 'ઓ.એસ.ડી. / સંયુક્ત–નાયબ નિયામક' },
          { en: 'Head of office (Commissioner / Director / Registrar)', gu: 'કચેરી વડા (કમિશનર / નિયામક / રજિસ્ટ્રાર)' },
          { en: 'Secretary / Government', gu: 'સચિવ / સરકાર' },
          /* The Minister is the top of the chain, so there is nothing above. */
          { en: 'Minister', gu: 'મંત્રી', skipCols: [1] }
        ]},
      { key: 'natureChanges', type: 'single',
        en: 'Does the nature of the case (grant / award / event / capital) change who approves, beyond the amount?',
        gu: 'કેસના પ્રકાર (સહાય / પુરસ્કાર / કાર્યક્રમ / મૂડી) પ્રમાણે, રકમ ઉપરાંત, મંજૂરી આપનાર બદલાય છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'how', 'કેવી રીતે'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'A3.3', section: 'A3', blocking: true,
    en: 'Which order sets these financial powers? Please give its number and date, and attach a copy.',
    gu: 'આ નાણાકીય સત્તા કયા હુકમથી નક્કી થાય છે? તેનો નંબર અને તારીખ આપો, અને નકલ જોડો.',
    parts: [
      { key: 'orderRef', type: 'text',
        en: 'Name / number & date of the delegation-of-financial-powers order this office uses',
        gu: 'આ કચેરી જે નાણાકીય સત્તા-સોંપણી હુકમ વાપરે તેનું નામ / નંબર અને તારીખ' },
      { key: 'whose', type: 'single',
        en: 'Is it the department’s order, or a finance-department order the office follows?',
        gu: 'એ પોતાના વિભાગનો હુકમ છે, કે કચેરી અનુસરે તે નાણાં વિભાગનો હુકમ?',
        opts: [
          ['own',      'Own department / body', 'પોતાનો વિભાગ / સંસ્થા'],
          ['finance',  'Finance Department', 'નાણાં વિભાગ'],
          ['both',     'Both', 'બંને'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'copy', type: 'single',
        en: 'Is a copy available to attach?', gu: 'નકલ જોડી શકાય?',
        opts: [
          ['yes', 'Yes (available)', 'હા (ઉપલબ્ધ)'],
          ['no',  'No', 'ના', 'where can it be obtained', 'ક્યાંથી મળે']
        ]},
      { key: 'current', type: 'single',
        en: 'Is this the current version, or might a revised one exist?',
        gu: 'આ વર્તમાન આવૃત્તિ છે, કે સુધારેલ હોઈ શકે?',
        opts: [
          ['current', 'Current', 'વર્તમાન'],
          ['maybe',   'May be revised / not sure', 'સુધારેલ હોઈ શકે / ખાતરી નથી']
        ]}
    ]
  },

  {
    id: 'A3.4', section: 'A3', blocking: false,
    en: 'When an application comes with an MLA / MP (or other senior) reference, is it handled any differently?',
    gu: 'જ્યારે અરજી સાથે ધારાસભ્ય / સાંસદ (કે અન્ય ઉચ્ચ કક્ષા)ની ભલામણ હોય, ત્યારે તેની કાર્યવાહી કંઈ અલગ રીતે થાય છે?',
    parts: [
      { key: 'faster', type: 'single',
        en: 'Does it move faster / with priority?', gu: 'એ ઝડપથી / અગ્રતાથી આગળ વધે છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['sometimes','Sometimes','ક્યારેક']] },
      { key: 'moreLikely', type: 'single',
        en: 'Is it more likely to be approved than an ordinary application?',
        gu: 'સામાન્ય અરજી કરતાં એ મંજૂર થવાની શક્યતા વધુ હોય છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['cantSay','Can’t say','કહી ન શકાય']] },
      { key: 'docsRelaxed', type: 'single',
        en: 'Are documents ever relaxed for such a file (accepted with fewer/no papers)?',
        gu: 'આવી ફાઈલ માટે દસ્તાવેજોમાં છૂટછાટ અપાય છે (ઓછા / વગર કાગળે સ્વીકારાય)?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['sometimes','Sometimes','ક્યારેક']] },
      { key: 'recorded', type: 'single',
        en: 'Is the reference recorded on the file (e.g. tagged as an MP/MLA reference in e-Sarkar)?',
        gu: 'ભલામણ ફાઈલ પર નોંધાય છે (દા.ત. ઈ-સરકારમાં MP/MLA ભલામણ તરીકે ટૅગ)?',
        opts: [['yes','Yes','હા'], ['no','No','ના'], ['dontKnow','Don’t know','ખબર નથી']] },
      { key: 'sameChain', type: 'single',
        en: 'Does it still go through the same approval chain as any other file?',
        gu: 'એ છતાં એ બીજી ફાઈલ જેવી જ મંજૂરી-શૃંખલામાંથી પસાર થાય છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'how it differs', 'કેવી રીતે અલગ']
        ]}
    ]
  },

  {
    id: 'A3.5', section: 'A3', blocking: true,
    en: 'When an application is rejected or dropped, is the applicant informed, and is a reason given?',
    gu: 'અરજી નામંજૂર / પડતી મૂકાય ત્યારે અરજદારને જાણ કરાય છે, અને કારણ અપાય છે?',
    parts: [
      { key: 'told', type: 'single',
        en: 'Is the applicant told today?', gu: 'આજે અરજદારને જાણ કરાય છે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No — only finds out if they ask', 'ના — પૂછે તો જ ખબર પડે']
        ]},
      { key: 'stage', type: 'single',
        en: 'At which stage can a rejection / drop happen?',
        gu: 'નામંજૂરી / પડતી મૂકવાનું કયા તબક્કે થઈ શકે?',
        opts: [
          ['informal', 'Informal / in-principle stage (before e-file)', 'અનૌપચારિક / સૈદ્ધાંતિક તબક્કે (ઈ-ફાઈલ પહેલાં)'],
          ['formal',   'Formal approval stage', 'ઔપચારિક મંજૂરી તબક્કે'],
          ['both',     'Both', 'બંને']
        ]},
      { key: 'informalRecorded', type: 'single',
        en: 'When dropped at the informal stage, is it recorded anywhere, or does it vanish?',
        gu: 'અનૌપચારિક તબક્કે પડતી મૂકાય ત્યારે એ ક્યાંય નોંધાય છે, કે ગાયબ થઈ જાય?',
        opts: [
          ['recorded', 'Recorded', 'નોંધાય'],
          ['vanishes', 'Vanishes / no record', 'ગાયબ / કોઈ નોંધ નહીં']
        ]},
      { key: 'reasonGiven', type: 'single',
        en: 'Is a reason given?', gu: 'કારણ અપાય છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'portalNotify', type: 'single',
        en: 'Can the portal be required to notify every rejection, with a reason?',
        gu: 'પોર્ટલ પર દરેક નામંજૂરી, કારણ સાથે, જાણ કરવી ફરજિયાત કરી શકાય?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  /* ========= A6. Audit — the check before payment ========= */
  {
    id: 'A6.1', section: 'A6', blocking: true,
    en: 'Does every payment pass one audit / pre-audit check before money is released? Are there any exceptions at all?',
    gu: 'પૈસા છૂટા થાય તે પહેલાં દરેક ચૂકવણું એક ઓડિટ / પૂર્વ-ઓડિટ ચકાસણીમાંથી પસાર થાય છે? કોઈ પણ અપવાદ છે?',
    parts: [
      { key: 'mustClear', type: 'single',
        en: 'Before any bill is paid, must it clear the office’s audit / pre-audit stage?',
        gu: 'કોઈ પણ બિલ ચૂકવાય તે પહેલાં, એ કચેરીના ઓડિટ / પૂર્વ-ઓડિટ તબક્કામાંથી પસાર થવું જ પડે?',
        opts: [
          ['yesEvery', 'Yes, every bill', 'હા, દરેક બિલ'],
          ['no',       'No', 'ના'],
          ['some',     'Only some', 'ફક્ત અમુક']
        ]},
      { key: 'bypass', type: 'multi',
        en: 'Is any payment made without passing through audit? Tick any that can be paid without it.',
        gu: 'કંઈ પણ આ ઓડિટ તબક્કાને ટાળીને (વગર પસાર થયે) ચૂકવાય છે? જે ટાળી શકે તે પર ✔ કરો.',
        opts: [
          ['advances',  'Advances (paid before the event)', 'પેશગી (કાર્યક્રમ પહેલાં ચૂકવાતી)'],
          ['akademi',   'Payments an Akademi / body makes from its own grant-in-aid account',
                        'અકાદમી / સંસ્થા પોતાના સહાયક અનુદાન ખાતામાંથી કરે તે ચૂકવણાં'],
          ['district',  'Payments made directly at the district / district treasury (not centrally audited)',
                        'સીધા જિલ્લા કક્ષાએ / જિલ્લા તિજોરીથી થતાં ચૂકવણાં (કેન્દ્રીય ઓડિટ વગર)'],
          ['lowValue',  'Small / low-value payments below a threshold', 'નિયત મર્યાદાથી નીચેનાં નાનાં / ઓછી રકમનાં ચૂકવણાં', 'threshold ₹', 'મર્યાદા ₹'],
          ['fastTrack', 'MLA / MP-referenced or otherwise fast-tracked cases', 'ધારાસભ્ય / સાંસદ-ભલામણ કે અન્ય ઝડપી કેસ'],
          ['none',      'Nothing bypasses — every payment is audited', 'કંઈ જ ટાળતું નથી — દરેક ચૂકવણું ઓડિટ થાય છે'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'whoRuns', type: 'text',
        en: 'Who runs this audit check, and at what stage does it sit (before the grant order / before treasury / before the cheque)?',
        gu: 'આ ઓડિટ ચકાસણી કોણ કરે છે, અને એ કયા તબક્કે હોય છે (અનુદાન હુકમ પહેલાં / તિજોરી પહેલાં / ચેક પહેલાં)?' },
      { key: 'systemOrPaper', type: 'single',
        en: 'Is the audit stage on e-Sarkar / a system, or on paper?',
        gu: 'ઓડિટ તબક્કો ઈ-સરકાર / સિસ્ટમ પર છે, કે કાગળ પર?',
        opts: [['system','System','સિસ્ટમ'], ['paper','Paper','કાગળ'], ['mixed','Mixed','મિશ્ર']] },
      { key: 'canBlock', type: 'single',
        en: 'If a duplicate or ineligible payment were caught here, could this stage actually stop the payment?',
        gu: 'જો કોઈ બેવડું કે અપાત્ર ચૂકવણું અહીં પકડાય, તો આ તબક્કો ખરેખર ચૂકવણું અટકાવી શકે?',
        opts: [
          ['canBlock',  'Yes — it can block release', 'હા — છૂટા થતાં અટકાવી શકે'],
          ['objectOnly','No — it can only object after the fact', 'ના — ફક્ત પછીથી વાંધો કાઢી શકે']
        ]}
    ]
  },

  {
    id: 'A6.2', section: 'A6', blocking: false,
    en: 'Beyond the office’s own audit, does any external audit examine these payments?',
    gu: 'કચેરીના પોતાના ઓડિટ ઉપરાંત, આ ચૂકવણાંની કોઈ બાહ્ય ઓડિટ તપાસ થાય છે?',
    helpEN: 'Tick all that apply.', helpGU: 'જે લાગુ પડે તે બધા પર ✔ કરો.',
    parts: [
      { key: 'external', type: 'multi', opts: [
        ['ag',        'Accountant General (AG) audit', 'મહાલેખાકાર (AG) ઓડિટ'],
        ['localFund', 'Local Fund Audit', 'સ્થાનિક ભંડોળ ઓડિટ (Local Fund Audit)'],
        ['statutory', 'Statutory / chartered-accountant audit of the body’s accounts (typical for an Akademi / autonomous body)',
                      'સંસ્થાના હિસાબોનું વૈધાનિક / ચાર્ટર્ડ એકાઉન્ટન્ટ ઓડિટ (અકાદમી / સ્વાયત્ત સંસ્થા માટે સામાન્ય)'],
        ['internal',  'Internal government audit party (department / Finance)', 'આંતરિક સરકારી ઓડિટ પક્ષ (વિભાગ / નાણાં)'],
        ['noneKnown', 'None that we know of', 'અમારી જાણમાં કોઈ નહીં'],
        ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
      ]},
      { key: 'frequency', type: 'single',
        en: 'How often does it happen?', gu: 'એ કેટલી વાર થાય છે?',
        opts: [['yearly','Yearly','દર વર્ષે'], ['occasional','Occasionally','ક્યારેક'], ['dontKnow','Don’t know','ખબર નથી']] },
      { key: 'onObjection', type: 'longtext',
        en: 'When it raises an objection on a grant, what typically happens?',
        gu: 'જ્યારે એ કોઈ સહાય પર વાંધો ઉઠાવે, ત્યારે સામાન્ય રીતે શું થાય છે?' }
    ]
  },

  {
    id: 'A6.3', section: 'A6', blocking: true,
    en: 'The GR (condition 12) requires social audit + third-party verification to be done periodically and the result submitted to Government. Is this actually happening?',
    gu: 'ઠરાવ (શરત 12) મુજબ સામાજિક ઓડિટ + ત્રાહિત-પક્ષ ચકાસણી સમયાંતરે કરવી અને પરિણામ સરકારને રજૂ કરવું જરૂરી છે. શું આ ખરેખર થાય છે?',
    parts: [
      { key: 'done', type: 'single',
        en: 'Is any social audit / third-party verification of these grants carried out periodically, as the condition requires?',
        gu: 'આ સહાયોની સામાજિક ઓડિટ કે ત્રાહિત-પક્ષ ચકાસણી શરત મુજબ સમયાંતરે કરવામાં આવે છે?',
        opts: [
          ['regularly','Yes, regularly','હા, નિયમિત'],
          ['rarely',   'Once / rarely','એકાદ વાર / ભાગ્યે જ'],
          ['never',    'Never','ક્યારેય નહીં'],
          ['dontKnow', 'Don’t know','ખબર નથી']
        ]},
      { key: 'whoAndWhich', type: 'text',
        en: 'If yes: who carries it out, and for which schemes / years?',
        gu: 'જો હા: કોણ કરે છે, અને કઈ યોજનાઓ / વર્ષો માટે?' },
      { key: 'submitted', type: 'single',
        en: 'Is a report of it submitted to Government (as the condition requires)?',
        gu: 'એનો અહેવાલ સરકારને રજૂ કરવામાં આવે છે (શરત મુજબ)?',
        opts: [
          ['yes', 'Yes', 'હા', 'how often', 'કેટલી વાર'],
          ['no',  'No', 'ના']
        ]},
      { key: 'reportOnRecord', type: 'single',
        en: 'Is any such written report on record that we could see?',
        gu: 'આવો કોઈ લેખિત અહેવાલ રેકોર્ડ પર છે જે અમે જોઈ શકીએ?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]},
      { key: 'whyNot', type: 'single',
        en: 'If it isn’t done, why?', gu: 'જો ન થતું હોય, તો કેમ?',
        opts: [
          ['noAgency',    'No agency assigned', 'કોઈ એજન્સી નિયુક્ત નથી'],
          ['noProcedure', 'No procedure set', 'કોઈ પદ્ધતિ નક્કી નથી'],
          ['notRequired', 'Not required in practice', 'વ્યવહારમાં જરૂરી નથી'],
          ['other',       'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'portalSupport', type: 'single',
        en: 'Could the portal support this — e.g. publish beneficiary lists for public / social audit, or flag files for third-party check?',
        gu: 'પોર્ટલ આમાં મદદ કરી શકે — દા.ત. જાહેર / સામાજિક ઓડિટ માટે લાભાર્થી યાદી પ્રસિદ્ધ કરવી, કે ત્રાહિત-પક્ષ ચકાસણી માટે ફાઈલ ચિહ્નિત કરવી?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No', 'ના', 'why', 'કેમ']
        ]}
    ]
  },

  /* ============ A7. Upward reporting & compliance ============ */
  {
    id: 'A7.1', section: 'A7', blocking: true,
    en: 'Is the department set up on the State DBT Portal at all, and who runs that? (GR condition 30)',
    gu: 'વિભાગ રાજ્ય DBT પોર્ટલ પર બિલકુલ નોંધાયેલ છે, અને એ કોણ સંભાળે છે? (ઠરાવ શરત 30)',
    helpEN: 'Per-scheme registration status and scheme codes are recorded scheme-by-scheme; here we need only the office-level picture.',
    helpGU: 'દરેક યોજનાની નોંધણી-સ્થિતિ અને સ્કીમ કોડ યોજનાવાર અલગ નોંધાય છે; અહીં ફક્ત કચેરી-કક્ષાનું ચિત્ર જોઈએ.',
    parts: [
      { key: 'onboarded', type: 'single',
        en: 'Is the department / office registered on the State DBT Portal?',
        gu: 'વિભાગ / કચેરી રાજ્ય DBT પોર્ટલ પર જોડાયેલ છે?',
        opts: [
          ['yes','Yes','હા'], ['no','No','ના'],
          ['partly','Partly / in progress','આંશિક / પ્રક્રિયામાં'],
          ['dontKnow','Don’t know','ખબર નથી']
        ]},
      { key: 'nodal', type: 'single',
        en: 'Is there a DBT nodal officer / cell responsible for it?',
        gu: 'એ માટે કોઈ DBT નોડલ અધિકારી / કક્ષ જવાબદાર છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'who', 'કોણ'],
          ['no',  'No', 'ના']
        ]},
      { key: 'registeredCount', type: 'text',
        en: 'Roughly how many schemes are registered on DBT?',
        gu: 'આશરે કેટલી યોજનાઓ DBT પર નોંધાયેલ છે?' },
      { key: 'pendingCount', type: 'text',
        en: 'And how many are still pending?', gu: 'અને કેટલી બાકી છે?' },
      { key: 'flowing', type: 'single',
        en: 'Is financial assistance actually flowing through DBT today (cond. 29), or is DBT registration only on paper?',
        gu: 'આજે નાણાકીય સહાય ખરેખર DBT મારફતે ચૂકવાય છે (શરત 29), કે DBT નોંધણી ફક્ત કાગળ પર છે?',
        opts: [
          ['flowing',  'Flowing through DBT', 'DBT મારફતે ચૂકવાય'],
          ['paperOnly','Paper-only / not really used', 'ફક્ત કાગળ પર / ખરેખર વપરાતું નથી'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]}
    ]
  },

  {
    id: 'A7.2', section: 'A7', blocking: true,
    en: 'Is any scheme’s data sent to the CM Dashboard today? (GR condition 14)',
    gu: 'આજે કોઈ યોજનાનો ડેટા CM ડેશબોર્ડમાં જાય છે? (ઠરાવ શરત 14)',
    parts: [
      { key: 'reports', type: 'single',
        en: 'Does any scheme currently report to the CM Dashboard?',
        gu: 'હાલમાં કોઈ યોજના CM ડેશબોર્ડ પર માહિતી આપે છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'which', 'કઈ'],
          ['no',  'No', 'ના'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'how', type: 'single',
        en: 'If yes, how is the data put in?', gu: 'જો હા, તો ડેટા કેવી રીતે ભરાય છે?',
        opts: [
          ['typed',    'Typed in / entered by hand', 'હાથે ટાઇપ / દાખલ કરાય'],
          ['uploaded', 'Uploaded from a file', 'ફાઈલમાંથી અપલોડ'],
          ['auto',     'Automatic system feed', 'આપોઆપ સિસ્ટમ ફીડ'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'what', type: 'multi',
        en: 'What is reported?', gu: 'શું અહેવાલ અપાય છે?',
        opts: [
          ['money',        'Money spent', 'ખર્ચેલ રકમ'],
          ['beneficiaries','Number of beneficiaries', 'લાભાર્થીઓની સંખ્યા'],
          ['events',       'Events held', 'યોજાયેલ કાર્યક્રમો'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો'],
          ['nothing',      'Nothing structured', 'કંઈ માળખાગત નહીં']
        ]},
      { key: 'whoFreq', type: 'text',
        en: 'Who is responsible for updating it, and how often?',
        gu: 'એ અપડેટ કરવાની જવાબદારી કોની, અને કેટલી વાર?' },
      { key: 'ifNot', type: 'single',
        en: 'If nothing is sent today, is it because there is no structured data to send?',
        gu: 'જો આજે કંઈ મોકલાતું ન હોય, તો શું એ કારણે કે મોકલવા માટે કોઈ માળખાગત ડેટા જ નથી?',
        opts: [
          ['noSource', 'Yes — no source data', 'હા — કોઈ સ્રોત ડેટા નથી'],
          ['other',    'Other reason', 'અન્ય કારણ', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'A7.3', section: 'A7', blocking: false,
    en: 'Beyond DBT and the CM Dashboard, does beneficiary or payment data get uploaded into any central or online system today?',
    gu: 'DBT અને CM ડેશબોર્ડ ઉપરાંત, આજે લાભાર્થી કે ચૂકવણી માહિતી કોઈ કેન્દ્રીય કે ઓનલાઇન સિસ્ટમમાં અપલોડ થાય છે?',
    parts: [
      { key: 'lands', type: 'single',
        en: 'Does beneficiary / payment data land in any central system?',
        gu: 'લાભાર્થી / ચૂકવણી માહિતી કોઈ કેન્દ્રીય સિસ્ટમમાં જાય છે?',
        opts: [
          ['yes',      'Yes', 'હા'],
          ['no',       'No — it stays within the branch', 'ના — શાખામાં જ રહે છે'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'which', type: 'multi',
        en: 'If yes, which?', gu: 'જો હા, તો કઈ?',
        opts: [
          ['schemePortal', 'A scheme-specific portal', 'યોજના-વિશિષ્ટ પોર્ટલ', 'which', 'કઈ'],
          ['ifmsPfms',     'IFMS / PFMS / treasury system', 'IFMS / PFMS / તિજોરી સિસ્ટમ'],
          ['deptMIS',      'A department MIS / website', 'વિભાગનું MIS / વેબસાઇટ'],
          ['sharedSheet',  'A shared spreadsheet / drive', 'શેર કરેલ સ્પ્રેડશીટ / ડ્રાઇવ'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'contains', type: 'multi',
        en: 'What does it contain?', gu: 'એમાં શું હોય છે?',
        opts: [
          ['names',     'Names', 'નામ'],
          ['amounts',   'Amounts', 'રકમ'],
          ['bank',      'Bank details', 'બેંક વિગત'],
          ['event',     'Event details', 'કાર્યક્રમ વિગત'],
          ['onlyTotals','Only totals', 'ફક્ત કુલ આંકડા'],
          ['dontKnow',  'Don’t know', 'ખબર નથી']
        ]},
      { key: 'oneTime', type: 'single',
        en: 'Is it a one-time upload or kept updated?',
        gu: 'એ એક વખતનું અપલોડ છે કે અપડેટ થતું રહે છે?',
        opts: [
          ['oneTime', 'One-time', 'એક વખતનું'],
          ['updated', 'Updated', 'અપડેટ થાય', 'how often', 'કેટલી વાર']
        ]},
      { key: 'onlyBranch', type: 'single',
        en: 'If nothing central exists, is beneficiary data effectively held only in each branch’s own files?',
        gu: 'જો કંઈ કેન્દ્રીય ન હોય, તો શું લાભાર્થી માહિતી ફક્ત દરેક શાખાની પોતાની ફાઈલોમાં જ રહે છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] }
    ]
  },

  /* ====== A8. Records & duplicate detection as practised today ====== */
  {
    id: 'A8.1', section: 'A8', blocking: true,
    en: 'Where is the record of every past sanction and grant order kept, and is there any register that spans all branches?',
    gu: 'દરેક ભૂતકાળની મંજૂરી અને અનુદાન હુકમનો રેકોર્ડ ક્યાં રખાય છે, અને બધી શાખાઓને આવરી લેતું કોઈ રજિસ્ટર છે?',
    parts: [
      { key: 'where', type: 'multi',
        en: 'Where are past sanctions / grant orders kept?',
        gu: 'ભૂતકાળની મંજૂરીઓ / અનુદાન હુકમો ક્યાં રખાય છે?',
        opts: [
          ['branchFiles',    'In each branch’s own files', 'દરેક શાખાની પોતાની ફાઈલોમાં'],
          ['dealingClerk',   'With the dealing clerk', 'સંબંધિત કારકુન પાસે'],
          ['branchRegister', 'A branch register', 'શાખાના રજિસ્ટરમાં'],
          ['centralRegistry','A central registry', 'મધ્યસ્થ રજિસ્ટ્રીમાં'],
          ['other',          'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'form', type: 'multi',
        en: 'In what form?', gu: 'કયા સ્વરૂપે?',
        opts: [
          ['paper',    'Paper files', 'કાગળની ફાઈલો'],
          ['excel',    'Excel / spreadsheet', 'એક્સેલ / સ્પ્રેડશીટ'],
          ['eFiles',   'e-Sarkar e-files', 'ઈ-સરકાર ઈ-ફાઈલ'],
          ['database', 'A database / software', 'ડેટાબેઝ / સોફ્ટવેર'],
          ['mixed',    'Mixed / varies by clerk', 'મિશ્ર / કારકુન પ્રમાણે અલગ']
        ]},
      { key: 'singleRegister', type: 'single',
        en: 'Is there any single register that lists sanctions across all branches / bodies?',
        gu: 'બધી શાખાઓ / સંસ્થાઓની મંજૂરીઓ યાદી કરતું કોઈ એક જ રજિસ્ટર છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No — each keeps its own', 'ના — દરેક પોતાનું રાખે છે']
        ]},
      { key: 'uniform', type: 'single',
        en: 'Are the formats uniform across branches, or does each keep records its own way?',
        gu: 'શું બધી શાખાઓમાં સ્વરૂપ એકસમાન છે, કે દરેક પોતાની રીતે રાખે છે?',
        opts: [
          ['uniform', 'Uniform', 'એકસમાન'],
          ['varies',  'Varies branch to branch / clerk to clerk', 'શાખા-થી-શાખા / કારકુન પ્રમાણે અલગ']
        ]},
      { key: 'yearsAvailable', type: 'text',
        en: 'For how many past years are these records readily available?',
        gu: 'આ રેકોર્ડ કેટલા ભૂતકાળના વર્ષો માટે સહેલાઈથી ઉપલબ્ધ છે?' }
    ]
  },

  {
    id: 'A8.2', section: 'A8', blocking: true,
    en: 'Before sanctioning, can an officer see what another branch — or another body — has already sanctioned to the same applicant or event? By what means?',
    gu: 'મંજૂરી આપતાં પહેલાં, અધિકારી જોઈ શકે કે એ જ અરજદાર કે કાર્યક્રમને બીજી શાખા — કે બીજી સંસ્થા — એ પહેલેથી શું મંજૂર કર્યું છે? કઈ રીતે?',
    parts: [
      { key: 'withinOffice', type: 'single',
        en: 'Across branches / sections within your own office, can one officer see another’s sanctions?',
        gu: 'તમારી પોતાની કચેરીની શાખાઓ / વિભાગો વચ્ચે, એક અધિકારી બીજાની મંજૂરીઓ જોઈ શકે?',
        opts: [
          ['yes',      'Yes', 'હા', 'how', 'કઈ રીતે'],
          ['no',       'No', 'ના'],
          ['informal', 'Only by informally asking', 'ફક્ત અનૌપચારિક પૂછીને']
        ]},
      { key: 'crossBody', type: 'single',
        en: 'From your office, is there any way to check whether another body (a different Akademi / the Commissionerate) has already funded the same applicant or event?',
        gu: 'તમારી કચેરીમાંથી, એ જ અરજદાર કે કાર્યક્રમને બીજી સંસ્થા (અન્ય અકાદમી / કમિશનરેટ) એ પહેલેથી સહાય આપી છે કે નહીં તે તપાસવાની કોઈ રીત છે?',
        opts: [
          ['yes',      'Yes', 'હા', 'how', 'કઈ રીતે'],
          ['no',       'No — no way to know', 'ના — જાણવાની કોઈ રીત નથી'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'sharedSystem', type: 'single',
        en: 'Is there any shared system or list you can consult for this?',
        gu: 'આ માટે તમે જોઈ શકો એવી કોઈ સહિયારી સિસ્ટમ કે યાદી છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'which', 'કઈ'],
          ['no',  'No', 'ના']
        ]},
      { key: 'howNoticed', type: 'multi',
        en: 'In practice today, how is a possible duplicate noticed?',
        gu: 'આજે વ્યવહારમાં, સંભવિત બેવડી અરજી કઈ રીતે ધ્યાનમાં આવે છે?',
        opts: [
          ['informalAsk',  'One officer informally asks another', 'એક અધિકારી બીજાને અનૌપચારિક પૂછે'],
          ['alreadyKnown', 'The applicant is already known', 'અરજદાર પહેલેથી ઓળખીતો હોય'],
          ['notNoticed',   'It isn’t noticed', 'ધ્યાનમાં આવતું જ નથી'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'dependsOnOfficer', type: 'single',
        en: 'Does whether a check happens depend on the individual officer?',
        gu: 'ચકાસણી થાય કે નહીં એ વ્યક્તિગત અધિકારી પર આધારિત છે?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] }
    ]
  },

  {
    id: 'A8.4', section: 'A8', blocking: false,
    en: 'Has a double-funded event or applicant ever come to light? What was the pattern, and what happened next?',
    gu: 'એ જ અરજદાર કે કાર્યક્રમને બે વાર સહાય મળી હોય એવો કિસ્સો ક્યારેય ધ્યાનમાં આવ્યો છે? શું ઢબ હતી, અને પછી શું થયું?',
    parts: [
      { key: 'everCameToLight', type: 'single',
        en: 'Has a case of the same applicant/event being funded twice ever come to light?',
        gu: 'એ જ અરજદાર/કાર્યક્રમને બે વાર સહાય મળ્યાનો કિસ્સો ક્યારેય ધ્યાનમાં આવ્યો છે?',
        opts: [
          ['yes',       'Yes', 'હા'],
          ['no',        'No', 'ના'],
          ['suspected', 'Suspected but never confirmed', 'શંકા હતી પણ ખાતરી ન થઈ']
        ]},
      { key: 'howCameToLight', type: 'multi',
        en: 'How did it come to light?', gu: 'એ કઈ રીતે ધ્યાનમાં આવ્યો?',
        opts: [
          ['officer',      'An officer noticed', 'અધિકારીએ નોંધ્યું'],
          ['audit',        'At audit', 'ઓડિટ વખતે'],
          ['complaint',    'A complaint', 'ફરિયાદથી'],
          ['alreadyKnown', 'The applicant was already known', 'અરજદાર પહેલેથી ઓળખીતો'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'pattern', type: 'multi',
        en: 'What pattern was seen?', gu: 'કઈ ઢબ જોવા મળી?',
        opts: [
          ['diffLeader',   'Same troupe / group applying under a different leader', 'એ જ મંડળી / જૂથ જુદા આગેવાન હેઠળ અરજી કરે'],
          ['family',       'Family / household members applying separately', 'કુટુંબ / ઘરના સભ્યો અલગ-અલગ અરજી કરે'],
          ['twoSchemes',   'Same event funded under two schemes', 'એ જ કાર્યક્રમ બે યોજનાઓ હેઠળ'],
          ['twoBranches',  'Same applicant, two branches / bodies', 'એ જ અરજદાર, બે શાખા / સંસ્થા'],
          ['other',        'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'whatHappened', type: 'multi',
        en: 'What happened then?', gu: 'પછી શું થયું?',
        opts: [
          ['dropped',    'Quietly dropped', 'ચૂપચાપ પડતું મૂક્યું'],
          ['oneRefused', 'One grant refused', 'એક સહાય નામંજૂર'],
          ['recovered',  'Money recovered', 'પૈસા વસૂલ'],
          ['blacklisted','Applicant blacklisted', 'અરજદાર બ્લેકલિસ્ટ'],
          ['nothing',    'Nothing', 'કંઈ નહીં'],
          ['other',      'Other', 'અન્ય', 'specify', 'જણાવો']
        ]},
      { key: 'recorded', type: 'single',
        en: 'Was the case recorded anywhere?', gu: 'એ કિસ્સો ક્યાંય નોંધાયો હતો?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]}
    ]
  },

  {
    id: 'A8.5', section: 'A8', blocking: true,
    en: 'Can the past few years’ beneficiary lists be obtained and assembled across all branches / bodies, to start the portal’s records?',
    gu: 'પોર્ટલ શરૂ કરવા માટે, છેલ્લા થોડા વર્ષોની લાભાર્થી યાદીઓ બધી શાખાઓ / સંસ્થાઓમાંથી મેળવીને એકઠી કરી શકાય?',
    parts: [
      { key: 'canPull', type: 'single',
        en: 'Can beneficiary lists for the last 3 years be compiled?',
        gu: 'છેલ્લા 3 વર્ષની લાભાર્થી યાદીઓ એકઠી કરી શકાય?',
        opts: [
          ['fully',  'Yes, fully', 'હા, સંપૂર્ણ'],
          ['partly', 'Partly', 'આંશિક', 'which years / branches', 'કયા વર્ષ / શાખા'],
          ['no',     'No', 'ના']
        ]},
      { key: 'form', type: 'multi',
        en: 'In what form do they exist?', gu: 'એ કયા સ્વરૂપે છે?',
        opts: [
          ['paper',    'Paper only', 'ફક્ત કાગળ'],
          ['excel',    'Excel / spreadsheets', 'એક્સેલ / સ્પ્રેડશીટ'],
          ['eSarkar',  'e-Sarkar / files', 'ઈ-સરકાર / ફાઈલો'],
          ['mixed',    'Mixed', 'મિશ્ર'],
          ['dontKnow', 'Don’t know', 'ખબર નથી']
        ]},
      { key: 'fields', type: 'multi',
        en: 'What fields would the lists reliably contain?',
        gu: 'યાદીઓમાં કયા ક્ષેત્રો ભરોસાપાત્ર રીતે હોય?',
        opts: [
          ['name',    'Name', 'નામ'],
          ['address', 'Address', 'સરનામું'],
          ['phone',   'Phone', 'ફોન'],
          ['scheme',  'Scheme', 'યોજના'],
          ['amount',  'Amount', 'રકમ'],
          ['event',   'Event', 'કાર્યક્રમ'],
          ['bankId',  'Bank / ID', 'બેંક / ID'],
          ['onlyNameAmount', 'Only names & amounts', 'ફક્ત નામ અને રકમ'],
          ['dontKnow','Don’t know', 'ખબર નથી']
        ]},
      { key: 'perBranchCompile', type: 'single',
        en: 'Would assembling them need each branch / body to compile separately?',
        gu: 'એ એકઠી કરવા દરેક શાખા / સંસ્થાએ અલગથી તૈયાર કરવી પડે?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No — one place has them all', 'ના — એક જ જગ્યાએ બધી છે']
        ]},
      { key: 'howFarBack', type: 'text',
        en: 'Roughly how far back is data realistically retrievable?',
        gu: 'આશરે કેટલા વર્ષ પાછળનો ડેટા ખરેખર મેળવી શકાય?' }
    ]
  },

  /* ========== A10. Overlap & double-funding rules ========== */
  {
    id: 'A10.1', section: 'A10', blocking: true,
    en: 'Is it allowed to draw grants from two schemes for the SAME event?',
    gu: 'એક જ કાર્યક્રમ માટે બે યોજનામાંથી સહાય લેવી માન્ય છે?',
    helpEN: 'Distinguish: co-funding different cost components (one scheme pays the artists, another the stage) vs double-paying the same cost.',
    helpGU: 'ભેદ પાડો: અલગ ખર્ચ-ઘટકો માટે (એક યોજના કલાકારનો, બીજી મંચનો ખર્ચ) સહ-ભંડોળ, વિરુદ્ધ એ જ ખર્ચ બે વાર ચૂકવવો.',
    parts: [
      { key: 'rule', type: 'single', opts: [
        ['coFunding',  'Co-funding different costs is allowed', 'અલગ ખર્ચ માટે સહ-ભંડોળ માન્ય'],
        ['prohibited', 'Any second grant for the same event is prohibited', 'એ જ કાર્યક્રમ માટે બીજી કોઈ સહાય પ્રતિબંધિત'],
        ['noRule',     'No clear rule', 'કોઈ સ્પષ્ટ નિયમ નહીં']
      ]},
      { key: 'whereWritten', type: 'multi',
        en: 'Where is this rule written?', gu: 'આ નિયમ ક્યાં લખેલ છે?',
        opts: [
          ['gr',        'A GR / condition', 'ઠરાવ / શરત', 'which', 'કઈ'],
          ['propriety', 'Only general financial-propriety rules (e.g. GR cond. 4, 5)', 'ફક્ત સામાન્ય નાણાકીય-ઔચિત્યના નિયમો (દા.ત. ઠરાવ શરત 4, 5)'],
          ['notWritten','Not written — understood practice', 'ક્યાંય લખેલ નથી — સમજણ મુજબની પ્રથા']
        ]},
      { key: 'copyAttachable', type: 'single',
        en: 'Copy attachable?', gu: 'નકલ જોડી શકાય?',
        opts: [['yes','Yes','હા'], ['no','No','ના']] },
      { key: 'ceiling', type: 'single',
        en: 'If co-funding different costs is allowed: is there a ceiling on the total assistance one event can receive across all schemes?',
        gu: 'જો અલગ ખર્ચ માટે સહ-ભંડોળ માન્ય હોય: એક કાર્યક્રમને બધી યોજનાઓ મળીને કુલ કેટલી સહાય મળી શકે તેની મર્યાદા છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'the ceiling', 'મર્યાદા'],
          ['no',  'No', 'ના']
        ]},
      { key: 'whoDecides', type: 'single',
        en: 'Who decides whether a second grant is legitimate co-funding vs a prohibited double-payment?',
        gu: 'બીજી સહાય માન્ય સહ-ભંડોળ છે કે પ્રતિબંધિત બેવડી-ચૂકવણી, એ કોણ નક્કી કરે?',
        opts: [
          ['officer',   'The sanctioning officer', 'મંજૂરી આપનાર અધિકારી'],
          ['committee', 'A committee', 'સમિતિ'],
          ['noOne',     'No one checks today', 'આજે કોઈ તપાસતું નથી'],
          ['other',     'Other', 'અન્ય', 'specify', 'જણાવો']
        ]}
    ]
  },

  {
    id: 'A10.3', section: 'A10', blocking: true,
    en: 'Can an applicant funded under an SC/ST (caste-earmarked) budget head ALSO draw from the general head for the SAME activity?',
    gu: 'SC/ST (જ્ઞાતિ-આધારિત) સદર હેઠળ સહાય પામનાર અરજદાર એ જ પ્રવૃત્તિ માટે સામાન્ય સદરમાંથી પણ સહાય લઈ શકે?',
    helpEN: 'The same activity often exists in both a general version and an SC/ST version — e.g. the same camp under head 98 and head 95/96.',
    helpGU: 'એક જ પ્રવૃત્તિ ઘણી વાર સામાન્ય અને SC/ST — બંને સ્વરૂપે હોય છે — દા.ત. એ જ શિબિર સદર 98 અને સદર 95/96 હેઠળ.',
    parts: [
      { key: 'allowed', type: 'single', opts: [
        ['yes',        'Yes, allowed', 'હા, માન્ય'],
        ['prohibited', 'No, prohibited', 'ના, પ્રતિબંધિત'],
        ['noRule',     'No rule either way', 'કોઈ નિયમ નહીં']
      ]},
      { key: 'writtenWhere', type: 'single',
        en: 'If prohibited, is the rule written anywhere?',
        gu: 'પ્રતિબંધિત હોય તો, નિયમ ક્યાંય લખેલ છે?',
        opts: [
          ['yes', 'Yes', 'હા', 'where', 'ક્યાં'],
          ['no',  'No', 'ના']
        ]},
      { key: 'canCheck', type: 'single',
        en: 'Can anyone actually check this today (the two heads are handled by the same officer / branch)?',
        gu: 'આજે આ ખરેખર કોઈ તપાસી શકે (બંને સદર એક જ અધિકારી / શાખા સંભાળે છે)?',
        opts: [
          ['yes', 'Yes', 'હા'],
          ['no',  'No — different heads, no cross-check', 'ના — જુદાં સદર, કોઈ ક્રોસ-ચેક નહીં']
        ]}
    ]
  }

  ]
};
