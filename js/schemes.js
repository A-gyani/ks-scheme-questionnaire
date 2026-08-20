/*
 * schemes.js — every scheme of all three bodies, for the Part B picker.
 *
 * SOURCES (all in Portal/Schemes/):
 *   1. "Schemes 2026-27 GR 04.05.2026.pdf" — the budget GR. ALL TEN PATRAKS,
 *      102 line items, Rs 145.37 crore. Pure scan with no text layer, so every
 *      line was read from a 170-dpi render of pages 7-14.
 *   2. "DocScanner 30-Jul-2026 2-54 pm.pdf" — Lalit Kala Akademi GR
 *      SYCAD/GLA/e-file/19/2025/1106/F. 13 items, Rs 2.31 crore. Also a scan.
 *   3. "યોજના  2026-27.pdf" — Sangeet Natak Akademi list, 51 items. It HAS a
 *      text layer but the Gujarati conjuncts in it are corrupted (it renders
 *      "શાસ્ રીય" for "શાસ્ત્રીય"), so the names were read from a render too.
 *      That list carries no per-item allocation, so allocationCr is absent.
 *
 * VERIFIED AT TRANSCRIPTION: the figures summed to each Patrak's own printed
 * total and to the GR's grand total of Rs 145.37 crore, and Lalit Kala's to
 * Rs 2.31 crore — checked against the documents rather than trusted.
 *
 * EXCLUDED SINCE: the four Gujarat State Yoga Board lines of Patrak-3 have been
 * REMOVED on instruction — the Yoga Board is a separate entity, so no officer of
 * these three bodies would be answering a questionnaire about them:
 *     P3-19 development of yoga activity (grant)      Rs 16.49 cr
 *     P3-21 public yoga studios                       Rs  6.37 cr
 *     P3-22 outsourced services, Yoga Board office    Rs  2.00 cr
 *     P3-25 Yoga Board pay and allowances             Rs 11.53 cr
 * That is Rs 36.39 crore, so THIS FILE NO LONGER SUMS TO THE GR TOTAL, by
 * design. Patrak-3 here is Rs 9.45 crore against the GR's Rs 45.84 crore.
 * The Youth Board's own yoga schemes REMAIN in scope: World Yoga Day at
 * district (P3-17) and State (P3-18) level, and the yoga award and competition
 * (P3-20), plus every yogasan training camp across Patraks 3, 7 and 9.
 *
 * PATRAKS 8 AND 10 ARE COMMISSIONERATE, NOT AKADEMI. Their budget heads read
 * "ART-04 — Sangeet Natak Akademi's cultural activities", so the money is voted
 * against the Akademi head, but the Commissionerate actually runs the schemes
 * (confirmed by the user). Body follows who runs it, because that decides which
 * officer is asked to fill the questionnaire — not which head the money sits in.
 *
 * Gujarati names are transcribed from the source and are what an officer will
 * recognise. English names are working translations for the bilingual UI — they
 * are NOT from the GR, so correct them freely.
 *
 * FIELDS
 *   patrak       which table of the budget GR the line came from (absent for the
 *                Akademis' own lists)
 *   budgetHead   demand-major-minor-sub head, e.g. 98-2205-00-102-08 ART-08
 *   branch       Commissionerate only. Patraks 2/3/4/6/7/9 take the branch that
 *                runs them, which the GR states outright. Patrak-5 is split
 *                across Culture and Celebration, which the GR does NOT state —
 *                those carry branchGuess:true and an admin must confirm them.
 *   admin        an establishment / salary / advertising / corpus line, not a
 *                scheme anyone applies to. Nobody should be asked 58 questions
 *                about an advertising budget, so these are flagged for the
 *                tagging screen to hide.
 */
window.SCHEMES = [
  {
    "id": "P5-01",
    "patrak": 5,
    "no": 1,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "કલા મહાકુંભ",
    "nameEN": "Kala Mahakumbh",
    "allocationCr": 15,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-02",
    "patrak": 5,
    "no": 2,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "ગુજરાતનાં પવિત્ર યાત્રાધામો ખાતે ઉત્સવો (સોમનાથ, દ્વારકા, ડાકોર, શુક્લતીર્થ, અંબાજી, શામળાજી, ઉનાઈ, ચોટીલા, ખોડીયાર, રાણકી વાવ, માતૃવંદના ઉત્સવ દરમિયાન સાંસ્કૃતિક કાર્યક્રમ અંગે)",
    "nameEN": "Festivals at Gujarat's holy pilgrimage sites (Somnath, Dwarka, Dakor, Shuklatirth, Ambaji, Shamlaji, Unai, Chotila, Khodiyar, Rani ki Vav, Matruvandana)",
    "allocationCr": 6.6,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-03",
    "patrak": 5,
    "no": 3,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "નવરાત્રી પર્વ",
    "nameEN": "Navratri Parva",
    "allocationCr": 4.45,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-04",
    "patrak": 5,
    "no": 4,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "પર્યટન પર્વ",
    "nameEN": "Paryatan Parva (tourism festival)",
    "allocationCr": 2.98,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-05",
    "patrak": 5,
    "no": 5,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્યમાં તથા અન્ય રાજ્યમાં વિશિષ્ટ સાંસ્કૃતિક કાર્યક્રમનું આયોજન",
    "nameEN": "Special cultural programmes in the State and in other States",
    "allocationCr": 3.13,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-06",
    "patrak": 5,
    "no": 6,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "દેશ વિદેશના મહાનુભાવોની રાજ્યની મુલાકાત દરમિયાન સાંસ્કૃતિક કાર્યક્રમોનું આયોજન કરવા બાબત.",
    "nameEN": "Cultural programmes during visits of dignitaries from India and abroad",
    "allocationCr": 3.13,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-07",
    "patrak": 5,
    "no": 7,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "પરંપરાગત લોક સંસ્કૃતિ, કલા વારસો અંગેના કાર્યક્રમો",
    "nameEN": "Programmes on traditional folk culture and art heritage",
    "allocationCr": 2.31,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-08",
    "patrak": 5,
    "no": 8,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "નેશનલ ડે સેલીબ્રેશન એન્ડ સ્ટેટ ફંક્શન",
    "nameEN": "National Day celebrations and State functions",
    "allocationCr": 1.99,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-09",
    "patrak": 5,
    "no": 9,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "માધવપુર ઘેડના મેળામાં સાંસ્કૃતિક કાર્યક્રમ",
    "nameEN": "Cultural programmes at the Madhavpur Ghed fair",
    "allocationCr": 3.13,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-10",
    "patrak": 5,
    "no": 10,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "સંસ્કૃતિકુંજ ખાતે વસંતોત્સવ",
    "nameEN": "Vasantotsav at Sanskritikunj",
    "allocationCr": 2.04,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-11",
    "patrak": 5,
    "no": 11,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "ગુજરાતમાં આયોજિત વિવિધ મેળાઓ દરમિયાન વિવિધ સ્પર્ધાઓ અને મલ્ટીમીડિયા સાંસ્કૃતિક કાર્યક્રમનું આયોજન",
    "nameEN": "Competitions and multimedia cultural programmes during fairs held in Gujarat",
    "allocationCr": 1.56,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-12",
    "patrak": 5,
    "no": 12,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "ઉતરાર્ધ ઉત્સવ",
    "nameEN": "Uttarardh Mahotsav",
    "allocationCr": 1.25,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-13",
    "patrak": 5,
    "no": 13,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "વર્ષ દરમિયાન આયોજિત વિવિધ સાંસ્કૃતિક કાર્યક્રમોની ડોક્યુમેન્ટેશન બનાવવી અને માર્કેટીંગ બાબત (નવી બાબત વર્ષ ૨૦૨૪-૨૫)",
    "nameEN": "Documentation and marketing of cultural programmes held during the year (new item 2024-25)",
    "allocationCr": 0.78,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-14",
    "patrak": 5,
    "no": 14,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "લોકડાયરાના કાર્યક્રમો",
    "nameEN": "Lok Dayro programmes",
    "allocationCr": 0.75,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-15",
    "patrak": 5,
    "no": 15,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "સમરસતા દિન (૧૪ એપ્રિલ)",
    "nameEN": "Samarasata Din (14 April)",
    "allocationCr": 0.65,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-16",
    "patrak": 5,
    "no": 16,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્યમાં જુદા જુદા સ્થળોએ સાંસ્કૃતિક કાર્યક્રમો શનિવાર અને રવિવારના દિવસે યોજવા બાબત.",
    "nameEN": "Cultural programmes at various places in the State on Saturdays and Sundays",
    "allocationCr": 0.65,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-17",
    "patrak": 5,
    "no": 17,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્ય બાળ પ્રતિભા સ્પર્ધા યોજવા બાબત",
    "nameEN": "State children's talent competition",
    "allocationCr": 0.63,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-18",
    "patrak": 5,
    "no": 18,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "કેવડીયા કાર્નિવલ",
    "nameEN": "Kevadia Carnival",
    "allocationCr": 0.48,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-19",
    "patrak": 5,
    "no": 19,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "એક ભારત શ્રેષ્ઠ ભારત",
    "nameEN": "Ek Bharat Shreshtha Bharat",
    "allocationCr": 0.38,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-20",
    "patrak": 5,
    "no": 20,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "કલાસીકલ મ્યુઝીક ફેસ્ટીવલ",
    "nameEN": "Classical Music Festival",
    "allocationCr": 0.25,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-21",
    "patrak": 5,
    "no": 21,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "થિયેટર ફેસ્ટીવલ",
    "nameEN": "Theatre Festival",
    "allocationCr": 0.25,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-22",
    "patrak": 5,
    "no": 22,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્યના બહુરૂપી નટબજાણીયા અને ભવાઇ સમુદાયોના સર્વાંગી વિકાસ માટેની યોજના",
    "nameEN": "Scheme for the all-round development of Bahurupi, Natbajaniya and Bhavai communities",
    "allocationCr": 0.31,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-23",
    "patrak": 5,
    "no": 23,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "ગુજરાતના અંધ અને બહેરાં/મુંગા વિર્ધાર્થીઓ માટે સંગીત નૃત્ય તાલીમ શિબિર.",
    "nameEN": "Music and dance training camps for blind and deaf/mute students of Gujarat",
    "allocationCr": 0.23,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-24",
    "patrak": 5,
    "no": 24,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "ઉમંગ ફેસ્ટીવલ",
    "nameEN": "Umang Festival",
    "allocationCr": 0.29,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-25",
    "patrak": 5,
    "no": 25,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "સાગરખેડુ વિસ્તારમાં સાંસ્કૃતિક કાર્યક્રમ",
    "nameEN": "Cultural programmes in the Sagarkhedu (coastal) area",
    "allocationCr": 0.1,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-26",
    "patrak": 5,
    "no": 26,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "વ્યવસાયી નાટ્ય મંડળીઓને સહાય",
    "nameEN": "Assistance to professional theatre groups",
    "allocationCr": 0.11,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-27",
    "patrak": 5,
    "no": 27,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "ચિલ્ડ્રન એકટીવીટીઝ",
    "nameEN": "Children's activities",
    "allocationCr": 0.07,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-28",
    "patrak": 5,
    "no": 28,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "ગુજરાત એક સાંસ્કૃતિક અભિવ્યકિત",
    "nameEN": "Gujarat — a cultural expression",
    "allocationCr": 0.08,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-29",
    "patrak": 5,
    "no": 29,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "આદિકવિ નરસિંહ મહેતાની જન્મ જયંતિ ઉજવણી",
    "nameEN": "Birth anniversary celebration of Adikavi Narsinh Mehta",
    "allocationCr": 0.08,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-30",
    "patrak": 5,
    "no": 30,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "સ્ટેટ મેરીટ એવોર્ડ",
    "nameEN": "State Merit Award",
    "allocationCr": 0.01,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-31",
    "patrak": 5,
    "no": 31,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "સંસ્કૃતિ કુંજ પ્રતિષ્ઠાન કોર્પસ ફંડ",
    "nameEN": "Sanskriti Kunj Pratishthan corpus fund",
    "allocationCr": 0.01,
    "budgetHead": "98-2205-00-102-08 ART-08",
    "admin": true
  },
  {
    "id": "P5-32",
    "patrak": 5,
    "no": 32,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજકોટ ખાતેના થિયેટરને મહેકમ",
    "nameEN": "Establishment for the theatre at Rajkot",
    "allocationCr": 0.01,
    "budgetHead": "98-2205-00-102-08 ART-08",
    "admin": true
  },
  {
    "id": "P5-33",
    "patrak": 5,
    "no": 33,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "નિ:સહાય કલાકારોને આર્થિક સહાય (૩૧૩૫-ગ્રાંટ ઇન એડ)(સી-૪)",
    "nameEN": "Financial assistance to destitute artists (3135 grant-in-aid)",
    "allocationCr": 0.2,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-34",
    "patrak": 5,
    "no": 34,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "હેમતીર્થ સ્મારકના સાર સંભાળ અને સંસ્કૃતિ વિષયક કામગીરી માટે પ્રોત્સાહન માટે (૩૧૩૫)(સી-૪)",
    "nameEN": "Upkeep of the Hemtirth memorial and encouragement of cultural work (3135)",
    "allocationCr": 0.09,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-35",
    "patrak": 5,
    "no": 35,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "હેમુ ગઢવી નાટ્યગૃહ, રાજકોટના રીનોવેશન બાબત (૩૧૩૫)(સી-૪)",
    "nameEN": "Renovation of Hemu Gadhvi Natyagruh, Rajkot (3135)",
    "allocationCr": 0.01,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-36",
    "patrak": 5,
    "no": 36,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "જાહેર ખબર અને જાહેરાત ખર્ચ(૨૬૦૦-પ્રકાશન)(સી-૩)",
    "nameEN": "Publicity and advertisement expenditure (2600 publication)",
    "allocationCr": 0.66,
    "budgetHead": "98-2205-00-102-08 ART-08",
    "admin": true
  },
  {
    "id": "P5-37",
    "patrak": 5,
    "no": 37,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્યમાં યોજવામાં આવતા વિવિધ સાંસ્કૃતિક કાર્યક્રમો માટે આર્થિક સહાય આપવા બાબત (૩૧૩૫)",
    "nameEN": "Financial assistance for various cultural programmes held in the State (3135)",
    "allocationCr": 5,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-38",
    "patrak": 5,
    "no": 38,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "હર ઘર તિરંગા અભિયાનના પ્રચાર-પ્રસાર, તિરંગા ખરીદી અને સમગ્ર ગુજરાતમાં હર ઘર તિરંગા આધારિત વિવિધ સાંસ્કૃતિક કાર્યક્રમનું આયોજન કરવા બાબત",
    "nameEN": "Har Ghar Tiranga campaign — publicity, purchase of flags and cultural programmes across Gujarat",
    "allocationCr": 13,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-39",
    "patrak": 5,
    "no": 39,
    "body": "commissionerate",
    "branch": "culture",
    "branchGuess": true,
    "nameGU": "રાજ્યમાં “કલા મહોત્સવ” નું આયોજન કરવા બાબત",
    "nameEN": "Kala Mahotsav in the State",
    "allocationCr": 9.35,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P5-40",
    "patrak": 5,
    "no": 40,
    "body": "commissionerate",
    "branch": "celebration",
    "branchGuess": true,
    "nameGU": "લોક સંસ્કૃતિની ધરોહર એવા લોકમેળાઓને પુન:જીવિત કરવા બાબત",
    "nameEN": "Reviving folk fairs as the heritage of folk culture",
    "allocationCr": 5,
    "budgetHead": "98-2205-00-102-08 ART-08"
  },
  {
    "id": "P1-01",
    "patrak": 1,
    "no": 1,
    "body": "commissionerate",
    "nameGU": "કમિશનરશ્રી, યુવક સેવા અને સાંસ્કૃતિક પ્રવૃત્તિઓની કચેરી ખાતે કાયદા સલાહકારની નવી જગ્યા આઉટસોર્સથી ભરવાની મળેલ વહીવટી મંજૂરી અન્વયે ચાલુ રાખવા બાબત",
    "nameEN": "Continuation of the outsourced legal adviser post at the Commissionerate",
    "allocationCr": 0.07,
    "budgetHead": "98-2204-00-001-01",
    "admin": true
  },
  {
    "id": "P2-01",
    "patrak": 2,
    "no": 1,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "સ્ટેટ માઉન્ટીનીરીંગ એવોર્ડ",
    "nameEN": "State Mountaineering Award",
    "allocationCr": 0.02,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-02",
    "patrak": 2,
    "no": 2,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "માનદ ઇન્સ્ટ્રકટરોને પુરસ્કાર",
    "nameEN": "Award to honorary instructors",
    "allocationCr": 0.12,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-03",
    "patrak": 2,
    "no": 3,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "માઉન્ટ આબુ તથા જુનાગઢ પર્વતારોહણ કેન્દ્રો સંગીન બનાવવા",
    "nameEN": "Strengthening the Mount Abu and Junagadh mountaineering centres",
    "allocationCr": 0.3,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-04",
    "patrak": 2,
    "no": 4,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "માઉન્ટ એવરેસ્ટ સર કરનારને સહાય",
    "nameEN": "Assistance to those who summit Mount Everest",
    "allocationCr": 0.15,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-05",
    "patrak": 2,
    "no": 5,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "ગીરનારના દુર્ગમ પહાડો ઉપર રાષ્ટ્રીય ખડક ચઢાણ કોર્ષનું આયોજન",
    "nameEN": "National rock-climbing course on the Girnar hills",
    "allocationCr": 0.06,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-06",
    "patrak": 2,
    "no": 6,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "રાજ્ય પર્વતારોહણ સંસ્થા /કેન્દ્રનું રીસર્ફેસીંગ અને આધુનિકરણ",
    "nameEN": "Resurfacing and modernisation of the State mountaineering institute / centre",
    "allocationCr": 0.45,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-07",
    "patrak": 2,
    "no": 7,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "વિશિષ્ટ પ્રકારના સાહસિક એક્સ્પીડીશન કે એક્સ્પ્લોરેશન માટે સહાય આપવા અને મંજુરી આપવા બાબત.",
    "nameEN": "Assistance and permission for special adventure expeditions or explorations",
    "allocationCr": 0.01,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-08",
    "patrak": 2,
    "no": 8,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "જમીન, પર્વત તથા દરીયાઈ એડવેન્ચર સ્પોર્ટસ માટે આર્થિક સહાય",
    "nameEN": "Financial assistance for land, mountain and marine adventure sports",
    "allocationCr": 0.4,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-09",
    "patrak": 2,
    "no": 9,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "ગુજરાતમાં સાહસિક પ્રવૃત્તિઓ માટે પ્રોત્સાહન આપવા બાબત.",
    "nameEN": "Encouragement of adventure activities in Gujarat",
    "allocationCr": 0.5,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-10",
    "patrak": 2,
    "no": 10,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "રાજ્યના સાહસિકો માટે પર્વતારોહણ સંસ્થા/કેન્દ્ર/પેટા કેન્દ્ર ઉભા કરવા બાબત.(નવી બાબત ૨૦૨૪-૨૫)",
    "nameEN": "Setting up mountaineering institutes / centres / sub-centres for the State's adventurers (new item 2024-25)",
    "allocationCr": 0.5,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P2-11",
    "patrak": 2,
    "no": 11,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "સ્વામી વિવેકાનંદ પર્વતારોહણ તાલીમ સંસ્થા, માઉન્ટ આબુ તથા પંડિત દિનદયાળ ઉપાધ્યાય પર્વતારોહણ કેન્દ્ર, જુનાગઢ ની કામગીરી આઉટસોર્સીંગ દ્વારા કરવા અંગે (૩૦૦૧-આઉટસોર્સીંગ સેવાઓ)(મેનપાવર)",
    "nameEN": "Outsourcing the running of the Swami Vivekanand mountaineering institute, Mount Abu and the Pandit Deendayal Upadhyay mountaineering centre, Junagadh (manpower)",
    "allocationCr": 0.5,
    "budgetHead": "98-2204-00-103-01 ART-17",
    "admin": true
  },
  {
    "id": "P2-12",
    "patrak": 2,
    "no": 12,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "જાહેરાત ખર્ચ",
    "nameEN": "Advertisement expenditure",
    "allocationCr": 0.03,
    "budgetHead": "98-2204-00-103-01 ART-17",
    "admin": true
  },
  {
    "id": "P2-13",
    "patrak": 2,
    "no": 13,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "પ્રકાશન",
    "nameEN": "Publication",
    "allocationCr": 0.03,
    "budgetHead": "98-2204-00-103-01 ART-17",
    "admin": true
  },
  {
    "id": "P2-14",
    "patrak": 2,
    "no": 14,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "મેઇન્ટેનન્સ ઓફ એમ્બ્યુલન્સ વાન એન્ડ રેમ્યુનરેશન ઓફ ડ્રાઇવર",
    "nameEN": "Maintenance of ambulance van and driver's remuneration",
    "allocationCr": 0.01,
    "budgetHead": "98-2204-00-103-01 ART-17",
    "admin": true
  },
  {
    "id": "P2-15",
    "patrak": 2,
    "no": 15,
    "body": "commissionerate",
    "branch": "adventure",
    "nameGU": "ઇન્સ્યોરન્સ ફોર પાર્ટીસીપેશન ઓફ એડવેન્ચર સ્કીમ",
    "nameEN": "Insurance for participation in the adventure scheme",
    "allocationCr": 0.08,
    "budgetHead": "98-2204-00-103-01 ART-17"
  },
  {
    "id": "P3-01",
    "patrak": 3,
    "no": 1,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જિલ્લા કક્ષા યોગાસન તાલીમ શિબિર",
    "nameEN": "District-level yogasan training camp",
    "allocationCr": 0.35,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-02",
    "patrak": 3,
    "no": 2,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જિલ્લા કક્ષા યુવક નેતૃત્વ તાલીમ શિબિર",
    "nameEN": "District-level youth leadership training camp",
    "allocationCr": 0.35,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-03",
    "patrak": 3,
    "no": 3,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "સાગરકાંઠા વિસ્તાર પરિભ્રમણ",
    "nameEN": "Coastal area tour",
    "allocationCr": 0.08,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-04",
    "patrak": 3,
    "no": 4,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "વન વિસ્તાર પરિભ્રમણ",
    "nameEN": "Forest area tour",
    "allocationCr": 0.08,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-05",
    "patrak": 3,
    "no": 5,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "સ્ટેટ યુથ એવોર્ડ",
    "nameEN": "State Youth Award",
    "allocationCr": 0.01,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-06",
    "patrak": 3,
    "no": 6,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "ખાસ યુવા કાર્યક્રમ",
    "nameEN": "Special youth programme",
    "allocationCr": 0.01,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-07",
    "patrak": 3,
    "no": 7,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "સાગરખેડૂ સાયકલ રેલી",
    "nameEN": "Sagarkhedu cycle rally",
    "allocationCr": 0.26,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-08",
    "patrak": 3,
    "no": 8,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "૮ થી ૧૩ વર્ષના બાળકો (સામાન્ય) માટે એડવેન્ચર કોર્ષ",
    "nameEN": "Adventure course for children aged 8 to 13 (general)",
    "allocationCr": 0.05,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-09",
    "patrak": 3,
    "no": 9,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "યુથ, સ્પોર્ટ્સ, કલ્ચરલને લગતાં લેકચર સીરીઝ તથા શિબિર",
    "nameEN": "Lecture series and camps on youth, sports and culture",
    "allocationCr": 0.07,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-10",
    "patrak": 3,
    "no": 10,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "મહિલા ઇન્ટર સ્ટેટ યુથ એક્સચેન્જ પ્રોગ્રામ",
    "nameEN": "Women's inter-state youth exchange programme",
    "allocationCr": 0.1,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-11",
    "patrak": 3,
    "no": 11,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જનરલ ઇન્ટર સ્ટેટ યુથ એક્સચેન્જ પ્રોગ્રામ",
    "nameEN": "General inter-state youth exchange programme",
    "allocationCr": 0.1,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-12",
    "patrak": 3,
    "no": 12,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "પ્રી નેશનલ યુથ ફેસ્ટીવલ ટ્રેનીંગ કેમ્પ",
    "nameEN": "Pre-National Youth Festival training camp",
    "allocationCr": 0.1,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-13",
    "patrak": 3,
    "no": 13,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "ગીરનાર આરોહણ-અવરોહણ સ્પર્ધા (રાજ્ય કક્ષા)",
    "nameEN": "Girnar ascent-descent competition (State level)",
    "allocationCr": 0.3,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-14",
    "patrak": 3,
    "no": 14,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અખિલ ભારત ગીરનાર આરોહણ-અવરોહણ સ્પર્ધા(રાષ્ટ્ર કક્ષા)",
    "nameEN": "All-India Girnar ascent-descent competition (national level)",
    "allocationCr": 0.5,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-15",
    "patrak": 3,
    "no": 15,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "ગુજરાતના પર્વતો પર આરોહણ અવરોહણ સ્પર્ધાઓ યોજવા બાબત.",
    "nameEN": "Ascent-descent competitions on Gujarat's mountains",
    "allocationCr": 0.55,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-16",
    "patrak": 3,
    "no": 16,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "યુથ એસેમ્બલી (નવી બાબત વર્ષ ૨૦૨૪-૨૫)",
    "nameEN": "Youth Assembly (new item 2024-25)",
    "allocationCr": 2.5,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-17",
    "patrak": 3,
    "no": 17,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "વિશ્વ યોગ દિવસ ઉજવણી જિલ્લા કક્ષા",
    "nameEN": "International Day of Yoga celebration — district level",
    "allocationCr": 1.65,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-18",
    "patrak": 3,
    "no": 18,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "વિશ્વ યોગ દિવસ ઉજવણી રાજ્ય કક્ષા",
    "nameEN": "International Day of Yoga celebration — State level",
    "allocationCr": 0.75,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-20",
    "patrak": 3,
    "no": 20,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "યોગ એવોર્ડ (રાજ્ય કક્ષા) તથા યોગ સ્પર્ધા (રાજ્ય કક્ષા/ મહાનગરપાલિકા કક્ષા)",
    "nameEN": "Yoga award (State level) and yoga competition (State / municipal corporation level)",
    "allocationCr": 1.5,
    "budgetHead": "98-2204-00-103-02 EDN-52"
  },
  {
    "id": "P3-23",
    "patrak": 3,
    "no": 23,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અંબાજી કેમ્પ સાઇટમાં પગાર ભથ્થાના આઉટ સોર્સીંગના રૂ. ૬.૦૦ લાખ તેમજ વડી કચેરીના આઉટ સોર્સીંગના રૂ. ૩.૦૦ લાખ",
    "nameEN": "Outsourcing of pay and allowances at the Ambaji camp site (Rs 6.00 lakh) and head office (Rs 3.00 lakh)",
    "allocationCr": 0.09,
    "budgetHead": "98-2204-00-103-02 EDN-52",
    "admin": true
  },
  {
    "id": "P3-24",
    "patrak": 3,
    "no": 24,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જાહેરાત અને જાહેર ખબર",
    "nameEN": "Advertisement and publicity",
    "allocationCr": 0.05,
    "budgetHead": "98-2204-00-103-02 EDN-52",
    "admin": true
  },
  {
    "id": "P4-01",
    "patrak": 4,
    "no": 1,
    "body": "commissionerate",
    "branch": "culture",
    "nameGU": "જિલ્લાના સર્વસંગ્રહો અને સર્વસંગ્રહ પ્રકાશન",
    "nameEN": "District gazetteers and gazetteer publication",
    "allocationCr": 0.75,
    "budgetHead": "98-2205-00-102-03"
  },
  {
    "id": "P6-01",
    "patrak": 6,
    "no": 1,
    "body": "commissionerate",
    "branch": "celebration",
    "nameGU": "મહાનુભાવોની જન્મ શતાબ્દીની ઉજવણી",
    "nameEN": "Birth-centenary celebrations of eminent persons",
    "allocationCr": 0.63,
    "budgetHead": "98-2205-00-800-06 EDN-53"
  },
  {
    "id": "P7-01",
    "patrak": 7,
    "no": 1,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિના ૧૫ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે જિલ્લા કક્ષા વ્યક્તિત્વ વિકાસ અને યોગાસન તાલીમ શિબિર",
    "nameEN": "District-level personality development and yogasan training camp for SC youth aged 15 to 35",
    "allocationCr": 0.6,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-02",
    "patrak": 7,
    "no": 2,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિના ૮ થી ૧૩ વર્ષના બાળકો માટે એડવેન્ચર કોર્ષ",
    "nameEN": "Adventure course for SC children aged 8 to 13",
    "allocationCr": 0.05,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-03",
    "patrak": 7,
    "no": 3,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિના ૧૫ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે વન વિસ્તાર પરિભ્રમણ કાર્યક્રમ",
    "nameEN": "Forest area tour programme for SC youth aged 15 to 35",
    "allocationCr": 0.06,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-04",
    "patrak": 7,
    "no": 4,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિના ૧૫ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે સાગરકાંઠા વિસ્તાર પરિભ્રમણ કાર્યક્રમ",
    "nameEN": "Coastal area tour programme for SC youth aged 15 to 35",
    "allocationCr": 0.06,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-05",
    "patrak": 7,
    "no": 5,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિ માટે ૧૪ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે ખડક ચઢાણ બેઝીક તાલીમ કોર્ષ",
    "nameEN": "Basic rock-climbing training course for SC youth aged 14 to 35",
    "allocationCr": 0.05,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-06",
    "patrak": 7,
    "no": 6,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "અનુસૂચિત જાતિના ૧૫ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે તાલુકા કક્ષા વ્યક્તિત્વ વિકાસ અને યોગાસન તાલીમ શિબિર",
    "nameEN": "Taluka-level personality development and yogasan training camp for SC youth aged 15 to 35",
    "allocationCr": 3.5,
    "budgetHead": "95-2204-00-103-01"
  },
  {
    "id": "P7-07",
    "patrak": 7,
    "no": 7,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જાહેરખબર અને જાહેરાત",
    "nameEN": "Publicity and advertisement",
    "allocationCr": 0.01,
    "budgetHead": "95-2204-00-103-01",
    "admin": true
  },
  {
    "id": "P8-01",
    "patrak": 8,
    "no": 1,
    "body": "commissionerate",
    "nameGU": "અનુસૂચિત જાતિના કલાકારોની કલાને જીવંત રાખવા અંગેની અને અનુસૂચિત જાતિ પૈકીના તૂરી બારોટ સમાજના કલાકારોની કલા જીવંત રાખવા અંગેની યોજના",
    "nameEN": "Scheme to keep alive the art of SC artists, and of artists of the Turi Barot community among them",
    "allocationCr": 0.75,
    "budgetHead": "95-2205-00-102-01 ART-4",
    "branch": "culture",
    "branchGuess": true
  },
  {
    "id": "P9-01",
    "patrak": 9,
    "no": 1,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "આદિજાતિ મહોત્સવ",
    "nameEN": "Tribal festival",
    "allocationCr": 0.27,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-02",
    "patrak": 9,
    "no": 2,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "આદિજાતિ યુવક-યુવતીઓ માટે સાગરકાંઠા વિસ્તાર પરિભ્રમણ કાર્યક્રમ",
    "nameEN": "Coastal area tour programme for tribal youth",
    "allocationCr": 0.06,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-03",
    "patrak": 9,
    "no": 3,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "૧૪-૩૫ વર્ષના યુવક યુવતીઓ માટે ખડક ચઢાણ બેઝીક કોર્ષ",
    "nameEN": "Basic rock-climbing course for youth aged 14 to 35",
    "allocationCr": 0.06,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-04",
    "patrak": 9,
    "no": 4,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "૮-૧૩ વર્ષના બાળકો માટે ખડક ચઢાણ બેઝીક કોર્ષ",
    "nameEN": "Basic rock-climbing course for children aged 8 to 13",
    "allocationCr": 0.06,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-05",
    "patrak": 9,
    "no": 5,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "આદિજાતિ યુવક-યુવતીઓ માટે જિલ્લા કક્ષા વ્યકિતત્વ વિકાસ અને યોગાસન તાલીમ શિબિર",
    "nameEN": "District-level personality development and yogasan training camp for tribal youth",
    "allocationCr": 0.25,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-06",
    "patrak": 9,
    "no": 6,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "૮ થી ૧૩ વર્ષના બાળકો માટે એડવેન્ચર કોર્ષ",
    "nameEN": "Adventure course for children aged 8 to 13",
    "allocationCr": 0.06,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-07",
    "patrak": 9,
    "no": 7,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "આદિજાતિ ૧૫ થી ૩૫ વર્ષના યુવક-યુવતીઓ માટે વન વિસ્તાર પરિભ્રમણ",
    "nameEN": "Forest area tour for tribal youth aged 15 to 35",
    "allocationCr": 0.06,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-08",
    "patrak": 9,
    "no": 8,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "આદિજાતિ યુવક-યુવતીઓ માટે તાલુકા કક્ષા વ્યકિતત્વ વિકાસ અને યોગાસન તાલીમ શિબિર",
    "nameEN": "Taluka-level personality development and yogasan training camp for tribal youth",
    "allocationCr": 1.08,
    "budgetHead": "96-2204-00-796-03 EDN-68"
  },
  {
    "id": "P9-09",
    "patrak": 9,
    "no": 9,
    "body": "commissionerate",
    "branch": "youthBoard",
    "nameGU": "જાહેરખબર અને જાહેરાત ખર્ચ",
    "nameEN": "Publicity and advertisement expenditure",
    "allocationCr": 0.01,
    "budgetHead": "96-2204-00-796-03 EDN-68",
    "admin": true
  },
  {
    "id": "P10-01",
    "patrak": 10,
    "no": 1,
    "body": "commissionerate",
    "nameGU": "આદિજાતિ લોક મહોત્સવ (ટ્રાઇબલ ફોક ફેસ્ટીવલ)",
    "nameEN": "Tribal folk festival",
    "allocationCr": 0.17,
    "budgetHead": "96-2205-00-796-04 ART-04",
    "branch": "culture",
    "branchGuess": true
  },
  {
    "id": "P10-02",
    "patrak": 10,
    "no": 2,
    "body": "commissionerate",
    "nameGU": "આદિવાસી વિસ્તારમાં લોક નૃત્ય/ લોકવાદ્ય સંબંધિત વિવિધ તાલીમ શિબિરોનું આયોજન અને અનુસૂચિત જનજાતિની સંસ્કૃતિની ઓળખ અંગેની શિબિર કરવા અંગે (નવી બાબત ૨૦૨૪-૨૫)",
    "nameEN": "Training camps on folk dance and folk instruments in tribal areas, and camps on ST cultural identity (new item 2024-25)",
    "allocationCr": 0.76,
    "budgetHead": "96-2205-00-796-04 ART-04",
    "branch": "culture",
    "branchGuess": true
  },
  {
    "id": "L-01",
    "no": 1,
    "body": "lalitKala",
    "nameGU": "નેશનલ ફોટોગ્રાફી સ્પર્ધા /પ્રદર્શન",
    "nameEN": "National photography competition / exhibition",
    "allocationCr": 0.1,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-02",
    "no": 2,
    "body": "lalitKala",
    "nameGU": "નેશનલ ફોટોગ્રાફી વર્કશોપ",
    "nameEN": "National photography workshop",
    "allocationCr": 0.1,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-03",
    "no": 3,
    "body": "lalitKala",
    "nameGU": "ચિલ્ડ્રન પેઇન્ટીંગ વર્કશોપ",
    "nameEN": "Children's painting workshop",
    "allocationCr": 0.25,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-04",
    "no": 4,
    "body": "lalitKala",
    "nameGU": "યુથ આર્ટિસ્ટ શિબિર",
    "nameEN": "Youth artist camp",
    "allocationCr": 0.3,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-05",
    "no": 5,
    "body": "lalitKala",
    "nameGU": "કોન્ટેમ્પરરી આર્ટિસ્ટ કેમ્પ",
    "nameEN": "Contemporary artist camp",
    "allocationCr": 0.25,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-06",
    "no": 6,
    "body": "lalitKala",
    "nameGU": "ડોક્યુમેન્ટેશન ઓફ આર્ટિસ્ટ",
    "nameEN": "Documentation of artists",
    "allocationCr": 0.1,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-07",
    "no": 7,
    "body": "lalitKala",
    "nameGU": "ગૌરવ પુરસ્કાર યોજના",
    "nameEN": "Gaurav Puraskar (award) scheme",
    "allocationCr": 0.2,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-08",
    "no": 8,
    "body": "lalitKala",
    "nameGU": "ચિત્રો અને કલાવસ્તુઓનું દસ્તાવેજીકરણ",
    "nameEN": "Documentation of paintings and art objects",
    "allocationCr": 0.1,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-09",
    "no": 9,
    "body": "lalitKala",
    "nameGU": "રવિશંકર રાવળ કલાભવન ખાતે કાયમી પ્રદર્શન",
    "nameEN": "Permanent exhibition at Ravishankar Raval Kalabhavan",
    "allocationCr": 0.05,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-10",
    "no": 10,
    "body": "lalitKala",
    "nameGU": "શિલ્પકલાનો વર્કશોપ",
    "nameEN": "Sculpture workshop",
    "allocationCr": 0.25,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "L-11",
    "no": 11,
    "body": "lalitKala",
    "nameGU": "રવિશંકર રાવળ કલાભવન જાળવણી / ફાયરસેફ્ટી અને કચેરી ખર્ચ",
    "nameEN": "Ravishankar Raval Kalabhavan upkeep / fire safety and office expenditure",
    "allocationCr": 0.3,
    "budgetHead": "98-2205-102-02 ART-5",
    "admin": true
  },
  {
    "id": "L-12",
    "no": 12,
    "body": "lalitKala",
    "nameGU": "લલિતકલા અકાદમીને કોર્પસ ફંડ",
    "nameEN": "Corpus fund for the Lalit Kala Akademi",
    "allocationCr": 0.01,
    "budgetHead": "98-2205-102-02 ART-5",
    "admin": true
  },
  {
    "id": "L-13",
    "no": 13,
    "body": "lalitKala",
    "nameGU": "રેતિશિલ્પ મહોત્સવ",
    "nameEN": "Sand sculpture festival",
    "allocationCr": 0.3,
    "budgetHead": "98-2205-102-02 ART-5"
  },
  {
    "id": "S-01",
    "no": 1,
    "body": "sangeetNatak",
    "nameGU": "જશવંત સિંહ અને રસીકલાલ અંધારીયા સ્કોલરશીપ",
    "nameEN": "Jashwant Singh and Rasiklal Andhariya scholarship"
  },
  {
    "id": "S-02",
    "no": 2,
    "body": "sangeetNatak",
    "nameGU": "સુગમ/ શાસ્ત્રીય સંગીત પર વર્કશોપ અને સેમીનાર (નવોદિત કલાકારો માટે)",
    "nameEN": "Workshop and seminar on sugam / classical music (for emerging artists)"
  },
  {
    "id": "S-03",
    "no": 3,
    "body": "sangeetNatak",
    "nameGU": "સુગમ/ શાસ્ત્રીય સંગીત મહોત્સવ (રાષ્ટ્રીય કક્ષાએ ખ્યાતિ પ્રાપ્ત કલાકારો માટે)",
    "nameEN": "Sugam / classical music festival (for nationally renowned artists)"
  },
  {
    "id": "S-04",
    "no": 4,
    "body": "sangeetNatak",
    "nameGU": "આદિત્યરામજી શાસ્ત્રીય સંગીત મહોત્સવ",
    "nameEN": "Adityaramji classical music festival"
  },
  {
    "id": "S-05",
    "no": 5,
    "body": "sangeetNatak",
    "nameGU": "મહિલા શાસ્ત્રીય સંગીત મહોત્સવ",
    "nameEN": "Women's classical music festival"
  },
  {
    "id": "S-06",
    "no": 6,
    "body": "sangeetNatak",
    "nameGU": "ગુરુશિષ્ય પરંપરાની તાલીમ",
    "nameEN": "Guru-shishya parampara training"
  },
  {
    "id": "S-07",
    "no": 7,
    "body": "sangeetNatak",
    "nameGU": "તાનારીરી મહોત્સવ તથા એવોર્ડ (રાષ્ટ્રીય કક્ષા)",
    "nameEN": "Tana-Riri festival and award (national level)"
  },
  {
    "id": "S-08",
    "no": 8,
    "body": "sangeetNatak",
    "nameGU": "પં. ઓમકારનાથ શાસ્ત્રીય સંગીત મહોત્સવ તથા એવોર્ડ",
    "nameEN": "Pt. Omkarnath classical music festival and award"
  },
  {
    "id": "S-09",
    "no": 9,
    "body": "sangeetNatak",
    "nameGU": "શરદોત્સવ પં. નંદન મહેતા શાસ્ત્રીય સંગીત સ્પર્ધા અને સમારોહ",
    "nameEN": "Sharadotsav Pt. Nandan Mehta classical music competition and function"
  },
  {
    "id": "S-10",
    "no": 10,
    "body": "sangeetNatak",
    "nameGU": "પ્રતિભાશાળી નાટય દિગ્દર્શકોને નાટય નિર્માણ માટે આર્થિક સહાય",
    "nameEN": "Financial assistance to talented theatre directors for play production"
  },
  {
    "id": "S-11",
    "no": 11,
    "body": "sangeetNatak",
    "nameGU": "જુની રંગભુમિના નાટકોનું પુનઃ નિર્માણ",
    "nameEN": "Re-production of old stage plays"
  },
  {
    "id": "S-12",
    "no": 12,
    "body": "sangeetNatak",
    "nameGU": "ભવાઇ તાલીમ કેન્દ્ર પુનઃજીવીત કરવા બાબત",
    "nameEN": "Reviving the Bhavai training centre"
  },
  {
    "id": "S-13",
    "no": 13,
    "body": "sangeetNatak",
    "nameGU": "કલ કે કલાકાર સમારોહ અને શાસ્ત્રીય નૃત્ય મહોત્સવ",
    "nameEN": "Kal ke Kalakar function and classical dance festival"
  },
  {
    "id": "S-14",
    "no": 14,
    "body": "sangeetNatak",
    "nameGU": "શાસ્ત્રીય નૃત્ય/પરંપરાગત લોક નૃત્યો પર વર્કશોપ અને સેમીનાર",
    "nameEN": "Workshop and seminar on classical dance / traditional folk dances"
  },
  {
    "id": "S-15",
    "no": 15,
    "body": "sangeetNatak",
    "nameGU": "ચાંપાનેર મહોત્સવ",
    "nameEN": "Champaner festival"
  },
  {
    "id": "S-16",
    "no": 16,
    "body": "sangeetNatak",
    "nameGU": "શાસ્ત્રીય નૃત્ય તથા નાટયક્ષેત્રના વૃંદોને અન્ય રાજ્યોમાં તથા વિદેશમાં મોકલી નૃત્ય તથા નાટયના કાર્યક્રમોના આયોજન માટે આર્થિક સહાય (સા.વા.જા.યો.)",
    "nameEN": "Financial assistance to send classical dance and theatre troupes to other States and abroad"
  },
  {
    "id": "S-17",
    "no": 17,
    "body": "sangeetNatak",
    "nameGU": "રંગમંચલક્ષી કલાઓના તમામ નિર્ધારિત વિશ્વદિનની ઉજવણી (૧૮ એપ્રિલ-નૃત્ય/૨૧- જૂન સંગીત/૨૭ -માર્ચ-નાટય)",
    "nameEN": "Celebration of all designated world days of the performing arts (18 Apr dance / 21 Jun music / 27 Mar theatre)"
  },
  {
    "id": "S-18",
    "no": 18,
    "body": "sangeetNatak",
    "nameGU": "અકાદમીના સ્થાપના દિનની વિવિધ સાંસ્કૃતિક કાર્યક્રમોનું આયોજન (૧૦ એપ્રિલ અને ૧૬ મે ૧૯૯૨)",
    "nameEN": "Cultural programmes on the Akademi's foundation day (10 April and 16 May 1992)"
  },
  {
    "id": "S-19",
    "no": 19,
    "body": "sangeetNatak",
    "nameGU": "સાંસ્કૃતિક ધરોહર યોજના હેઠળ ગાંધીનગર ખાતે વિવિધ સાંસ્કૃતિક કાર્યક્રમોનું આયોજન",
    "nameEN": "Cultural programmes at Gandhinagar under the cultural heritage scheme"
  },
  {
    "id": "S-20",
    "no": 20,
    "body": "sangeetNatak",
    "nameGU": "નગરપાલિકા વિસ્તારમાં સાંસ્કૃતિક કેન્દ્રો/ઓડિટોરિયમ જન ભાગીદારીથી ઉભા કરવા સ્થાનિક સ્વરાજની સંસ્થાઓ/ટ્રસ્ટોને સહાય આપવા બાબત",
    "nameEN": "Assistance to local bodies / trusts to build cultural centres and auditoriums in municipal areas through public participation"
  },
  {
    "id": "S-21",
    "no": 21,
    "body": "sangeetNatak",
    "nameGU": "કવિ કાલીદાસ નિર્મિત નાટય નિર્માણ કરવા",
    "nameEN": "Production of plays written by the poet Kalidas"
  },
  {
    "id": "S-22",
    "no": 22,
    "body": "sangeetNatak",
    "nameGU": "સંગીત, નૃત્ય નાટ્યનો વિકાસ માટે સંશોધન કાર્ય",
    "nameEN": "Research work for the development of music, dance and theatre"
  },
  {
    "id": "S-23",
    "no": 23,
    "body": "sangeetNatak",
    "nameGU": "લોકસંગીત/ડાયરાના કાર્યક્રમોને ઉતેજન આપવા",
    "nameEN": "Encouragement of folk music / dayro programmes"
  },
  {
    "id": "S-24",
    "no": 24,
    "body": "sangeetNatak",
    "nameGU": "દુલાભાયા કાગની સ્મૃતિમાં લોક સંગીત/ ભજન જેવી સાંસ્કૃતિક પ્રવૃતિઓ કરવા બાબત",
    "nameEN": "Folk music and bhajan activities in memory of Dula Bhaya Kag"
  },
  {
    "id": "S-25",
    "no": 25,
    "body": "sangeetNatak",
    "nameGU": "પંડિત ઓમકારનાથ સંગીત સ્પર્ધા",
    "nameEN": "Pandit Omkarnath music competition"
  },
  {
    "id": "S-26",
    "no": 26,
    "body": "sangeetNatak",
    "nameGU": "શાસ્ત્રીય સંગીત સભા",
    "nameEN": "Classical music sabha"
  },
  {
    "id": "S-27",
    "no": 27,
    "body": "sangeetNatak",
    "nameGU": "ભકિત સંગીત સમારોહ",
    "nameEN": "Devotional music function"
  },
  {
    "id": "S-28",
    "no": 28,
    "body": "sangeetNatak",
    "nameGU": "સંગીત નાટય ભારતી રાજકોટ પરીક્ષા",
    "nameEN": "Sangeet Natya Bharati Rajkot examination"
  },
  {
    "id": "S-29",
    "no": 29,
    "body": "sangeetNatak",
    "nameGU": "લોક સંગીત સમારોહ",
    "nameEN": "Folk music function"
  },
  {
    "id": "S-30",
    "no": 30,
    "body": "sangeetNatak",
    "nameGU": "શાસ્ત્રીય નૃત્ય મહોત્સવ",
    "nameEN": "Classical dance festival"
  },
  {
    "id": "S-31",
    "no": 31,
    "body": "sangeetNatak",
    "nameGU": "તાનારીરી શાસ્ત્રીય સંગીત સમારોહ",
    "nameEN": "Tana-Riri classical music function"
  },
  {
    "id": "S-32",
    "no": 32,
    "body": "sangeetNatak",
    "nameGU": "એકાંકી નાટય સ્પર્ધા",
    "nameEN": "One-act play competition"
  },
  {
    "id": "S-33",
    "no": 33,
    "body": "sangeetNatak",
    "nameGU": "રાજય લોકનૃત્ય મહોત્સવ",
    "nameEN": "State folk dance festival"
  },
  {
    "id": "S-34",
    "no": 34,
    "body": "sangeetNatak",
    "nameGU": "સુગમ સંગીત સંમેલન",
    "nameEN": "Sugam sangeet convention"
  },
  {
    "id": "S-35",
    "no": 35,
    "body": "sangeetNatak",
    "nameGU": "ગૌરવ પુરસ્કાર સમારોહ",
    "nameEN": "Gaurav Puraskar function"
  },
  {
    "id": "S-36",
    "no": 36,
    "body": "sangeetNatak",
    "nameGU": "પંડીત ઓમકારનાથ શાસ્ત્રીય સંગીત સમારોહ",
    "nameEN": "Pandit Omkarnath classical music function"
  },
  {
    "id": "S-37",
    "no": 37,
    "body": "sangeetNatak",
    "nameGU": "બૈજુ શાસ્ત્રીય સંગીત સમારોહ",
    "nameEN": "Baiju classical music function"
  },
  {
    "id": "S-38",
    "no": 38,
    "body": "sangeetNatak",
    "nameGU": "વિભાગીય ત્રિઅંકી સ્પર્ધા",
    "nameEN": "Divisional three-act play competition"
  },
  {
    "id": "S-39",
    "no": 39,
    "body": "sangeetNatak",
    "nameGU": "ત્રિઅંકી નાટય સ્પર્ધા",
    "nameEN": "Three-act play competition"
  },
  {
    "id": "S-40",
    "no": 40,
    "body": "sangeetNatak",
    "nameGU": "નાટક તાલીમ શિબિર",
    "nameEN": "Drama training camp"
  },
  {
    "id": "S-41",
    "no": 41,
    "body": "sangeetNatak",
    "nameGU": "ગુજરાત રાજ્યના ગુજરાતી તથા હિન્દી, ભાષાના નામાંકિત લેખક કવિ, કલાકારોની કૃતિને સ્વરાંજલિ",
    "nameEN": "Musical tribute to works of noted Gujarati and Hindi writers, poets and artists of Gujarat"
  },
  {
    "id": "S-42",
    "no": 42,
    "body": "sangeetNatak",
    "nameGU": "શાસ્ત્રીય સંગીત સમારોહ (સપ્તક)",
    "nameEN": "Classical music function (Saptak)"
  },
  {
    "id": "S-43",
    "no": 43,
    "body": "sangeetNatak",
    "nameGU": "તમામ કલાની પ્રતિભાશોધ(ટેલેન્ટ હન્ટ)",
    "nameEN": "Talent hunt across all art forms"
  },
  {
    "id": "S-44",
    "no": 44,
    "body": "sangeetNatak",
    "nameGU": "ચાંપાનેર- પાવાગઢ ખાતે પંચ મહોત્સવ દરમિયાન વિવિધ સાંસ્કૃતિક કાર્યક્રમોનું આયોજન",
    "nameEN": "Cultural programmes during the Panch Mahotsav at Champaner-Pavagadh"
  },
  {
    "id": "S-45",
    "no": 45,
    "body": "sangeetNatak",
    "nameGU": "રાવળદેવ જોગી સમાજના ડાક ડમરુ વાદકોને આર્થિક સહાય",
    "nameEN": "Financial assistance to dak-damru players of the Ravaldev Jogi community"
  },
  {
    "id": "S-46",
    "no": 46,
    "body": "sangeetNatak",
    "nameGU": "સાંસ્કૃતિક કાર્યક્રમ યોગ્યતા પ્રમાણપત્ર",
    "nameEN": "Cultural programme eligibility certificate"
  },
  {
    "id": "S-47",
    "no": 47,
    "body": "sangeetNatak",
    "nameGU": "પંડિત જસરાજ સંગીત સન્માન એવોર્ડ",
    "nameEN": "Pandit Jasraj music honour award"
  },
  {
    "id": "S-48",
    "no": 48,
    "body": "sangeetNatak",
    "nameGU": "નાટ્ય મંચન (નવી બાબત ૨૦૨૫-૨૬)",
    "nameEN": "Play staging (new item 2025-26)"
  },
  {
    "id": "S-49",
    "no": 49,
    "body": "sangeetNatak",
    "nameGU": "તુરી બારોટ નાટ્ય નિર્માણ આર્થિક સહાય (SCSP)",
    "nameEN": "Turi Barot play production financial assistance (SCSP)"
  },
  {
    "id": "S-50",
    "no": 50,
    "body": "sangeetNatak",
    "nameGU": "SCSP (નવી બાબત)",
    "nameEN": "SCSP (new item)"
  },
  {
    "id": "S-51",
    "no": 51,
    "body": "sangeetNatak",
    "nameGU": "ટી.એ.એસ.પી. (TASP)",
    "nameEN": "TASP"
  }
];
