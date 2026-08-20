# Running it on your own computer

You do **not** have to deploy anything to try the app. There are two ways to run it on your
own PC, and you can do both before you touch Firebase or GitHub.

---

## Way 1 — Demo mode (no setup at all, 30 seconds)

Best for: seeing the whole thing yourself, and showing it to the Commissioner or to officers.

**Nothing is saved.** It is a working copy of the real app with a pretend database inside your
browser. Close or refresh the page and everything goes back to the start. A red bar at the
bottom says so, in both languages, and cannot be dismissed — so nobody can mistake it for the
real thing.

### Steps

1. Open **Command Prompt** (press the Windows key, type `cmd`, press Enter).
2. Copy this in and press Enter:

```bash
cd "C:\Users\MOHINI MALIK\OneDrive\Desktop\CM Fellowship\cm-scheme-questionnaire"
```

3. Then this:

```bash
python -m http.server 8000
```

4. Leave that window open. Open your browser and go to:

```
http://localhost:8000/?demo=1
```

That is the whole thing. You land straight on the Home screen as a Culture-branch Assistant
Director, with a little work already filled in so the progress screens are not empty.

**What to try**
- Open a scheme and answer **B0.5** with *"Artist engaged & paid"* only — watch the five
  "how to apply" questions fold away and the counter drop from 58 to 53. Press **Show anyway**
  to bring them back.
- Answer a few questions, press **Save & exit**, then reopen the scheme — your answers come back.
- Press **Admin** to see progress branch by branch, the 43 branch tags waiting to be confirmed,
  and the audit log.
- Press **Copy summary** on the branch tracker and paste it into Notepad.

**To stop it:** go back to the Command Prompt window and press `Ctrl + C`.

> The `?demo=1` on the end is what switches demo mode on. Without it — plain
> `http://localhost:8000/` — you get the real app, which will say "Setup pending" until you
> have done the Firebase steps below.

---

## Way 2 — The real app, running locally (Firebase, but no GitHub yet)

Best for: checking that saving, sign-in and the security rules genuinely work before you
publish anything. Answers really are saved, and they are the same answers you will see later
on the live site.

1. Do **steps 1 to 6** of `DEPLOY.md` — the Firebase half. Stop before the GitHub part.
2. Start the server exactly as above (`python -m http.server 8000`).
3. Go to **`http://localhost:8000/`** — no `?demo=1` this time.

Google sign-in works on `localhost` straight away; Firebase allows it by default, so you do
**not** need the Authorized-domains step yet. That one only matters once the site is on a real
web address.

When you are happy, do steps 7 to 9 of `DEPLOY.md` to put it online.

---

## If something does not work

**"python is not recognised"** — Python is not on this PC's command path. Try `py -m http.server 8000`
instead. If that also fails, tell me and I will give you another way.

**"Address already in use"** — something else is on port 8000. Use a different number, e.g.
`python -m http.server 8080`, and open `http://localhost:8080/?demo=1`.

**The page says "Setup pending"** — that is the real app telling you Firebase is not configured
yet. Either add `?demo=1` to the address, or do the Firebase steps in `DEPLOY.md`.

**Do not open the files by double-clicking `index.html`.** Browsers block parts of a page opened
that way, and the app will not work. It has to be served, which is what the `python` command
above does.
