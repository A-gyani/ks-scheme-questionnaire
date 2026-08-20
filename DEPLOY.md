# Putting the questionnaire online — step by step

Written for someone who has never used Firebase. Follow it in order. It takes about
20 minutes. Nothing here costs money, and nothing asks for a card.

You need two free accounts: a **Google account** (you have one) and a **GitHub account**.

---

## Part 1 — Create the database (Firebase)

Firebase is Google's service that will store the answers and handle sign-in.

### 1. Make a new project
1. Go to **https://console.firebase.google.com**
2. Click **Create a project** (or **Add project**).
3. Name it something like `cm-scheme-questionnaire`.
4. When it offers **Google Analytics**, switch it **off**. You don't need it.
5. Click **Create project**, wait, then **Continue**.

> Make a **new** project. Don't reuse the fellowship salary portal — keeping the
> questionnaire's data separate means one can never affect the other.

### 2. Turn on Google sign-in
1. Left menu → **Build** → **Authentication** → **Get started**.
2. Under **Sign-in method**, click **Google**.
3. Turn the **Enable** switch on.
4. Pick your email as the **support email**.
5. **Save**.

### 3. Create the database
1. Left menu → **Build** → **Firestore Database** → **Create database**.
2. Choose **Production mode**. (Not test mode — test mode lets anyone on the internet
   read and write your data, and it silently stops working after 30 days.)
3. For location choose **asia-south1 (Mumbai)**. It is closest to Gujarat and keeps the
   data inside India, which matters if anyone ever asks where it is stored.
4. Click **Enable**.

> The location **cannot be changed later**. The rest can.

### 4. Copy your project's settings into the app
1. Click the **gear icon** (top left) → **Project settings**.
2. Scroll to **Your apps** → click the **web icon** `</>`.
3. Nickname it `questionnaire`. Do **not** tick Firebase Hosting. Click **Register app**.
4. You'll see a block of code containing `apiKey`, `authDomain`, `projectId`, `appId`.
5. Open the file **`js/firebase-config.js`** in this folder and replace the four
   `PASTE_…` placeholders with the values shown. Keep the quote marks.

> These values are **not secret** — every visitor's browser downloads them. Your data is
> protected by the rules in the next step, not by hiding these.

### 5. Publish the security rules
This is the step that actually protects the data. Don't skip it.

1. **Firestore Database** → **Rules** tab.
2. Delete everything in the box.
3. Open **`firestore.rules`** from this folder, copy all of it, paste it in.
4. Click **Publish**.

### 6. Make yourself the admin
1. **Firestore Database** → **Data** tab → **Start collection**.
2. Collection ID: `admins` → **Next**.
3. Document ID: **your email address**, exactly — `cmfellow2025.ysca@gmail.com`
4. Add no fields at all. Just **Save**.

> Being listed here is what unlocks the tracker and audit log. To add another admin later,
> add another document with their email as the ID.

---

## Part 2 — Put the site online (GitHub Pages)

### 7. Create the repository
1. Go to **https://github.com/new**
2. Repository name: `cm-scheme-questionnaire`
3. Choose **Private** if you prefer — GitHub Pages works either way on a free account.
4. **Create repository**, then follow GitHub's instructions to upload this folder.
   The simplest route is the **"uploading an existing file"** link on that page: drag in
   everything from this folder.

### 8. Switch Pages on
1. In the repository → **Settings** → **Pages** (left menu).
2. Under **Source**, choose **Deploy from a branch**.
3. Branch: **main**, folder: **/ (root)**. **Save**.
4. Wait 1–2 minutes. The page will show your address, like
   `https://<your-username>.github.io/cm-scheme-questionnaire/`

### 9. Let that address use your sign-in — easy to miss
Without this, sign-in fails with "not authorised".

1. Back in Firebase → **Authentication** → **Settings** tab → **Authorized domains**.
2. **Add domain** → type `<your-username>.github.io` → **Add**.

---

## Part 3 — Check it actually works

Open your new address and go through this list. If something fails, the app tells you what
is wrong in both languages.

| # | Check | What should happen |
|---|---|---|
| 1 | Open the page | Sign-in screen, not "Setup pending". If it says Setup pending, step 4 didn't save. |
| 2 | Sign in with Google | Account chooser appears, then the profile screen |
| 3 | Fill in the profile | Office, name, rank; branch appears **only** for the Commissionerate |
| 4 | Save it | Lands on Home, greeting shows your name and rank |
| 5 | Open Part A | 25 questions, English and Gujarati together |
| 6 | Tick something | Tag at top: "Saving…" then "Saved ✓" within ~3 seconds |
| 7 | Close the tab, reopen, sign in | Your answer is still there |
| 8 | Click **Admin** | Tracker shows all three offices; audit log shows your change with your name |
| 9 | **Turn off wi-fi**, tick another answer | Tag says "Saved on this device — will sync" |
| 10 | Turn wi-fi back on, refresh | The answer is saved properly |

### Then check Part B — the per-scheme half

| # | Check | What should happen |
|---|---|---|
| 11 | Home → scroll to **Part B** | Your branch's schemes are listed, and a line shows how far your branch has got |
| 12 | Open any scheme | The questions appear, and the counter reads "0 of 58" |
| 13 | Answer **B0.5** with "Artist engaged & paid" only | The five "how to apply" questions fold away, and the counter drops to 53 |
| 14 | Press **Show anyway** on that fold | They come back |
| 15 | Answer a couple of questions, press **Save & exit** | The scheme now shows "In progress" in the list |
| 16 | Reopen the same scheme | Your answers are still there |
| 17 | Press **Submit this scheme** | It warns about unanswered important questions, then marks it Submitted |
| 18 | On a scheme marked "(to confirm)" | A **"Yes — confirm this branch"** button appears (only for your own branch) |
| 19 | **Admin** → Part B by branch | Six rows, adding up to 148 schemes |
| 20 | **Admin** → Copy summary | The figures land on your clipboard as plain text |

### One more check I could not do for you

The offline/installable part could not be tested on my machine — my test browser blocks it.
Please confirm it on the real site:

1. Open the site in Chrome.
2. Press **F12** → **Application** tab → **Service Workers**.
3. It should say **activated and is running**.

If it does not, everything still works — you simply lose the offline shell. Tell me and
I'll look at it.

---

## What to tell the officers

Send them the address and three sentences:

> Open the link, sign in with your Google account, and fill in your name, rank and branch.
> **Part A** is answered once for the whole office — anyone can add to it. **Part B** is one
> questionnaire per scheme; open the schemes in your branch and fill them in. Everything
> saves by itself, so you can stop and come back whenever you like.

---

## Afterwards

**To add the rank lists** (still owed): open `js/app.js`, find `RANKS:`, and fill in the
arrays. Officers who already typed their rank keep it and can switch to a listed one.

**When you change any file:** upload it to GitHub, and also open `service-worker.js` and
increase the version number on the `CACHE` line by one (it currently reads `csq-shell-v9`,
so make it `v10`). Browsers hold on to the old files otherwise, and officers would keep
seeing the old version.

**To watch your free usage:** Firebase console → **Usage and billing**. You are limited to
50,000 reads and 20,000 writes a day.

- A fully completed **Part A** costs roughly **200 writes**.
- A fully completed **Part B scheme** costs roughly **400 writes**.

So about **50 whole schemes a day** across everyone before it gets tight — far more than
anyone will do. It would only become a question if several officers did bulk data entry on
the same day.

**If sign-in ever fails for an officer**, it is almost always step 9 — the domain was not
added, or you changed the repository name and the address changed with it.

**If saving ever fails** — an officer sees "Not saved — will retry" and it never clears —
the usual cause is an out-of-date copy of the rules. Redo **step 5**: copy
`firestore.rules` again and press Publish. The rules file has changed several times during
the build, and the console keeps whatever was pasted last, not what is in the folder.
