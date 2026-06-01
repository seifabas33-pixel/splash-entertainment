# 🛎 Staff Guide — Editing the Old Palace Guest App

This app shows guests the daily programme, Wi-Fi, excursions, dining and more.
**You can update most of it yourself** — no developer needed.

**App link:** https://seifabas33-pixel.github.io/splash-entertainment/

There are two sign-ins:

| Sign-in | Passcode | What it does |
|---|---|---|
| **Staff Dashboard** | `palace123` | **Read-only** daily programme — check the schedule, print it. Safe, nothing can be changed. |
| **Admin Editor** | `splash2026` | **Edit** the programme, Wi-Fi & contacts, and excursions. Keep this passcode private. |

---

## A. Just want to *see* today's programme? (Staff Dashboard)

1. Open the app link.
2. On the welcome screen tap **Staff Sign-in**.
3. Enter **`palace123`**.
4. You'll see the full week's programme. Tap a day tab to switch days.
5. Tap **🖨 Print** to print the day's schedule. Tap **Exit** when done.

That's it — this view can't change anything, so use it freely.

---

## B. Want to *change* something? (Admin Editor)

Editing has two parts: **(1) edit in the app & download a file**, then
**(2) upload that file to GitHub** so the change goes live for guests.

### Step 1 — Edit and download

1. Open the app → **Staff Sign-in** → enter **`splash2026`**.
2. At the top, pick what you want to edit:
   - **📅 Programme** — daily activities & evening shows
   - **🛎 Resort Info** — Wi-Fi names/passwords & phone numbers
   - **🤿 Excursions** — tours, prices, descriptions
3. Change the fields you need. For text that guests see in different languages,
   fill the **EN / AR / DE / RU** tabs (at minimum fill **EN**).
4. Tap the **Download** button at the bottom
   (e.g. *"Download programme.json"*). A file saves to your device.

> 📌 Remember the file name — `programme.json`, `resort-info.json`, or
> `excursions.json`. You'll replace the file with the exact same name in Step 2.

### Step 2 — Upload to GitHub (this is what makes it go live)

1. Go to the repository on GitHub:
   **https://github.com/seifabas33-pixel/splash-entertainment**
2. **Switch to the `gh-pages` branch** — click the branch dropdown (it usually
   says `main`) and choose **`gh-pages`**. *This is important — the live app
   runs from this branch.*
3. Open the **`data`** folder.
4. Click the file you're replacing (e.g. `programme.json`).
5. Click the **pencil ✏️ (Edit)** icon → select all the text → delete it →
   open your downloaded file in a text editor, copy everything, and paste it in.
   *(Or use **Add file → Upload files**, drag in your downloaded file, and let it
   overwrite the existing one.)*
6. Scroll down, write a short note like *"Update programme for this week"*, and
   click **Commit changes** (keep "commit directly to `gh-pages`" selected).

### Step 3 — Check it worked

1. Wait about **1 minute** for GitHub to publish.
2. Open the app and **reload** (close & reopen, or pull down to refresh).
3. Your change should now show. Done! ✅

---

## What each editor controls

- **📅 Programme** → the activities and evening shows guests see on the
  **Programme** and **My Day** tabs, per day of the week.
- **🛎 Resort Info** → the **Wi-Fi** card (network name + password) and the
  **phone numbers** (reception, dining, WhatsApp) used across the app.
- **🤿 Excursions** → the tour cards on the **Excursions** tab (title, price,
  description, duration). Guests tap **Book** and it opens WhatsApp pre-filled.

---

## ⚠️ Golden rules

- **Always edit on the `gh-pages` branch.** Editing any other branch won't change
  what guests see.
- **Keep the file name identical** — don't rename `programme.json` to anything else.
- **Don't delete commas or quotes** when pasting JSON. If the app shows nothing
  after an edit, the file probably has a typo — re-download a fresh copy from the
  Admin Editor and try again.
- **Keep `splash2026` private.** Give staff `palace123` (read-only) instead.
- If anything breaks, the previous version is always safe in GitHub's history —
  nothing is ever truly lost.

---

*Questions or something won't update? Send the file name + what you changed and
we'll sort it out.*
