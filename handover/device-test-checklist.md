# 📱 Real-Device Test Checklist — Old Palace Guest App

**Live URL:** https://seifabas33-pixel.github.io/splash-entertainment/

Run this on **two real phones** before handover:
- **iPhone** → Safari (not Chrome — iOS PWA install only works in Safari)
- **Android** → Chrome

Tick each box. If something fails, note the phone + step number and send it over.

> **Tip:** First load may show a slightly older version if you've opened the app
> before. Pull-to-refresh once, or close and reopen — the service worker now
> updates code on the next load automatically.

---

## 1. First load & entrance

- [ ] Open the link — the **entrance / welcome screen** appears (not the guest app directly)
- [ ] Logos and background image load, nothing looks broken or cut off
- [ ] Tap **Enter** → the main app opens on the **Programme** tab
- [ ] Go **Home** (header house icon) → returns to the entrance screen
- [ ] Tap **Enter** again from the entrance → app opens again (buttons not "dead")

## 2. Install to home screen (PWA)

**iPhone (Safari):**
- [ ] Tap **Share** → **Add to Home Screen** → **Add**
- [ ] App icon appears on home screen with the Old Palace icon (not a blank/globe icon)
- [ ] Open from the icon → launches **full-screen** (no Safari address bar)

**Android (Chrome):**
- [ ] An **"Install app" / "Add to Home screen"** prompt or menu item appears
- [ ] Install → icon on home screen → opens full-screen

## 3. All nine tabs

Tap through each — content loads, no blank screens, no overlapping text:

- [ ] **Programme** — day selector works, activities listed, category colours show
- [ ] **My Day** — reminders toggle visible; (morning card shows if testing 6am–12pm)
- [ ] **Concierge** — request cards visible
- [ ] **Excursions** — tour cards with prices and **Book** buttons
- [ ] **Dining** — venue cards
- [ ] **Facilities** — facility cards
- [ ] **Your Stay** — welcome card (name + checkout), **WiFi card**, key facts
- [ ] **Gallery** — category pills + photo thumbnails load
- [ ] **Feedback** — feedback category cards

## 4. Weather

- [ ] **Programme** tab top → current weather strip shows (temp + condition)
- [ ] **3-day forecast** row appears below it with day cards (high/low)
- [ ] Leave the tab and come back → weather still shows (no flicker / blank)

## 5. Key interactions

- [ ] **Quick Contact FAB** (floating button) → opens the contact sheet → links work
- [ ] **Gallery** → tap a photo → **lightbox** opens full-screen
  - [ ] Swipe left/right (or arrows) moves between photos
  - [ ] Close (✕) returns to the grid
- [ ] **Concierge** → tap a request → **WhatsApp opens** with a pre-filled message
- [ ] **Excursions** → tap **Book** on a tour → WhatsApp opens with the tour pre-filled
- [ ] **Your Stay** → tap the **WiFi password** → "Copied" confirmation shows
- [ ] Header **Share** button → native share sheet opens (Android; may be hidden on iOS if unsupported — that's expected)

## 6. Languages (very important — Arabic RTL)

Use the language switcher (EN / عربي / DE / RU):

- [ ] **EN** → English everywhere
- [ ] **DE** → German text
- [ ] **RU** → Russian text
- [ ] **عربي (Arabic)** → text switches to Arabic **and the whole layout flips right-to-left**
  - [ ] Check **Programme**, **Concierge**, and **Your Stay** in Arabic — nothing
        overflows the screen edge, no text overlaps, buttons still reachable
  - [ ] Switch back to **EN** → layout flips back to left-to-right cleanly

## 7. Light / dark mode

- [ ] Tap the **theme toggle** (☾ / ☀ in the header) → switches to **light mode**
- [ ] Walk through **every tab** in light mode — text is readable, no dark-grey
      boxes on cream, inputs/cards/pills all legible
- [ ] Check **Your Stay** welcome card inputs and **WiFi card** specifically
- [ ] Toggle back to dark → everything still correct
- [ ] (Optional) Set the **phone** to light/dark at OS level, reopen the app →
      it should open in the matching theme with **no flash** of the wrong colour

## 8. Reminders / notifications

- [ ] **My Day** → enable the reminders toggle → grant permission when asked
- [ ] iOS note: notifications only work if the app was **added to the home screen
      first** and opened from the icon — test from there
- [ ] (If practical) wait for / trigger a reminder → notification appears → tapping
      it opens the app on **My Day**

## 9. Offline mode

- [ ] With the app open, turn on **Airplane mode**
- [ ] Navigate between tabs → content still loads (served from cache)
- [ ] Close and reopen the app while offline → it still opens (doesn't show the
      browser's "no internet" error)
- [ ] Turn airplane mode off → weather/data refresh on next visit

## 10. Staff & admin (do privately, not in front of guests)

- [ ] Entrance → **Staff Sign-in** → enter **`palace123`** → **Staff Dashboard**
      opens (read-only programme; **no edit fields**)
- [ ] Day tabs switch the list; today is pre-selected; evening show shows at the bottom
- [ ] **Print** button opens the print dialog; Exit returns to the entrance
- [ ] Entrance → **Staff Sign-in** → enter **`splash2026`** → full **Admin editor**
      opens (with edit fields + download)
- [ ] Wrong passcode → "Wrong passcode." message

---

## Common gotchas to watch for

- **iOS notifications** need home-screen install first — they won't prompt in the Safari tab.
- **Small Android phones** — check the Programme day selector and language grid don't get cut off on the right.
- **Arabic RTL** — the most likely place for layout bugs (text bleeding off-screen, mis-aligned icons). Test it thoroughly.
- **Stale cache** — if you see an old version, reopen once; the new service worker self-updates.
- **WhatsApp links** — confirm they open the correct number and the message text is pre-filled and readable.

---

*Anything that fails: note the **phone model + step number** (e.g. "iPhone 13, step 6 — Arabic overflows on Concierge") and send it over for a fix.*
