# Cultural Schemes Questionnaire — SYCAD

Bilingual (English + Gujarati) questionnaire app for officers of the three implementing
bodies of the Sports, Youth & Cultural Activities Department, Government of Gujarat:

- **Commissionerate** of Youth Services & Cultural Activities *(has branches)*
- **Gujarat State Lalit Kala Akademi**
- **Gujarat State Sangeet Natak Akademi**

**Part A** (25 questions) is answered once per body. **Part B** (58 questions) is answered
per scheme. Part C of the instrument is out of scope for this app.

Static vanilla-JS PWA + Firebase (Google Auth + Firestore) + GitHub Pages.
No build step, no bundler, no server.

---

## ⛔ Working rule

Every feature and every screen is **proposed and approved before it is built**.
Do not add features ahead of sign-off.

**Built so far:**
- **Feature 1** — project scaffold + Firebase wiring.
- **Feature 2** — Google sign-in + session gate.
- **Feature 3** — profile setup (body → name → rank → branch).
- **Feature 4** — Part A question spec + render engine (25 questions, bilingual).
- **Feature 5** — Part A autosave, resume and submit.
- **Feature 6** — field-level audit log (write side).
- **Feature 7** — Home screen with live Part A status.
- **Feature 8** — Admin: progress tracker + audit log viewer.
- **Feature 9** — deployment (see **`DEPLOY.md`**).
- **Feature 10** — scheme list for all three bodies (`js/schemes.js`, 162 schemes).
- **Feature 11** — Part B scheme picker.
- **Feature 12** — reporting a scheme filed under the wrong body or branch.
- **Feature 13** — Part B question spec (`js/spec-b.js`, 58 questions, bilingual).
- **Feature 14** — the Part B form, and "ask only what applies" (`js/route-b.js`).
- **Feature 15** — Part B autosave, resume and submit.
- **Feature 16** — confirming the 43 guessed branch tags.
- **Feature 17** — Part B progress, branch by branch.

**Phases 1 and 2 are complete.** The app is feature-complete: Part A, Part B for all 162
schemes, routing, saving, branch-tag confirmation and progress reporting. What remains is
**deployment** (see `DEPLOY.md`) and field capture.
The views for them exist as empty placeholders in `index.html`.

### Feature 2 notes

Sign-in uses `signInWithPopup`, falling back to `signInWithRedirect` only when the popup is
blocked. Popup is the default deliberately: on GitHub Pages the page and the Firebase auth
handler sit on different domains, so redirect sign-in fails wherever third-party storage is
blocked. The account chooser is forced (`prompt: 'select_account'`) because officers share
machines and a silently reused session would attribute one officer's answers to another.

Sign-in failures are reported to the officer bilingually. Three are setup mistakes rather
than officer errors, and name the fix: an unauthorised domain (README step 8), Google
sign-in not enabled (step 2), and an invalid config (step 4).

A 20-second watchdog covers browsers where a blocked popup never resolves at all: it
re-enables the button, explains that pop-ups may be blocked, and arms the redirect route for
the next press. Nothing in-flight is cancelled, so a slow but genuine sign-in still succeeds.

The admin flag is read once per session and held in memory. It only decides whether the
Admin button is drawn — `firestore.rules` is what actually governs access.

### Feature 3 notes — adding the rank lists later

**The rank lists are not filled in yet, and the app does not wait for them.**
`CONST.RANKS` in `js/app.js` is keyed by body:

```js
RANKS: {
  commissionerate: [],
  lalitKala: [],
  sangeetNatak: []
}
```

- **Empty** (today) — rank renders as a free-text box, so no officer is blocked on a list
  that does not exist yet.
- **Filled** — rank renders as a bilingual dropdown of those ranks, plus *Other / અન્ય*
  which reveals a text box for anything the list misses.

To add them, put entries in the relevant array and change nothing else:

```js
commissionerate: [
  { id: 'clerk', en: 'Clerk',              gu: 'કારકુન' },
  { id: 'ad',    en: 'Assistant Director', gu: 'મદદનીશ નિયામક' }
]
```

No change is needed to `firestore.rules`, and **profiles already saved keep working**: a
previously typed rank that is not on the new list reopens under *Other* with the original
text intact, and the officer can switch it to a listed rank via the Profile button.

The stored value is the readable bilingual label, not the internal id, because the rank is
shown in the app bar, the tracker and every line of the audit log — an id would be
unreadable to whoever reviews that log later.

### Profile writes

- **branch is Commissionerate-only** — required there, and absent (not empty) on the
  Akademis, which the rules enforce. Editing a profile from the Commissionerate to an
  Akademi actively deletes the stored branch.
- **createdAt is written once and never resent.** Edits use `merge: true` so the stored
  value is untouched; the rules pin it, so the original sign-up time cannot be rewritten.

---

## Free tier is a hard constraint

The project runs entirely on the Firebase **Spark (free)** plan. That rules out two things:

| Not available on free | Replacement used here |
|---|---|
| **Cloud Storage** (Blaze-gated since 3 Feb 2026) | Attachments go to Google Drive; Firestore stores only the link. |
| **Cloud Functions** | Access hardening via an `allowlist/{email}` collection checked in rules; export runs client-side; reminders are sent manually. |

Daily free ceilings are 50,000 reads / 20,000 writes / 1 GiB stored. The constants in
`js/app.js` (`CONST`) exist to keep usage far inside them:

- commit-debounce **2s**, writing on blur/change — never per keystroke
- no-op guard: an unchanged value writes nothing
- the admin tracker uses a one-shot read plus a Refresh button, **never a live listener**
  (a listener bills a read on every officer's autosave — the one pattern that could spiral)
- `isAdmin()` sits behind `||` in the rules so it short-circuits off the officer hot path
- audit viewer paginates at 50
- character caps of 2,000 (5,000 for the open-ended B11 questions)

**On the character caps:** rules cannot iterate a dynamic `answers` map, so the caps are
enforced client-side as a UX guard. The real server-side backstop is Firestore's own hard
1 MiB document limit, which no client can exceed. `firestore.rules` additionally caps the
number of answer keys per document at 400.

---

## Files

| File | Purpose |
|---|---|
| `index.html` | Single-page shell. All views live here as `<section class="view">`. |
| `css/styles.css` | Design tokens and components from the approved flow mockup. |
| `js/firebase-config.js` | **You paste your Firebase config here.** Not a secret. |
| `js/firebase.js` | Initialises Firebase, enables the offline cache, exposes `window.FB`. |
| `js/spec-a.js` | The 25 Part A questions, bilingual. Mirrors the locked instrument. |
| `js/spec-b.js` | The 58 Part B questions, bilingual. Mirrors the locked instrument. |
| `js/render.js` | Turns either spec into a form; knows nothing about Firebase. |
| `js/route-b.js` | The six rules deciding which Part B questions a scheme still needs. |
| `js/schemes.js` | The 162 schemes across all three bodies. |
| `js/demo.js` | Demo mode — inert unless the address ends in `?demo=1`. |
| `js/app.js` | Boot, config guard, view router, and the free-tier `CONST` block. |
| `firestore.rules` | Server-enforced security. Publish this to Firebase. |
| `service-worker.js` | Offline shell cache. Bump `CACHE` whenever a shell file changes. |
| `manifest.webmanifest`, `icon.svg` | PWA install metadata. |

---

## Setup

**Follow `DEPLOY.md`** — the same steps written for a non-technical reader,
with a post-deploy check list. The short version:

1. **Firebase Console → Add project** (a new project, not an existing one).
2. **Authentication → Sign-in method → enable Google.**
3. **Firestore Database → Create database → Production mode.** Pick the `asia-south1`
   (Mumbai) region — closest to Gujarat, and it keeps the data in India.
4. **Project settings → Your apps → Web app** → copy the config object into
   `js/firebase-config.js`, replacing the `PASTE_…` placeholders.
5. **Firestore → Rules** → paste the contents of `firestore.rules` → Publish.
6. **Firestore → Data** → create collection `admins`, add a document whose **ID is your
   email address**. The document can be empty — its
   existence is what grants admin.
7. **Push this folder to a new GitHub repo** → Settings → Pages → deploy from `main`.
8. **Firebase → Authentication → Settings → Authorized domains** → add your
   `<username>.github.io` domain, or sign-in will be rejected.

Seeding the `schemes` collection happens in Phase 2, along with branch tagging.

## Checking it works

Open `index.html`. Before step 4 you should see the **"Setup pending"** card. After
pasting the config you should get the sign-in screen with no console errors. The sign-in
button does nothing yet — that is Feature 2.

Note that a `file://` page cannot register the service worker; that is expected and
harmless. For a realistic local test serve the folder over HTTP:

```bash
python -m http.server 8000
```

---

## Data model

```
admins/{email}         presence = admin (console-managed)
allowlist/{email}      optional access gate, OFF by default (console-managed)
users/{uid}            { email, name, body, rank, branch?, createdAt }   branch = Commissionerate only
schemes/{schemeId}     { patrakItem, nameEN, nameGU, type, allocation, body, branch? }
responsesA/{bodyId}    one shared doc per body   { answers:{qid:value}, status, lastEditedBy… }
responsesB/{schemeId}  one doc per scheme        { body, branch?, answers:{qid:value}, status… }
audit/{autoId}         append-only { ts, actor…, docType:'A'|'B', docId, qid, oldValue, newValue, action }
```

**Part A concurrency (approved option a):** `responsesA/{bodyId}` is a single shared
document per body. Writes merge at field level, so two officers answering different
questions never collide; on the same question the last save wins, and a "last edited by"
banner names who touched it. Every overwrite stays recoverable from the audit log.


### Feature 4 notes — the question spec and render engine

`js/spec-a.js` holds all **25 Part A questions** (104 sub-parts, 13 marked BLOCKING),
transcribed from `Scheme Questionnaire.md`. That instrument is **locked**: it was agreed
question by question with the department in both languages. **Do not reword a question
here** — change the instrument first, then mirror it.

Part A is answered **once per body**, so no question may name a single body. Sections A4,
A5 and A9 were dissolved into Part B and are deliberately absent; the surviving numbering
(A1, A2, A3, A6, A7, A8, A10) is kept because that is what the department knows.

`js/render.js` turns a spec into a form and reads answers back. It knows nothing about
Firebase — it renders, reports committed changes through `onCommit`, and can be handed a
saved answer set to restore. The same engine will render Part B unchanged.

**Question types:** `multi` (tick all, optionally with a ★ "most common" marker) ·
`single` · `text` · `longtext` · `table`. Any option can carry a write-in box, which
appears only when that option is ticked.

**Answer keys** — these end up in the audit log, so they must stay stable:

| Key | Meaning |
|---|---|
| `A1.1.channels` | the part's value (array for `multi`, string otherwise) |
| `A1.1.channels~news` | the write-in box attached to option `news` |
| `A1.1.channels~~star` | the ★ marker on a tick-list |
| `A3.2.bands~r0c1` | one cell of a table |

**Commit model:** tick-boxes and choices commit on `change`; typed text commits on `blur`,
and only if the value actually changed. That no-op guard matters on the free tier — every
saved change also writes one audit record, so committing per keystroke would multiply
writes for nothing.

**Pre-filled answers** (our guesses from the GR and the pipeline interview) are shown as an
amber "Not verified" hint and are **never written into the field**. The officer has to
confirm or correct them, otherwise a guess would launder itself into a verified answer.

**Progress** counts a question as answered when its *first* part has a value. Judging by the
first part avoids penalising the officer for follow-up lines that don't apply to them
("if yes, which…"), which would leave a fully answered form reading as incomplete.

### Feature 5 notes — autosave, resume, submit

Answers are saved to `responsesA/{bodyId}` — **one shared document per body**, the approved
concurrency model. Writes merge field by field, so two officers answering *different*
questions never collide; on the *same* question the last save wins, and the audit trail
(Feature 6) is what makes an overwrite recoverable.

**Batched autosave.** A change commits to a pending set and is written after
`CONST.COMMIT_DEBOUNCE_MS` (2s) of quiet, so filling several boxes in a row costs **one**
write rather than one per box. Verified: three separate answers → one write. This matters
twice over on the free tier, because every write will also be mirrored into the audit trail.

**Re-read on every open.** Part A is a shared sheet, so a colleague may have answered more
of it since this officer last looked. Opening it always re-reads (one read — negligible
against 50,000/day) rather than trusting the copy in memory. Anything typed but not yet
written is flushed first and re-applied over the server copy, so re-reading can never
discard the officer's own unsaved work.

**Shared machines.** `resetPartA()` clears the loaded sheet whenever the signed-in officer
changes. Without it the next officer to sign in inherits the previous one's copy — including
a stale "last edited by" line, which is the one warning that a colleague is working on the
same questions.

**The "last edited by" banner** appears only when somebody *else* was last in the sheet, so
officers are not nagged about their own edits. Timestamps are printed only once they
actually resolve — a just-saved local copy carries a pending timestamp, and testing the raw
field would print a dangling `on ` with nothing after it.

**Offline is reported as success, not failure.** With local persistence the write is already
stored and Firestore flushes it on reconnect, so the chip reads *"Saved on this device —
will sync"*. Leaving it spinning on "Saving…" would read as broken to an officer on a
district connection. A genuine failure puts the batch back into pending so nothing typed is
lost, and it rides along with the next write.

**Submit** sets `status: 'submitted'` with `submittedBy` / `submittedAt`. If any BLOCKING
question is still empty the officer is told how many and must confirm — allowed, but never
silent. The sheet stays editable after submission; later edits keep the submitted status and
update `lastEditedAt`.

**Closing the tab** inside the 2s gap flushes immediately and warns, so the last few answers
cannot be lost.

### Feature 6 notes — the audit log

One `audit` document per answer actually changed, appended and never altered. This is what
makes the shared-sheet model safe: when two officers answer the same question the later save
wins, and this log is how the earlier answer is found again, and who replaced it.

Each entry carries `ts`, the actor (`actorUid`, `actorEmail`, `actorName`, `actorRank`,
`actorBody`, and `actorBranch` for the Commissionerate only), the target (`docType` `A`/`B`,
`docId`, `qid`) and `oldValue` → `newValue`. `firestore.rules` allows **create only** — no
update and no delete, for anybody including admins. An audit trail that can be rewritten is
not an audit trail.

**Written atomically with the answer.** The response write and its audit entries go in one
`WriteBatch`. Written separately, a failure could leave the log claiming a change that never
saved, or an answer with no record of who made it — either is worse than no log. Verified: a
failed batch leaves *both* the answers and the log untouched, and the retry still records the
change from where it originally started.

**Values are stored as truncated text** (`CONST.AUDIT_VALUE_CAP`, 300 chars). The log records
*that* something changed, not the text itself — the full answer always lives in the response
document. Untruncated, two 5,000-character answers per entry across the life of the project
would run to hundreds of MB against a 1 GiB free allowance. Ticked options are flattened to
`"news, website"`, which reads better in a log than raw data and keeps the viewer simple.

**No-change entries are dropped.** Ticking and unticking the same box before the write lands
records nothing. The first old value seen in a window is the one kept, so a series of edits
inside one window reads as a single change from where it started.

**Cost.** Each save now costs one write for the answers plus one per changed field. With the
2s batching and the no-op guard, a fully completed Part A is roughly 200 writes — against
20,000 free per day.

### Feature 7 notes — Home

Greets the officer by name, rank and office (branch too, for the Commissionerate), and shows
a Part A card with a live status: **Not started** / **In progress** / **Submitted**, a
progress bar, how many of the 25 are answered, how many BLOCKING answers are still missing,
and — when it was somebody else — who last edited the shared sheet. The button reads Start,
Continue or Review or edit to match. The Part B card is a visible placeholder for the next
phase, so officers can see it is coming rather than wonder if it is missing.

**Reads are spent only where they buy something.** Returning from the form costs **zero
reads** (verified) — the answers are already in memory and this officer just wrote them, so
re-reading would spend a read to learn what the page already knows. Every other route to
Home re-reads, because arriving from the profile or admin screen the copy in memory may be
older than what a colleague has since saved.

**A failed status read says so.** It shows *"Status unavailable"* rather than falling back to
a confident "Not started / 0 of 25", which would make an officer reasonably think their work
had vanished.

### Feature 8 notes — the admin screen

Admin-only, gated twice: the button is hidden unless `admins/{email}` exists, and `openAdmin()`
refuses regardless. `firestore.rules` is the real boundary — the audit log is readable only by
an admin, and writable by nobody after the fact.

**Progress tracker** — one row per body: status, progress bar, how many of the 25 are answered,
how many BLOCKING answers are still empty, and who last edited the sheet.

**On "Commissionerate broken down by branch":** Part A is *one sheet per body*, so a branch
cannot have its own percentage — there is nothing per-branch to divide. What a branch does have
is people, so the Commissionerate row lists **officers registered by branch**, including a
"no officer registered yet" line for branches nobody has joined (which is itself the useful
signal — that branch has no one answering). Per-scheme progress by branch arrives with Part B,
which *is* branch-tagged. The officer list failing does not take the tracker down with it.

**Audit viewer** — newest first, 50 per page, with Load more. Shows when, who (name, rank, body,
branch), which question, and `old → new` struck-through and in green.

**Filters work over loaded entries, not the whole collection, and the screen says so.** A
server-side filter combined with newest-first ordering needs a composite index created by hand
in the Firebase console; saying "filters apply to loaded entries — use Load more to search
further back" is better than an admin concluding an entry does not exist. If the log ever grows
past comfortable paging, that index is the upgrade path.

**No live listeners anywhere.** Everything loads on open and on an explicit Refresh. A listener
on these collections would bill a read every time any officer autosaves anywhere — the one
pattern that could burn through the free daily allowance while nobody is even looking at the
screen.

---

## Known limits

**Officer list in the admin tracker.** Listing `users` evaluates `isAdmin()` per document,
and Firestore caps document-access calls inside rules for a query. With a pilot-sized team
this is nowhere near the limit, but if the officer count ever grows past roughly twenty the
list may start refusing. This was designed for: the officer list failing does **not** take
the tracker down — the per-body rows still render, and only the branch breakdown disappears.

**Audit filters cover loaded entries only.** Server-side filtering combined with newest-first
ordering needs a composite index created by hand in the Firebase console. The screen states
this plainly rather than letting an admin conclude an entry does not exist. Creating that
index is the upgrade path if the log outgrows paging.

**Part A has no per-branch progress.** It is one sheet per body, so a branch has no separate
percentage — the Commissionerate row lists officers per branch instead. Per-scheme progress
by branch arrives with Part B, which is branch-tagged.

**Service worker unverified.** The offline shell could not be exercised in the development
browser, which blocks service workers outright (an empty probe worker fails identically).
`DEPLOY.md` includes the check to run on the live site. Registration failure is caught and
harmless — the app runs online-only.

**Concurrent edits.** Approved model (a): officers of one body share a sheet, writes merge
per field, and the same field keeps the last save. The audit log is what makes an overwrite
recoverable. There is no live listener, so a colleague's edits appear on next open.

### Feature 11 notes — the scheme picker

162 schemes is far past what a dropdown can carry, so the Part B card on Home is a
**searchable list** narrowed to what the officer is actually responsible for.

- **Commissionerate** officers get a branch selector that **defaults to their own branch**.
  "All branches" stays one click away rather than being a default wall of 83 schemes.
- **Akademi** officers have no branches, so no selector appears.
- **Search** matches the English name, the Gujarati name, the scheme id, the budget head and
  `patrak N` — so `યોગ`, `navratri` and `patrak 9` all work.
- **Establishment lines are hidden** (14 of them: salaries, outsourcing, advertising,
  publication, corpus funds). Nobody applies for an advertising budget, and asking an officer
  58 questions about one would waste their time. The count of hidden lines is shown, so the
  numbers on screen still reconcile against the GR.
- **Ordering** puts the Akademi's own numbered list before the budget-GR Patrak lines, since
  that is the numbering its officers recognise. For the Commissionerate everything carries a
  Patrak, so it is simply Patrak order.
- **Branch guesses are visible**: Patrak-5 rows show `Celebration (to confirm)` because the GR
  does not state Culture vs Celebration for those 40. Every other branch is stated by the GR.

**Read cost.** Scheme progress comes from ONE query — `responsesB where body == <officer's
body>` — not one read per scheme. A response document only exists once somebody has answered
something, so the picker costs 3 reads today and never costs 162. Verified.

Applicant-facing counts: Commissionerate 86 (culture 25 · celebration 17 · adventure 11 ·
youth board 33) · Lalit Kala 11 · Sangeet Natak 51.

**`body` follows who RUNS a scheme, not the budget head it sits under.** Patraks 8 and 10
are voted against the Sangeet Natak Akademi's head (`ART-04`) but are run by the
Commissionerate, so that is where they sit — because `body` decides which officer is
asked to fill the questionnaire.

### Feature 12 notes — correcting a wrong body or branch

43 of the branch tags are guesses, and body itself can be wrong — the officer who runs a
scheme knows better than the GR does. So an officer can report a correction from the scheme's
own screen.

**A report does not move the scheme.** It is recorded in `schemeFixes` for an admin to apply.
If an officer could reassign directly and got it wrong, the scheme would vanish from their own
list and they would have no way to find it again to undo it. A suggestion is always
recoverable; a silent move is not. The screen says so, in both languages, so nobody expects an
instant change.

**Applied corrections live in Firestore, not in the seed file.** `schemes/{schemeId}` holds an
override of `body` and/or `branch`, which the app layers on top of `js/schemes.js` at load. So
a mistake is fixed from the admin screen, with no redeploy. Applying also sets
`branchConfirmed`, which clears the "(to confirm)" mark on that scheme.

**Order of writes matters.** Applying writes the scheme override *first* and only then marks
the report handled. Reversed, a failure would leave a report marked done with the scheme never
actually moved — the one outcome nobody would notice.

**Rules.** Only an admin may write `schemes` overrides or resolve a report; an admin resolving
one may touch only `status`/`resolvedBy`/`resolvedAt`, so the officer's original wording can
never be rewritten. Officers may read back their own reports but not list everyone's.

**Shared machines.** The search box and branch selector reset when a different officer signs
in. Inheriting a colleague's search would show "Showing 0 of 85" and read as though their
schemes had gone missing.

---

### Feature 13 notes — the Part B question spec

`js/spec-b.js` holds all **58 Part B questions** (187 sub-parts, **39 marked BLOCKING**),
transcribed from the locked `Scheme Questionnaire.md`. Same shape as `spec-a.js`, so
`render.js` draws it **with no changes at all** — verified by rendering the whole of Part B
through the real engine.

**Do not reword a question here.** The wording was agreed question by question with the
department, in both languages. Fix the instrument first, then mirror it.

**Deliberate absences.** Section **B6** dissolved into Part A (A10 overlap rules; A8.4
"has double funding been caught"), so the number B6 is missing on purpose — exactly as
A4/A5/A9 are missing from `spec-a.js`. Five single questions are likewise absent, each with
its reason recorded in the instrument itself: **B4.5** (redundant with A1 + B4.4), **B5.4**
(troupe size is art-form-level, not scheme-level), **B7.7** (rejection letters are a universal
office practice → A3.5), **B8.5** (Aadhaar fully covered by B5), **B9.7** (folded into B2.8).
A future reader finding a gap in the numbering should look here before "fixing" it.

**B0.5 is the router.** Its eleven mechanism ticks decide which later blocks a scheme actually
needs. Feature 14 will read B0.5 and hide the blocks that do not apply; until then every
question is shown and the officer skips what does not apply, exactly as on paper.

**Three presentation decisions** — the instrument is unchanged, only how it is drawn:

1. **B8.6's 8×5 timing grid is eight choose-one rows**, one per stage transition. The engine's
   `table` type produces typing boxes, and "mark the usual band" has to be a choice, not free
   text. Keys are `B8.6.t1` … `B8.6.t8`.
2. **The M/O marker (B4.3, B9.1) and the A/P marker (B5.1) are the per-option write-in box** —
   the same mechanism the paper form uses: tick the document, then write M or O beside it. The
   box only appears once its option is ticked, so an untouched list stays quiet.
3. **B3.5's "no rule" ticks are a separate tick-list above the min/max grid**, so "there is no
   rule" stays distinguishable from "not answered yet". A blank cell in a grid cannot tell the
   two apart, and that difference is the whole point of the question.

**Two tables only:** B1.1 (the orders that govern the scheme — 6 rows × 3 columns) and B3.5
(min/max on event size — 4 rows × 2 columns). Everything else is ticks, choices or text.

**Answer keys are unchanged** and stay in the stable format the audit log depends on —
`B0.5.mechanism`, `B4.3.docs~aadhaar`, `B2.1.whoApplies~~star`, `B1.1.orders~r0c0`.

**Progress** counts a question answered on its first part, so an empty Part B sheet reads
0 of 58 with 39 blocking outstanding.

---

### Feature 14 notes — the Part B form and "ask only what applies"

58 questions across 148 applicant-facing schemes is a great deal of officer time, so
`js/route-b.js` sets aside the questions a scheme genuinely cannot answer.

**⭐ The rule that governs the whole file: bias towards asking.** Wrongly setting a question
aside is **invisible** — the fact is never captured and nobody ever learns it was missed.
Wrongly asking one costs the officer three seconds to skip. The two mistakes are not equally
bad, so every rule defaults to SHOWING and fires only on a clear positive answer. An
unanswered driver question sets nothing aside. Read that paragraph before adding a rule: one
line here silently removes a question from 148 questionnaires.

**Six rules, five of them transcribed rather than invented.**

| Set aside | When | Written in the instrument? |
|---|---|---|
| B4.1–B4.6 (5 questions) | B0.5 ticks only `engaged` / `provided` — the office runs its own event, so nobody applies | inferred (the one inference) |
| B2.6 | B2.1 says only individuals apply | yes — "skip if only individuals apply" |
| B5.3 | B2.1 says only individuals apply | yes — "skip for individual-only schemes" |
| B7.5 | B7.4 says an officer decides, no committee | yes — "only if a committee exists" |
| B10.2 | B10.1 says entirely at the State office | yes — "answer only if run at district level" |
| B10.3 | B10.1 says entirely at the State office | yes — same |

The one inference is deliberately narrow: it fires only when **every** ticked mechanism is
`engaged` or `provided`. Add `grant`, or even `combination`, and B4 comes straight back.
`mixed` and `don't know` never set anything aside.

**Two deliberate NON-rules.**
- **B9 is not routed away for award / pension schemes.** It looks like the obvious win, but
  B9.1 and B9.2 already offer "No — paid without any further documents (e.g. award / pension)"
  and "Not applicable (award / pension)" *as answers*. Folding the block would throw away the
  fact we actually want on record.
- **B5.2 is left alone.** Its condition is the art form (culture vs youth / sports / yoga /
  adventure), which the app does not hold anywhere. It keeps its own written skip note.

**Set aside is a fold, never a deletion.** A folded question states what was set aside, why
(naming the driver question, in both languages), how many answers are already inside it, and
carries a **Show anyway** button. A wholly folded section collapses to one card instead of a
run of identical rows.

**Answers inside a fold survive.** Correcting B0.5 after filling in B4 keeps every answer, and
the fold says "3 answer(s) already recorded here are kept, not deleted". Folding over existing
work is the one case that could read as data loss, so it is stated rather than left to trust.

**The officer can overrule us.** Any section except **B0** and **B11** can be marked "This
section does not apply". B0 is excluded because it holds B0.5, which every rule reads — the
router must never be hideable. **"Show every question"** opens every fold at once.

**Counting is routed, not flat.** The denominator is what this scheme is actually asked
("12 of 45 answered", plus "5 of the 58 questions are set aside"). Against a flat 58 a routed
scheme could never read as complete, and every scheme would sit permanently short on the
tracker.

**Redraw is narrow on purpose.** Only `B0.5.mechanism`, `B2.1.whoApplies`, `B7.4.involvement`
and `B10.1.decidedWhere` reshape the form; every other answer just repaints the counters.
Redrawing on a committed text answer would throw the officer out of the box they are typing
in. Scroll position is preserved across a redraw.

Answers and officer-marked N/A sections are saved from Feature 15 onwards.

---

### Feature 15 notes — Part B saving

One document per scheme, `responsesB/{schemeId}`. This is deliberately **the same machinery as
Part A**, not a second implementation: 2s commit-debounce, no-op guard, response and its audit
entries in one atomic `WriteBatch`, a failed write put back into `pending`, offline reported as
"Saved on this device — will sync". Three answers cost one write.

**Who may edit a scheme's sheet — anyone in the SAME OFFICE.** Approved by the user, and
deliberately *not* narrowed to the scheme's own branch: 43 of the branch tags are still
unconfirmed guesses, and a wrong tag would lock the right officer out of their own scheme with
no way back. Enforced in `firestore.rules`, not just in the client:

```
function myBody() { return get(/databases/$(db)/documents/users/$(request.auth.uid)).data.body; }
function isMyBody(id) { return isBody(id) && myBody() == id; }
```

plus `request.resource.data.scheme == schemeId` — without that a client could file one scheme's
answers under another scheme's id. The rules `get()` costs one read per response write, which is
nothing against 50,000 free reads a day and is the difference between a real boundary and a
suggestion.

**⭐ The scheme-switch trap.** Leaving a scheme flushes it under its *own* id, which happens
after `partB` has already been pointed at the next scheme. A failed write would then have
re-queued the OLD scheme's answers and the next save would have filed them under the NEW
scheme. Both handlers therefore check `partB.schemeId === id` before touching state; if the
officer has moved on, the change is dropped loudly rather than written to the wrong sheet.
**Do not remove that guard.**

**Officer-marked N/A is stored as a LIST, not a map:**

```
naSections: [ { id: 'B9', by: 'M. Malik (Assistant Director)' } ]
```

A merge write merges nested maps rather than replacing them, so a map would have kept a mark
the officer had just cleared. A list is replaced wholesale. The fold names whoever set the
section aside, so "you marked this section" is never shown to a colleague who did not.

**The picker row updates from memory on exit.** Home does not re-read when the officer merely
returns from a form (Feature 7's "0 reads returning home"), so a just-saved scheme would still
have shown as untouched — which reads as "my work did not save". `rememberPartBStatus()` writes
that one row from what is already in memory, at zero read cost.

**The audit viewer now knows both specs.** `questionText()` falls back to `SPEC_B` and resolves
the whole-section marks (`B9 (whole section)`), otherwise every per-scheme change would render
as a bare id.

**⚠️ No file uploads.** Several questions ask for a blank form, a GR copy or a UC format to be
attached. The free tier has no Cloud Storage, so those remain typed answers for now. This is
the one substantive gap left in Part B.

---

### Feature 16 notes — confirming the branch tags

43 schemes ship with a branch we guessed (26 Culture, 17 Celebration; 40 from Patrak-5 plus
P8-01/P10-01/P10-02). The tag decides which officer sees a scheme by default, so a wrong one
means the wrong person is asked to fill it in — and the per-branch tracker is meaningless until
they are settled.

**⭐ Officers CONFIRM; only an admin MOVES.** This split is the whole design. Confirming leaves
the scheme exactly where it is, so it is safe to put in an officer's hands. Moving it would make
it disappear from their own list with no way to find it again — the trap Feature 12 exists to
avoid — so reassignment still goes through a report that an admin applies.

**Officer half** — on the scheme's own screen, beside "Report a correction". The button appears
only when the branch is still a guess **and** it is the officer's own branch **and** their own
body. They are the person who would know; anyone else would be guessing again.

**Admin half** — a panel listing every unconfirmed tag with **Confirm** and **Change to…**.
There is deliberately **no "confirm all"**: one click clearing 43 guesses would destroy the
point of asking.

**The evidence line.** Each row shows which branch is actually *answering* that scheme's
questionnaire, and says plainly when that disagrees with our guess. This is why Feature 15
stores `lastEditedByBranch` (the editor's own branch, not the scheme's). It costs one query for
the whole panel — never one read per scheme — and it gets more useful every week.

**3 of the 43 are establishment lines** (`P5-31` corpus fund, `P5-32` theatre establishment,
`P5-36` publicity budget). They are hidden from officers, so no officer can ever confirm them
and no evidence will ever appear. Those rows are labelled, so an admin does not wait for input
that cannot come.

**Rules.** `schemes/{id}` gains an officer path that may write `branchConfirmed` and nothing
else — on update via `diff(resource.data).affectedKeys().hasOnly([...])`, so body and branch
cannot be touched even though a merge write carries them along.

**⚠️ Honest limit:** the rules cannot check that the scheme really is in the officer's branch —
a scheme's branch lives in `js/schemes.js`, not Firestore, so there is nothing server-side to
compare against. The client only offers the button for the officer's own branch. Server-side the
worst case is an officer confirming a tag that is not theirs, which moves nothing, hides nothing,
is stamped with their email, and an admin can overrule.

**Audit.** New `docType: 'S'` — the scheme's own record, neither a Part A nor a Part B answer.
The audit entry is written **separately and second**, on purpose: a scheme write and an audit
write pass different rules, and a rejected log row must not roll back a legitimate tag change.

---

### Feature 17 notes — progress branch by branch

The breakdown Part A could never give: Part A is one shared sheet per body, so a branch has no
percentage of its own. Part B is per scheme and schemes carry a branch, so the question finally
has an answer.

**Six groups, 148 schemes:** Culture 25 · Celebration 17 · Adventure 11 · Youth Board 33 ·
Lalit Kala 11 · Sangeet Natak 51. The **14 establishment lines are excluded** — nobody applies
for an advertising budget, and counting them would leave every branch permanently unfinishable.

**⭐ "Important questions still blank" counts only the schemes somebody has started.** Including
the untouched ones would bury the signal under 39 × every scheme nobody has opened, and
"not started" is already its own column.

**⭐ The untouched schemes are named**, behind a fold. "33 not started" gives an admin nothing to
act on; knowing *which* 33 does. Folded by default, or Youth Board's list alone would fill the
screen.

**Officers see their own branch on Home**, and only theirs. It costs nothing: it reuses the query
the scheme picker already makes, and is recomputed from memory when they come back from a scheme
— so it is correct before any read returns.

**Copy summary** puts the table on the clipboard as plain text with a TOTAL line. **If the
browser refuses clipboard access** — plain http, locked-down district machines — the text is
shown selected in a box instead. A button that silently does nothing is worse than no button.

**Read cost.** `loadAdminPartB()` loads once and renders BOTH this tracker and Feature 16's tag
panel: **3 queries for the whole admin screen, one per office, never one per scheme.** They were
separately querying the Commissionerate before, which is also how the two panels could have
disagreed on screen.

**A failed read is reported as incomplete**, never as "0 submitted" — that is the one wrong
number that would send someone chasing work already done.

