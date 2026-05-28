# Updating the Daily Programme

The daily activities and evening shows the guest app displays live in
**`programme.json`** in this folder. There are two ways to update them.

---

## Option A — In-app editor (recommended)

1. Open the guest app on a phone or laptop browser.
2. Add `#admin` to the URL (e.g. `oldpalaceresort.com/splash-entertainment/#admin`).
3. Enter the staff passcode when prompted.
4. Edit activities, evening shows, kids club, etc. using the on-screen forms.
5. Click **Preview** to see your changes in the live app.
6. Click **Download programme.json** to save the edited file to your device.
7. Send that file to whoever maintains the repo (see Option B step 3 onwards).

The editor does **not** push changes live by itself — it only generates the
file. Replacing the live file is one click for the maintainer.

---

## Option B — Direct edit on GitHub (for the maintainer)

1. Go to `github.com/seifabas33-pixel/splash-entertainment`.
2. Open `public/data/programme.json`.
3. Click the **pencil** icon (top-right of the file view) to edit in browser.
4. Paste the new JSON contents (or edit inline).
5. Scroll down → "Commit changes" → write a short message → **Commit**.
6. GitHub Pages rebuilds within ~1 min. Guests see the new programme on next
   app open.

---

## Data shape (quick reference)

```json
{
  "version": 1,
  "updated": "YYYY-MM-DD",
  "base": [ /* daily activities run every day except Saturday */ ],
  "afternoonClass": { "0": {...}, "1": {...}, ... },  // 0=Sunday, 6=Saturday
  "kidsMorning":    { "0": {...}, ... },
  "kidsAfternoon":  { "0": {...}, ... },
  "eveningShows":   [ { "dow": 0, ... }, ... ]
}
```

Each activity needs: `time` (24-h `"HH:MM"`), `title`, `location`, `cat`
(`Aqua` / `Sport` / `Kids` / `Dance` / `Games` / `Evening`), `dur` (minutes),
`desc`, `icon` (emoji).

If the JSON is malformed, the app falls back to bundled defaults — no broken
guest screens. Always validate JSON (e.g. at jsonlint.com) before committing.

---

## Translations (i18n.json)

UI strings (tab labels, buttons, info cards, etc.) live in **`i18n.json`**.
Each key has four values: `en`, `ar`, `de`, `ru`. Edit it the same way you
edit `programme.json` (via the GitHub web editor).

Activity-content translations (titles, locations, descriptions) live inside
`programme.json` as small objects:

```json
"title": { "en": "...", "ar": "...", "de": "...", "ru": "..." }
```

Use the in-app admin editor (Staff Sign-in → `#admin`) and tap the
**EN / AR / DE / RU** sub-tabs inside any activity row to edit each
language's text. The download button preserves all four language buckets.

If a translation is missing, the app falls back to English automatically.

