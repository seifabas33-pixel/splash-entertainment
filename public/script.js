// ── Activity Data (fallback — runtime values are loaded from data/programme.json)

const FALLBACK_BASE = [
  { time: '10:30', hh: '10:30', ap: 'AM', title: 'Darts Game',                location: 'Games Area',            cat: 'Games',   dur: 60,  desc: 'Darts competition for all levels — sign up with the animation team.',                icon: '🎯' },
  { time: '10:30', hh: '10:30', ap: 'AM', title: 'Morning Stretching',         location: 'Main Pool',             cat: 'Sport',   dur: 30,  desc: 'Gentle guided morning stretch session suitable for all ages.',                      icon: '🧘' },
  { time: '11:00', hh: '11:00', ap: 'AM', title: 'Arabic Lesson',              location: 'Beach Bar',             cat: 'Games',   dur: 30,  desc: 'Learn fun Arabic phrases with the animation team.',                                 icon: '🗣️' },
  { time: '11:00', hh: '11:00', ap: 'AM', title: 'Boccia Game',                location: 'Beach',                 cat: 'Games',   dur: 30,  desc: 'Classic bocce ball game on the sand — all skill levels welcome.',                   icon: '🎳' },
  { time: '11:30', hh: '11:30', ap: 'AM', title: 'Water Gym & Cocktail Games', location: 'Main Pool',             cat: 'Aqua',    dur: 60,  desc: 'Pool aerobics and fun water games with complimentary cocktails.',                   icon: '🍹' },
  { time: '15:30', hh: '3:30',  ap: 'PM', title: 'Beach Volleyball',           location: 'Beach',                 cat: 'Sport',   dur: 60,  desc: 'Teams on the sand at Sahl Hasheesh Bay — all welcome!',                            icon: '🏖️' },
  { time: '16:00', hh: '4:00',  ap: 'PM', title: 'Yoga Class',                 location: 'Old Palace Beachfront', cat: 'Sport',   dur: 45,  desc: 'Relaxing yoga session as the afternoon sun begins to dip.',                         icon: '🧘‍♀️' },
  { time: '20:30', hh: '8:30',  ap: 'PM', title: 'Kids Family Disco',          location: 'La Bonita',             cat: 'Kids',    dur: 45,  desc: 'Fun disco for the whole family — kids especially welcome!',                         icon: '🕺' },
  { time: '22:30', hh: '10:30', ap: 'PM', title: 'Disco Time',                 location: 'La Bonita',             cat: 'Evening', dur: 90,  desc: 'La Bonita comes alive — dance the night away until midnight!',                     icon: '🎶' },
];

const FALLBACK_AFTERNOON = {
  0: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  1: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
  2: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  3: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
  4: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  5: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
};

const FALLBACK_KIDS_MORNING = {
  0: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Crafts Workshop',      location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'Creative crafts, painting and drawing for ages 4–10.',                          icon: '🎨' },
  1: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Mini-Disco & Dance',   location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'Mini disco and fun dance lessons for the little ones.',                          icon: '💃' },
  2: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Coloring Stones',      location: 'Beach',              cat: 'Kids', dur: 120, desc: 'Creative stone painting and art on the beach for ages 4–10.',                    icon: '🪨' },
  3: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: La Petite Chef',       location: 'Al Kasr Restaurant', cat: 'Kids', dur: 120, desc: 'Junior cooking class with the resort chefs — ages 4–10.',                        icon: '👨‍🍳' },
  4: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Pirates & Indian Day', location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'A fun-filled themed day — pirates adventure meets Indian culture!',              icon: '🏴‍☠️' },
  5: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Mini Olympics',        location: 'Main Pool',          cat: 'Kids', dur: 120, desc: 'Mini Olympics with fun sports challenges and medals for all.',                   icon: '🏅' },
  6: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Family Day',           location: 'Kids Zone & Pool',   cat: 'Kids', dur: 120, desc: 'Special family day — a full day of activities for the whole family.',            icon: '👨‍👩‍👧‍👦' },
};

const FALLBACK_KIDS_AFTERNOON = {
  0: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Face Painting',       location: 'Kids Zone',          cat: 'Kids', dur: 90, desc: 'Afternoon face painting and drawing — creativity unleashed!',                         icon: '🎨' },
  1: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Foam Party',          location: 'Main Pool',          cat: 'Kids', dur: 90, desc: 'Afternoon foam party at the main pool — get ready to get soaked!',                    icon: '🫧' },
  2: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Beach Action',        location: 'Beach',              cat: 'Kids', dur: 90, desc: 'Beach games, sand castles and fun activities for kids.',                              icon: '🏖️' },
  3: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Cookie Making',       location: 'Al Kasr Restaurant', cat: 'Kids', dur: 90, desc: 'Cookie baking afternoon at the restaurant — all ages welcome.',                       icon: '🍪' },
  4: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Pirates & Indian',    location: 'Kids Zone',          cat: 'Kids', dur: 90, desc: 'Afternoon themed games, costumes and adventure!',                                     icon: '🏴‍☠️' },
  5: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Foam Party',          location: 'Main Pool',          cat: 'Kids', dur: 90, desc: 'Friday foam party for kids — biggest one of the week!',                              icon: '🫧' },
  6: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Family Day',          location: 'Kids Zone & Pool',   cat: 'Kids', dur: 90, desc: 'Afternoon family activities — fun for every age together.',                          icon: '👨‍👩‍👧‍👦' },
};

const FALLBACK_EVENING = [
  { dow: 0, title: 'Tanoura & Fire Show',           venue: 'La Bonita',             time: '8:45 PM', desc: 'Spectacular Tanoura spinning and fire performance — a dazzling display of traditional Egyptian folklore.' },
  { dow: 1, title: 'Oriental Folklore Night',       venue: 'Lobby Bar',             time: '9:00 PM', desc: 'Traditional Egyptian and Arabic folklore — music, belly dance, and authentic costumes.' },
  { dow: 2, title: 'White Party',                   venue: 'La Bonita',             time: '7:30 PM', desc: 'All-white dress code party with DJ, cocktails and dancing until midnight.' },
  { dow: 3, title: 'Bedouin Night — Desert Magic',  venue: 'La Bonita',             time: '8:30 PM', desc: 'Immersive Bedouin cultural experience with live Oud music, belly dance, and desert ambiance.' },
  { dow: 4, title: 'Mr. & Ms. Old Palace',          venue: 'La Bonita',             time: '9:00 PM', desc: 'Fun guest talent competition — nominate yourself or a friend to take the stage!' },
  { dow: 5, title: 'Crazy Raffle & Karaoke Night',  venue: 'Lobby Bar / La Bonita', time: '9:00 PM', desc: 'Win amazing prizes in the Crazy Raffle, then take to the mic for Karaoke!' },
  { dow: 6, title: 'Live Music & Belly Dance Gala', venue: 'Lobby Bar',             time: '7:00 PM', desc: 'Live lounge band performance followed by a spectacular belly dance gala show.' },
];

// Runtime programme — populated from data/programme.json (with fallback above).
let BASE_ACTIVITIES = FALLBACK_BASE;
let AFTERNOON_CLASS = FALLBACK_AFTERNOON;
let KIDS_MORNING    = FALLBACK_KIDS_MORNING;
let KIDS_AFTERNOON  = FALLBACK_KIDS_AFTERNOON;
let EVENING_SHOWS   = FALLBACK_EVENING;

function deriveTime(t24) {
  const [h, m] = t24.split(':').map(Number);
  const ap = h >= 12 ? 'PM' : 'AM';
  const h12 = ((h + 11) % 12) + 1;
  return { hh: `${h12}:${String(m).padStart(2, '0')}`, ap };
}

// ── i18n ─────────────────────────────────────────────────────────────────────
const SUPPORTED_LANGS = ['en', 'ar', 'de', 'ru'];
const RTL_LANGS = ['ar'];
let I18N = {};
let LANG = 'en';

function getLang() {
  const saved = localStorage.getItem('lang');
  if (saved && SUPPORTED_LANGS.includes(saved)) return saved;
  const nav = (navigator.language || 'en').slice(0, 2).toLowerCase();
  return SUPPORTED_LANGS.includes(nav) ? nav : 'en';
}

function t(key, fallback) {
  const entry = I18N[key];
  if (!entry) return fallback ?? key;
  return entry[LANG] || entry.en || fallback || key;
}

// Pick the language-appropriate value from an i18n-shaped field (object) or
// a plain string (legacy / scalar).
function pickLang(field) {
  if (field == null) return '';
  if (typeof field === 'string') return field;
  if (typeof field === 'object') return field[LANG] || field.en || Object.values(field)[0] || '';
  return String(field);
}

function applyI18n(root) {
  root = root || document;
  root.querySelectorAll('[data-i18n]').forEach(el => {
    const key = el.getAttribute('data-i18n');
    const val = t(key, el.textContent);
    // Preserve any HTML inside (e.g. <strong> in wifi.desc) only if dictionary
    // value contains markup; else use textContent for safety.
    if (val.includes('<')) el.innerHTML = val; else el.textContent = val;
  });
  root.querySelectorAll('[data-i18n-attr]').forEach(el => {
    el.getAttribute('data-i18n-attr').split(',').forEach(pair => {
      const [attr, key] = pair.split(':').map(s => s.trim());
      if (attr && key) el.setAttribute(attr, t(key));
    });
  });
}

function setLang(lang) {
  if (!SUPPORTED_LANGS.includes(lang)) lang = 'en';
  LANG = lang;
  localStorage.setItem('lang', lang);
  document.documentElement.lang = lang;
  document.documentElement.dir  = RTL_LANGS.includes(lang) ? 'rtl' : 'ltr';
  applyI18n();
  document.querySelectorAll('#lang-picker .lang-btn').forEach(b => {
    b.classList.toggle('active', b.dataset.lang === lang);
  });
  if (typeof paintCountdownRibbon === 'function') paintCountdownRibbon();
  if (typeof paintWelcomeCard === 'function') paintWelcomeCard();
}

async function loadI18n() {
  try {
    const res = await fetch('data/i18n.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    I18N = await res.json();
  } catch (e) {
    console.warn('i18n load failed, using DOM defaults.', e);
    I18N = {};
  }
}

function dayName(dow, short) {
  return t(`days.${short ? 'short' : 'full'}.${dow}`, short ? ['SUN','MON','TUE','WED','THU','FRI','SAT'][dow] : ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'][dow]);
}
function monthName(m) {
  return t(`months.${m}`, ['January','February','March','April','May','June','July','August','September','October','November','December'][m]);
}

// Normalise loaded activity — adds hh/ap (derived from 24-h time) so renderers
// don't care. Keeps title/location/desc as-is (string OR per-language object;
// renderers call pickLang() at use site).
function normaliseAct(a) {
  if (!a) return a;
  if (a.hh && a.ap) return a;
  const { hh, ap } = deriveTime(a.time);
  return { ...a, hh, ap };
}
function normaliseDayMap(m) {
  const out = {};
  Object.keys(m || {}).forEach(k => { out[k] = normaliseAct(m[k]); });
  return out;
}

function applyProgramme(p) {
  if (!p) return;
  if (Array.isArray(p.base))           BASE_ACTIVITIES = p.base.map(normaliseAct);
  if (p.afternoonClass)                AFTERNOON_CLASS = normaliseDayMap(p.afternoonClass);
  if (p.kidsMorning)                   KIDS_MORNING    = normaliseDayMap(p.kidsMorning);
  if (p.kidsAfternoon)                 KIDS_AFTERNOON  = normaliseDayMap(p.kidsAfternoon);
  if (Array.isArray(p.eveningShows))   EVENING_SHOWS   = p.eveningShows;
}

async function loadProgramme() {
  try {
    const res = await fetch('data/programme.json', { cache: 'no-cache' });
    if (!res.ok) throw new Error('fetch failed');
    const p = await res.json();
    if (!p.base || !p.eveningShows) throw new Error('bad shape');
    applyProgramme(p);
  } catch (e) {
    console.warn('Programme load failed, using bundled defaults.', e);
  }
}

// Pre-normalise fallbacks so they always have hh/ap.
BASE_ACTIVITIES = FALLBACK_BASE.map(normaliseAct);
AFTERNOON_CLASS = normaliseDayMap(FALLBACK_AFTERNOON);
KIDS_MORNING    = normaliseDayMap(FALLBACK_KIDS_MORNING);
KIDS_AFTERNOON  = normaliseDayMap(FALLBACK_KIDS_AFTERNOON);

// elegant muted category colours for luxury feel
const CAT_STYLE = {
  Aqua:    { color: '#7ec8d8' },
  Sport:   { color: '#8aacde' },
  Kids:    { color: '#d4a84e' },
  Dance:   { color: '#c988b0' },
  Games:   { color: '#c89870' },
  Evening: { color: '#b098e0' },
};

const DAYS   = ['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'];
const MONTHS = ['January','February','March','April','May','June','July','August','September','October','November','December'];

// ── Helpers ───────────────────────────────────────────────────────────────────

function getSchedule(dow) {
  const list = [KIDS_MORNING[dow], KIDS_AFTERNOON[dow]];

  if (dow !== 6) {
    list.push(...BASE_ACTIVITIES);
    if (AFTERNOON_CLASS[dow]) list.push(AFTERNOON_CLASS[dow]);

    const show = EVENING_SHOWS[dow];
    const t = show.time;
    const showTime24 =
      t.startsWith('7:')   ? '19:00' :
      t.startsWith('8:30') ? '20:30' :
      t.startsWith('8:45') ? '20:45' : '21:00';

    list.push({
      time: showTime24,
      hh: t.replace(' PM','').replace(' AM',''),
      ap: t.includes('PM') ? 'PM' : 'AM',
      title: show.title,
      location: show.venue,
      cat: 'Evening',
      dur: 75,
      desc: show.desc,
      icon: '🎭',
    });
  }

  return list.sort((a, b) => a.time.localeCompare(b.time));
}

function isNow(act, now) {
  const [h, m] = act.time.split(':').map(Number);
  const start = h * 60 + m;
  const cur   = now.getHours() * 60 + now.getMinutes();
  return cur >= start && cur < start + act.dur;
}

function fmtDate(now) {
  return `${dayName(now.getDay())}  ·  ${now.getDate()} ${monthName(now.getMonth())} ${now.getFullYear()}`;
}

// ── Entrance ──────────────────────────────────────────────────────────────────

(async function initEntrance() {
  const now = new Date();
  const dow = now.getDay();

  await Promise.all([loadI18n(), loadProgramme()]);
  setLang(getLang());

  document.getElementById('e-date').textContent = fmtDate(now);

  const renderShowPill = () => {
    const show = EVENING_SHOWS[dow];
    document.getElementById('e-show-pill').innerHTML = `
      <div class="e-show-inner">
        <span class="e-show-tag">${t('entrance.tonight')}</span>
        🎭&nbsp; ${pickLang(show.title)} &nbsp;·&nbsp; ${show.time}
      </div>
    `;
  };
  renderShowPill();

  // Language picker
  document.querySelectorAll('#lang-picker .lang-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      setLang(btn.dataset.lang);
      document.getElementById('e-date').textContent = fmtDate(new Date());
      renderShowPill();
    });
  });

  // Skip entrance for deep-link hashes (reminder click or admin route).
  if (location.hash === '#myday' || location.hash === '#admin') {
    const el = document.getElementById('entrance');
    el.style.display = 'none';
    const app = document.getElementById('app');
    app.classList.remove('hidden');
    buildApp();
    return;
  }

  // Staff sign-in: passcode prompt on entrance, then jump straight to admin.
  document.getElementById('staff-link').addEventListener('click', () => {
    const code = prompt(t('entrance.staff') + ':');
    if (code !== ADMIN_PASSCODE) {
      if (code !== null) alert('Wrong passcode.');
      return;
    }
    sessionStorage.setItem(ADMIN_SESSION, 'true');
    const el = document.getElementById('entrance');
    el.style.transition = 'opacity 0.5s ease';
    el.style.opacity = '0';
    setTimeout(() => {
      el.style.display = 'none';
      const app = document.getElementById('app');
      app.classList.remove('hidden');
      buildApp();
      openAdmin();
    }, 520);
  });

  // ── Exit: use JS transitions (more reliable than CSS class animations) ──
  document.getElementById('enter-btn').addEventListener('click', () => {
    const el = document.getElementById('entrance');
    el.style.transition = 'opacity 0.85s ease, transform 0.85s cubic-bezier(.55,0,.8,.45)';
    el.style.opacity    = '0';
    el.style.transform  = 'translateY(-48px) scale(0.98)';
    el.style.pointerEvents = 'none';

    setTimeout(() => {
      el.style.display = 'none';
      const app = document.getElementById('app');
      app.classList.remove('hidden');
      app.style.opacity = '0';
      app.style.transition = 'opacity 0.6s ease';
      requestAnimationFrame(() => { app.style.opacity = '1'; });
      buildApp();
    }, 860);
  });
})();

// ── App ───────────────────────────────────────────────────────────────────────

// Tab switching
function initTabs() {
  document.querySelectorAll('.tab-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      const target = btn.dataset.tab;
      document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
      document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
      btn.classList.add('active');
      const panel = document.getElementById('tab-' + target);
      panel.classList.remove('hidden');
      panel.classList.add('active');
      const fab = document.getElementById('qc-fab');
      if (fab) fab.classList.remove('hidden');
      if (target === 'myday') renderMyDay();
      if (target === 'concierge') renderConcierge();
      if (target === 'feedback') renderFeedback();
    });
  });
}

function goHome() {
  const app = document.getElementById('app');
  app.style.transition = 'opacity 0.5s ease';
  app.style.opacity = '0';
  setTimeout(() => {
    app.classList.add('hidden');
    app.style.opacity = '';
    app.style.transition = '';
    const entrance = document.getElementById('entrance');
    entrance.style.display = '';
    entrance.style.opacity = '0';
    entrance.style.transform = '';
    entrance.style.pointerEvents = '';
    entrance.style.transition = 'opacity 0.7s ease';
    requestAnimationFrame(() => { entrance.style.opacity = '1'; });
    setTimeout(() => { entrance.style.transition = ''; }, 750);
  }, 520);
}

document.getElementById('back-home-btn').addEventListener('click', goHome);

let activeFilter = 'All';
let selectedDow  = new Date().getDay();
let currentActs  = [];

// ── Favorites ("My Day") ───────────────────────────────────────────────────────
const FAV_KEY = 'oldpalace_favorites';

function titleKey(act) { return typeof act.title === 'object' ? (act.title.en || Object.values(act.title)[0] || '') : (act.title || ''); }
function favKey(dow, act) { return `${dow}|${act.time}|${titleKey(act)}`; }

function getFavorites() {
  try { return new Set(JSON.parse(localStorage.getItem(FAV_KEY)) || []); }
  catch { return new Set(); }
}
function saveFavorites(set) {
  try { localStorage.setItem(FAV_KEY, JSON.stringify([...set])); } catch {}
}
function isFavorite(dow, act) { return getFavorites().has(favKey(dow, act)); }
function toggleFavorite(dow, act) {
  const favs = getFavorites();
  const key = favKey(dow, act);
  favs.has(key) ? favs.delete(key) : favs.add(key);
  saveFavorites(favs);
  scheduleReminders();
  return favs.has(key);
}

// ── Reminders ──────────────────────────────────────────────────────────────────
const REMINDERS_ENABLED_KEY = 'oldpalace_reminders_enabled';
const NOTIFIED_KEY          = 'oldpalace_notified';
const REMINDER_LEAD_MS      = 15 * 60 * 1000;
const CATCHUP_WINDOW_MS     = 5 * 60 * 1000;
let reminderTimers = [];

function remindersEnabled() {
  return localStorage.getItem(REMINDERS_ENABLED_KEY) === 'true';
}
function setRemindersEnabled(on) {
  localStorage.setItem(REMINDERS_ENABLED_KEY, on ? 'true' : 'false');
}

function getNotifiedSet() {
  try { return new Set(JSON.parse(localStorage.getItem(NOTIFIED_KEY)) || []); }
  catch { return new Set(); }
}
function markNotified(key) {
  const s = getNotifiedSet();
  s.add(key);
  try { localStorage.setItem(NOTIFIED_KEY, JSON.stringify([...s])); } catch {}
}

function ymd(d) {
  const m = String(d.getMonth() + 1).padStart(2, '0');
  const day = String(d.getDate()).padStart(2, '0');
  return `${d.getFullYear()}${m}${day}`;
}
function notifyKey(date, act) { return `${ymd(date)}|${act.time}|${titleKey(act)}`; }

function activityStartDate(offset, act) {
  const d = dateForOffset(offset);
  const [h, m] = act.time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

function showReminder(act, startDate) {
  const title = `${act.icon || '⭐'} ${pickLang(act.title)}`;
  const loc   = pickLang(act.location);
  const body  = `${act.hh}${act.ap ? ' ' + act.ap : ''}${loc ? ' · ' + loc : ''}`;
  const tag   = notifyKey(startDate, act);
  if (navigator.serviceWorker && navigator.serviceWorker.controller) {
    navigator.serviceWorker.controller.postMessage({ type: 'SHOW_REMINDER', title, body, tag });
  } else if ('Notification' in window && Notification.permission === 'granted') {
    new Notification(title, { body, tag, icon: 'assets/icons/icon-192.png' });
  }
  markNotified(tag);
}

function clearReminderTimers() {
  reminderTimers.forEach(clearTimeout);
  reminderTimers = [];
}

function scheduleReminders() {
  clearReminderTimers();
  if (!remindersEnabled()) return;
  if (!('Notification' in window) || Notification.permission !== 'granted') return;

  const favs     = getFavorites();
  const notified = getNotifiedSet();
  const now      = Date.now();
  let scheduled  = 0;

  for (let offset = 0; offset < 7 && scheduled < 50; offset++) {
    const dow  = dateForOffset(offset).getDay();
    const acts = getSchedule(dow).filter(a => favs.has(favKey(dow, a)));
    for (const act of acts) {
      if (scheduled >= 50) break;
      const start   = activityStartDate(offset, act);
      const trigger = start.getTime() - REMINDER_LEAD_MS;
      const key     = notifyKey(start, act);
      if (notified.has(key)) continue;

      if (trigger <= now && start.getTime() > now - CATCHUP_WINDOW_MS) {
        showReminder(act, start);
      } else if (trigger > now) {
        const delay = Math.min(trigger - now, 2 ** 31 - 1);
        reminderTimers.push(setTimeout(() => showReminder(act, start), delay));
        scheduled++;
      }
    }
  }
}

let repaintReminderHint = () => {};

function initReminders() {
  const bar    = document.getElementById('reminders-bar');
  const toggle = document.getElementById('reminder-toggle');
  const hint   = document.getElementById('reminder-hint');
  if (!bar || !toggle || !hint) return;

  if (!('Notification' in window)) {
    hint.textContent = t('reminders.unsupported');
    bar.classList.remove('hidden');
    toggle.style.display = 'none';
    return;
  }

  bar.classList.remove('hidden');

  const paint = () => {
    const enabled = remindersEnabled() && Notification.permission === 'granted';
    toggle.classList.toggle('is-on', enabled);
    toggle.querySelector('.reminder-toggle-label').textContent =
      enabled ? t('reminders.on') : t('reminders.enable');
    if (Notification.permission === 'denied') {
      hint.textContent = t('reminders.blocked');
      hint.classList.remove('is-success');
    } else if (enabled) {
      hint.textContent = t('reminders.confirm');
      hint.classList.add('is-success');
    } else {
      hint.textContent = getFavorites().size ? t('reminders.hint') : '';
      hint.classList.remove('is-success');
    }
  };
  repaintReminderHint = paint;
  paint();

  toggle.addEventListener('click', async () => {
    if (Notification.permission === 'granted') {
      const turnOn = !remindersEnabled();
      setRemindersEnabled(turnOn);
      if (turnOn) scheduleReminders(); else clearReminderTimers();
      paint();
      return;
    }
    if (Notification.permission === 'denied') { paint(); return; }
    const res = await Notification.requestPermission();
    setRemindersEnabled(res === 'granted');
    if (res === 'granted') scheduleReminders();
    paint();
  });

  document.addEventListener('visibilitychange', () => {
    if (document.visibilityState === 'visible') scheduleReminders();
  });

  scheduleReminders();
}

// Date for a given offset from today (0 = today)
function dateForOffset(offset) {
  const d = new Date();
  d.setDate(d.getDate() + offset);
  return d;
}

function updateMydayBadge() {
  const count = getFavorites().size;
  const badge = document.getElementById('myday-count');
  if (!badge) return;
  if (count > 0) { badge.textContent = count; badge.classList.remove('hidden'); }
  else { badge.classList.add('hidden'); }
}

function buildApp() {
  const now      = new Date();
  const todayDow = now.getDay();
  selectedDow = todayDow;
  activeFilter = 'All';

  initTabs();
  document.getElementById('app-date-line').textContent = fmtDate(now).toUpperCase();

  sweepIfPastCheckout();
  buildDaySelector(now);
  renderDay(todayDow, true);
  updateMydayBadge();
  initReminders();
  initQuickContact();
  initStay();
  paintCountdownRibbon();

  if (location.hash === '#myday') {
    const tab = document.querySelector('.tab-btn[data-tab="myday"]');
    if (tab) tab.click();
  } else if (location.hash === '#admin') {
    openAdmin();
  }
}

function buildDaySelector(now) {
  const todayDow = now.getDay();
  const sel = document.getElementById('day-selector');
  sel.innerHTML = '';

  for (let offset = 0; offset < 7; offset++) {
    const d   = new Date(now);
    d.setDate(now.getDate() + offset);
    const dow     = d.getDay();
    const isToday = offset === 0;

    const pill = document.createElement('button');
    pill.className = 'day-pill' + (isToday ? ' active' : '');
    pill.innerHTML = `
      ${isToday ? `<span class="day-today-badge">${t('myday.today')}</span>` : ''}
      <span class="day-name">${dayName(dow, true)}</span>
      <span class="day-num">${d.getDate()}</span>
    `;
    pill.addEventListener('click', () => {
      selectedDow  = dow;
      activeFilter = 'All';
      sel.querySelectorAll('.day-pill').forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      renderDay(dow, dow === todayDow && offset === 0);
    });
    sel.appendChild(pill);
  }
}

function renderDay(dow, isToday) {
  const now  = new Date();
  const acts = getSchedule(dow);
  const show = EVENING_SHOWS[dow];
  currentActs = acts;

  // Happening Now — only meaningful for today
  const banner = document.getElementById('now-banner');
  const current = isToday ? acts.find(a => isNow(a, now)) : null;
  if (current) {
    banner.classList.remove('hidden');
    banner.innerHTML = `<div class="now-dot"></div><span><strong>${t('programme.happening_now')}</strong> &nbsp;—&nbsp; ${current.icon} ${pickLang(current.title)}, ${pickLang(current.location)}</span>`;
  } else {
    banner.classList.add('hidden');
    banner.innerHTML = '';
  }

  // Evening Show card
  document.getElementById('show-section').innerHTML = `
    <div class="show-card">
      <div class="show-icon">🎭</div>
      <div>
        <div class="show-badge">${isToday ? t('programme.tonight_show') : t('programme.evening_show')}</div>
        <div class="show-title">${pickLang(show.title)}</div>
        <div class="show-meta">📍 ${pickLang(show.venue)} &nbsp;&nbsp;·&nbsp;&nbsp; 🕐 ${show.time}</div>
        <div class="show-desc">${pickLang(show.desc)}</div>
      </div>
    </div>
  `;

  // Filter buttons
  const cats = ['All', ...new Set(acts.map(a => a.cat))];
  const filterBar = document.getElementById('filter-bar');
  filterBar.innerHTML = '';
  cats.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === activeFilter ? ' active' : '');
    btn.textContent = cat === 'All' ? t('programme.filter_all') : t(`cats.${cat}`, cat);
    btn.addEventListener('click', () => {
      activeFilter = cat;
      filterBar.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderGrid(currentActs, now, isToday, dow);
    });
    filterBar.appendChild(btn);
  });

  renderGrid(acts, now, isToday, dow);
}

function renderGrid(acts, now, isToday, dow) {
  const grid     = document.getElementById('activity-grid');
  const filtered = activeFilter === 'All' ? acts : acts.filter(a => a.cat === activeFilter);
  grid.innerHTML  = '';

  if (!filtered.length) {
    grid.innerHTML = `<p style="color:var(--faint);padding:0.5rem 0;font-size:0.85rem;letter-spacing:0.06em">${t('programme.no_acts')}</p>`;
    return;
  }

  filtered.forEach((act, i) => {
    const style  = CAT_STYLE[act.cat] || { color: '#aaa' };
    const isNowAct = isToday && isNow(act, now);
    const fav = isFavorite(dow, act);
    const card   = document.createElement('article');
    card.className = 'a-card' + (isNowAct ? ' now-card' : '');
    card.style.animationDelay = `${i * 0.045}s`;
    card.innerHTML = `
      <div class="a-time">
        <div class="a-time-val">${act.hh}</div>
        <div class="a-time-ampm">${act.ap}</div>
      </div>
      <div class="a-icon">${act.icon}</div>
      <div class="a-body">
        <div class="a-title">${pickLang(act.title)}</div>
        <div class="a-loc">📍 ${pickLang(act.location)}</div>
        <div class="a-desc">${pickLang(act.desc)}</div>
      </div>
      <div class="a-meta">
        <button class="a-fav${fav ? ' is-fav' : ''}" aria-label="★">${fav ? '★' : '☆'}</button>
        <span class="a-cat" style="color:${style.color};border-color:${style.color}">${t(`cats.${act.cat}`, act.cat)}</span>
        <span class="a-dur">${act.dur} ${t('programme.min')}</span>
      </div>
    `;
    const favBtn = card.querySelector('.a-fav');
    favBtn.addEventListener('click', () => {
      const nowFav = toggleFavorite(dow, act);
      favBtn.classList.toggle('is-fav', nowFav);
      favBtn.textContent = nowFav ? '★' : '☆';
      updateMydayBadge();
    });
    grid.appendChild(card);
  });
}

// Re-render the Programme grid for the currently selected day (keeps stars in sync)
function refreshProgrammeGrid() {
  const now = new Date();
  renderGrid(currentActs, now, selectedDow === now.getDay(), selectedDow);
}

function renderMyDay() {
  const container = document.getElementById('myday-content');
  const favs = getFavorites();
  container.innerHTML = '';
  repaintReminderHint();

  renderBeforeYouLeave();

  if (favs.size === 0) {
    container.innerHTML = `
      <div class="myday-empty">
        <div class="myday-empty-icon">★</div>
        <p class="myday-empty-title">${t('myday.empty_title')}</p>
        <p class="myday-empty-sub">${t('myday.empty_sub')}</p>
      </div>`;
    return;
  }

  for (let offset = 0; offset < 7; offset++) {
    const d    = dateForOffset(offset);
    const dow  = d.getDay();
    const acts = getSchedule(dow).filter(a => favs.has(favKey(dow, a)));
    if (!acts.length) continue;

    const group = document.createElement('div');
    group.className = 'myday-group';
    const label = offset === 0 ? t('myday.today') : dayName(dow);
    group.innerHTML = `
      <div class="myday-group-head">
        <span class="myday-group-day">${label}</span>
        <span class="myday-group-date">${d.getDate()} ${monthName(d.getMonth())}</span>
      </div>`;

    const list = document.createElement('div');
    list.className = 'activity-grid';
    acts.forEach((act, i) => {
      const style = CAT_STYLE[act.cat] || { color: '#aaa' };
      const card  = document.createElement('article');
      card.className = 'a-card';
      card.style.animationDelay = `${i * 0.045}s`;
      card.innerHTML = `
        <div class="a-time">
          <div class="a-time-val">${act.hh}</div>
          <div class="a-time-ampm">${act.ap}</div>
        </div>
        <div class="a-icon">${act.icon}</div>
        <div class="a-body">
          <div class="a-title">${pickLang(act.title)}</div>
          <div class="a-loc">📍 ${pickLang(act.location)}</div>
          <div class="a-desc">${pickLang(act.desc)}</div>
        </div>
        <div class="a-meta">
          <button class="a-fav is-fav" aria-label="★">★</button>
          <span class="a-cat" style="color:${style.color};border-color:${style.color}">${t(`cats.${act.cat}`, act.cat)}</span>
          <span class="a-dur">${act.dur} ${t('programme.min')}</span>
        </div>`;
      card.querySelector('.a-fav').addEventListener('click', () => {
        toggleFavorite(dow, act);
        updateMydayBadge();
        refreshProgrammeGrid();
        renderMyDay();
      });
      list.appendChild(card);
      if (offset === 0) renderSmileMeter(dow, act, list);
    });
    group.appendChild(list);
    container.appendChild(group);
  }
}

// ── PWA: service worker + install prompt ────────────────────────────────────────
if ('serviceWorker' in navigator) {
  window.addEventListener('load', () => {
    navigator.serviceWorker.register('sw.js').catch(() => {});
  });
  navigator.serviceWorker.addEventListener('message', (e) => {
    if (e.data && e.data.type === 'REMINDER_CLICK') {
      const tab = document.querySelector('.tab-btn[data-tab="myday"]');
      if (tab) tab.click();
    }
  });
}

(function initInstallPrompt() {
  let deferredPrompt = null;
  const btn = document.getElementById('install-btn');
  if (!btn) return;

  window.addEventListener('beforeinstallprompt', (e) => {
    e.preventDefault();
    deferredPrompt = e;
    btn.classList.remove('hidden');
  });

  btn.addEventListener('click', async () => {
    if (!deferredPrompt) return;
    deferredPrompt.prompt();
    await deferredPrompt.userChoice;
    deferredPrompt = null;
    btn.classList.add('hidden');
  });

  window.addEventListener('appinstalled', () => {
    deferredPrompt = null;
    btn.classList.add('hidden');
  });
})();

// ── Admin editor (#admin route, passcode-gated) ─────────────────────────────────
const ADMIN_PASSCODE = 'splash2026';
const ADMIN_SESSION  = 'oldpalace_admin_ok';
const CATS = ['Aqua', 'Sport', 'Kids', 'Dance', 'Games', 'Evening'];

let adminDraft = null;
let adminSection = 'base';
let adminDayKey  = '0';

function snapshotProgramme() {
  return {
    version: 1,
    updated: new Date().toISOString().slice(0, 10),
    base: BASE_ACTIVITIES.map(stripDerived),
    afternoonClass: stripDayMap(AFTERNOON_CLASS),
    kidsMorning:    stripDayMap(KIDS_MORNING),
    kidsAfternoon:  stripDayMap(KIDS_AFTERNOON),
    eveningShows:   EVENING_SHOWS.map(s => ({ ...s })),
  };
}
function stripDerived(a) {
  const { hh, ap, ...rest } = a;
  return rest;
}
function stripDayMap(m) {
  const out = {};
  Object.keys(m).forEach(k => { out[k] = stripDerived(m[k]); });
  return out;
}

function openAdmin() {
  const panel = document.getElementById('tab-admin');
  if (!panel) return;
  if (sessionStorage.getItem(ADMIN_SESSION) !== 'true') {
    const tries = prompt(t('entrance.staff') + ':');
    if (tries !== ADMIN_PASSCODE) { alert('Wrong passcode.'); return; }
    sessionStorage.setItem(ADMIN_SESSION, 'true');
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  panel.classList.remove('hidden');
  panel.classList.add('active');
  const fab = document.getElementById('qc-fab');
  if (fab) fab.classList.add('hidden');
  adminDraft = snapshotProgramme();
  renderAdmin();
}

function renderAdmin() {
  const panel = document.getElementById('tab-admin');
  if (!adminDraft) adminDraft = snapshotProgramme();

  const tabs = [
    { id: 'base',           label: 'Base' },
    { id: 'afternoonClass', label: 'Afternoon' },
    { id: 'kidsMorning',    label: 'Kids AM' },
    { id: 'kidsAfternoon',  label: 'Kids PM' },
    { id: 'eveningShows',   label: 'Evening Shows' },
  ];
  const needsDay = ['afternoonClass', 'kidsMorning', 'kidsAfternoon'].includes(adminSection);

  panel.innerHTML = `
    <div class="content-wrap">
      <div class="section-header">
        <h2 class="section-title">Programme Editor</h2>
        <p class="section-sub">Edit, preview, then download the updated <code>programme.json</code>.</p>
      </div>

      <div class="admin-tabs">
        ${tabs.map(t => `<button class="admin-tab${adminSection === t.id ? ' active' : ''}" data-id="${t.id}">${t.label}</button>`).join('')}
      </div>

      ${needsDay ? `
        <div class="admin-days">
          ${[0,1,2,3,4,5,6].map(i => `<button class="admin-day${String(i) === adminDayKey ? ' active' : ''}" data-dow="${i}">${dayName(i, true)}</button>`).join('')}
        </div>` : ''}

      <div id="admin-list" class="admin-list"></div>

      <div class="admin-footer">
        <button class="admin-btn admin-btn-add" id="admin-add">+ Add</button>
        <button class="admin-btn" id="admin-preview">Preview in app</button>
        <button class="admin-btn" id="admin-reset">Reset</button>
        <button class="admin-btn admin-btn-primary" id="admin-download">Download programme.json</button>
        <button class="admin-btn admin-btn-exit" id="admin-exit">Exit</button>
      </div>
    </div>
  `;

  panel.querySelectorAll('.admin-tab').forEach(b => {
    b.addEventListener('click', () => { adminSection = b.dataset.id; renderAdmin(); });
  });
  panel.querySelectorAll('.admin-day').forEach(b => {
    b.addEventListener('click', () => { adminDayKey = b.dataset.dow; renderAdminList(); });
  });
  document.getElementById('admin-add').addEventListener('click', adminAdd);
  document.getElementById('admin-preview').addEventListener('click', adminPreview);
  document.getElementById('admin-reset').addEventListener('click', adminReset);
  document.getElementById('admin-download').addEventListener('click', adminDownload);
  document.getElementById('admin-exit').addEventListener('click', () => {
    location.hash = '';
    location.reload();
  });

  renderAdminList();
}

function currentDraftRows() {
  if (adminSection === 'base')         return adminDraft.base;
  if (adminSection === 'eveningShows') return adminDraft.eveningShows;
  return [adminDraft[adminSection][adminDayKey]].filter(Boolean);
}
function setCurrentDraftRows(rows) {
  if (adminSection === 'base')         { adminDraft.base = rows; return; }
  if (adminSection === 'eveningShows') { adminDraft.eveningShows = rows; return; }
  adminDraft[adminSection][adminDayKey] = rows[0];
}

// Read/write a possibly-per-language field. Returns string for the requested lang.
function langGet(field, lang) {
  if (field == null) return '';
  if (typeof field === 'string') return lang === 'en' ? field : '';
  return field[lang] || '';
}
function langSet(field, lang, value) {
  if (field == null || typeof field === 'string') {
    return { en: typeof field === 'string' ? field : '', ar: '', de: '', ru: '', [lang]: value };
  }
  return { ...field, [lang]: value };
}

let adminRowLangs = {}; // per-row currently-selected sub-tab

function renderAdminList() {
  const list = document.getElementById('admin-list');
  if (!list) return;
  const rows = currentDraftRows();
  const isEvening = adminSection === 'eveningShows';

  if (!rows.length) {
    list.innerHTML = '<p class="admin-empty">No entry for this slot. Click + Add to create one.</p>';
    return;
  }

  const langTabs = (i, current) => `
    <div class="admin-lang-tabs">
      ${SUPPORTED_LANGS.map(l => `<button class="admin-lang-tab${l === current ? ' active' : ''}" data-row="${i}" data-lang="${l}">${l.toUpperCase()}</button>`).join('')}
    </div>`;

  list.innerHTML = rows.map((r, i) => {
    const rowLang = adminRowLangs[i] || LANG;
    const title    = langGet(r.title,    rowLang);
    const location = langGet(r.location, rowLang);
    const venue    = langGet(r.venue,    rowLang);
    const desc     = langGet(r.desc,     rowLang);
    const titleEn  = langGet(r.title, 'en') || title;

    return isEvening ? `
    <div class="admin-row" data-i="${i}">
      <div class="admin-row-head">
        <span class="admin-row-time">${dayName(r.dow)}</span>
        <span class="admin-row-title">${escapeHtml(titleEn)}</span>
        <button class="admin-row-del" data-i="${i}">✕</button>
      </div>
      ${langTabs(i, rowLang)}
      <div class="admin-form">
        <label>Day <select data-f="dow">${[0,1,2,3,4,5,6].map(j => `<option value="${j}"${j === r.dow ? ' selected' : ''}>${dayName(j)}</option>`).join('')}</select></label>
        <label>Time <input data-f="time" value="${escapeAttr(r.time)}" placeholder="8:45 PM" /></label>
        <label class="admin-wide">Title (${rowLang.toUpperCase()}) <input data-f="title" data-lang="${rowLang}" value="${escapeAttr(title)}" /></label>
        <label class="admin-wide">Venue (${rowLang.toUpperCase()}) <input data-f="venue" data-lang="${rowLang}" value="${escapeAttr(venue)}" /></label>
        <label class="admin-wide">Description (${rowLang.toUpperCase()}) <textarea data-f="desc" data-lang="${rowLang}" rows="2">${escapeHtml(desc)}</textarea></label>
      </div>
    </div>` : `
    <div class="admin-row" data-i="${i}">
      <div class="admin-row-head">
        <span class="admin-row-time">${escapeHtml(r.time)}</span>
        <span class="admin-row-title">${escapeHtml(titleEn)}</span>
        ${adminSection === 'base' ? `<button class="admin-row-del" data-i="${i}">✕</button>` : ''}
      </div>
      ${langTabs(i, rowLang)}
      <div class="admin-form">
        <label>Time (24-h) <input data-f="time" value="${escapeAttr(r.time)}" placeholder="HH:MM" /></label>
        <label>Category <select data-f="cat">${CATS.map(c => `<option${c === r.cat ? ' selected' : ''}>${c}</option>`).join('')}</select></label>
        <label>Duration (min) <input data-f="dur" type="number" min="5" max="300" value="${r.dur}" /></label>
        <label>Icon <input data-f="icon" value="${escapeAttr(r.icon || '')}" maxlength="4" /></label>
        <label class="admin-wide">Title (${rowLang.toUpperCase()}) <input data-f="title" data-lang="${rowLang}" value="${escapeAttr(title)}" /></label>
        <label class="admin-wide">Location (${rowLang.toUpperCase()}) <input data-f="location" data-lang="${rowLang}" value="${escapeAttr(location)}" /></label>
        <label class="admin-wide">Description (${rowLang.toUpperCase()}) <textarea data-f="desc" data-lang="${rowLang}" rows="2">${escapeHtml(desc)}</textarea></label>
      </div>
    </div>`;
  }).join('');

  list.querySelectorAll('.admin-lang-tab').forEach(b => {
    b.addEventListener('click', () => {
      adminRowLangs[Number(b.dataset.row)] = b.dataset.lang;
      renderAdminList();
    });
  });

  list.querySelectorAll('.admin-row').forEach(rowEl => {
    const i = Number(rowEl.dataset.i);
    rowEl.querySelectorAll('[data-f]').forEach(inp => {
      inp.addEventListener('input', () => {
        const rows2 = currentDraftRows();
        const f = inp.dataset.f;
        const lang = inp.dataset.lang;
        let v;
        if (lang) {
          v = langSet(rows2[i][f], lang, inp.value);
        } else {
          v = inp.tagName === 'SELECT' && f === 'dow' ? Number(inp.value)
            : f === 'dur' ? Number(inp.value)
            : inp.value;
        }
        rows2[i] = { ...rows2[i], [f]: v };
        setCurrentDraftRows(rows2);
      });
    });
    const del = rowEl.querySelector('.admin-row-del');
    if (del) del.addEventListener('click', () => {
      const rows2 = currentDraftRows();
      rows2.splice(i, 1);
      setCurrentDraftRows(rows2);
      delete adminRowLangs[i];
      renderAdminList();
    });
  });
}

function blankLang(text) { return { en: text, ar: text, de: text, ru: text }; }

function adminAdd() {
  const rows = currentDraftRows();
  let blank;
  if (adminSection === 'eveningShows') {
    blank = { dow: 0, title: blankLang('New Show'), venue: blankLang(''), time: '8:00 PM', desc: blankLang('') };
  } else {
    blank = { time: '12:00', title: blankLang('New Activity'), location: blankLang(''), cat: 'Games', dur: 30, desc: blankLang(''), icon: '✨' };
  }
  if (['afternoonClass','kidsMorning','kidsAfternoon'].includes(adminSection)) {
    adminDraft[adminSection][adminDayKey] = blank;
  } else {
    rows.push(blank);
    setCurrentDraftRows(rows);
  }
  renderAdminList();
}

function adminPreview() {
  applyProgramme({
    base: adminDraft.base.map(normaliseAct),
    afternoonClass: normaliseDayMap(adminDraft.afternoonClass),
    kidsMorning:    normaliseDayMap(adminDraft.kidsMorning),
    kidsAfternoon:  normaliseDayMap(adminDraft.kidsAfternoon),
    eveningShows:   adminDraft.eveningShows,
  });
  // Re-render programme tab with the new data and switch to it.
  buildDaySelector(new Date());
  renderDay(selectedDow, selectedDow === new Date().getDay());
  document.querySelector('.tab-btn[data-tab="programme"]').click();
}

async function adminReset() {
  await loadProgramme();
  adminDraft = snapshotProgramme();
  renderAdmin();
}

function adminDownload() {
  const json = JSON.stringify(adminDraft, null, 2);
  const blob = new Blob([json], { type: 'application/json' });
  const url  = URL.createObjectURL(blob);
  const a    = document.createElement('a');
  a.href = url;
  a.download = 'programme.json';
  document.body.appendChild(a);
  a.click();
  document.body.removeChild(a);
  URL.revokeObjectURL(url);
}

function escapeHtml(s) {
  return String(s ?? '').replace(/[&<>"']/g, c => ({ '&':'&amp;', '<':'&lt;', '>':'&gt;', '"':'&quot;', "'":'&#39;' }[c]));
}
function escapeAttr(s) { return escapeHtml(s); }

// ── Quick Contact (FAB + sheet) ────────────────────────────────────────────────
function initQuickContact() {
  const fab      = document.getElementById('qc-fab');
  const sheet    = document.getElementById('qc-sheet');
  const closeBtn = document.getElementById('qc-close');
  const backdrop = document.getElementById('qc-backdrop');
  if (!fab || !sheet || !closeBtn || !backdrop) return;

  const open  = () => { sheet.classList.remove('hidden'); sheet.setAttribute('aria-hidden', 'false'); };
  const close = () => { sheet.classList.add('hidden');    sheet.setAttribute('aria-hidden', 'true');  };

  fab.addEventListener('click', open);
  closeBtn.addEventListener('click', close);
  backdrop.addEventListener('click', close);
  document.addEventListener('keydown', (e) => {
    if (e.key === 'Escape' && !sheet.classList.contains('hidden')) close();
  });

  const openConcierge = document.getElementById('qc-open-concierge');
  if (openConcierge) {
    openConcierge.addEventListener('click', () => {
      close();
      const tab = document.querySelector('.tab-btn[data-tab="concierge"]');
      if (tab) tab.click();
    });
  }
}

// ── Concierge (one-tap service requests) ──────────────────────────────────────
const WA_NUMBER = '201283110400';
const ROOM_KEY  = 'oldpalace_room';

const SPA_TREATMENTS = ['massage', 'facial', 'bodywrap', 'couples', 'hammam'];

// Request catalogue. `fields` describes the optional form schema.
// Each field: { id, labelKey, type, options?, required? }
const REQUESTS = [
  // Housekeeping — direct send
  { id: 'towels',          group: 'housekeeping', icon: '🧖' },
  { id: 'linens',          group: 'housekeeping', icon: '🛏' },
  { id: 'pillows',         group: 'housekeeping', icon: '☁' },
  // In-room — direct send
  { id: 'minibar',         group: 'inroom', icon: '🍹' },
  { id: 'menu',            group: 'inroom', icon: '📜' },
  // Reservations — form
  { id: 'gazebo',          group: 'reservations', icon: '🕯', fields: [
      { id: 'date',  labelKey: 'concierge.form.date',  type: 'date',   required: true },
      { id: 'time',  labelKey: 'concierge.form.time',  type: 'time',   required: true },
      { id: 'party', labelKey: 'concierge.form.party', type: 'number', min: 1, max: 20, value: 2, required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  { id: 'cucina',          group: 'reservations', icon: '🍝', fields: [
      { id: 'date',  labelKey: 'concierge.form.date',  type: 'date',   required: true },
      { id: 'time',  labelKey: 'concierge.form.time',  type: 'time',   required: true },
      { id: 'party', labelKey: 'concierge.form.party', type: 'number', min: 1, max: 20, value: 2, required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  { id: 'spa',             group: 'reservations', icon: '💆', fields: [
      { id: 'treatment', labelKey: 'concierge.form.treatment', type: 'select',
        options: SPA_TREATMENTS.map(s => ({ value: s, labelKey: `concierge.spa.${s}` })), required: true },
      { id: 'date',  labelKey: 'concierge.form.date',  type: 'date',   required: true },
      { id: 'time',  labelKey: 'concierge.form.time',  type: 'time',   required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  // Transport — form
  { id: 'taxi_airport',    group: 'transport', icon: '✈', fields: [
      { id: 'date', labelKey: 'concierge.form.date', type: 'date', required: true },
      { id: 'time', labelKey: 'concierge.form.time', type: 'time', required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  { id: 'taxi_hurghada',   group: 'transport', icon: '🚖', fields: [
      { id: 'date', labelKey: 'concierge.form.date', type: 'date', required: true },
      { id: 'time', labelKey: 'concierge.form.time', type: 'time', required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  // Stay — form
  { id: 'late_checkout',   group: 'stay', icon: '🕒', fields: [
      { id: 'time', labelKey: 'concierge.form.checkout_time', type: 'time', value: '14:00', required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  { id: 'early_checkin',   group: 'stay', icon: '🛬', fields: [
      { id: 'date', labelKey: 'concierge.form.date', type: 'date', required: true },
      { id: 'time', labelKey: 'concierge.form.checkin_time', type: 'time', value: '11:00', required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  { id: 'wakeup',          group: 'stay', icon: '⏰', fields: [
      { id: 'time', labelKey: 'concierge.form.time', type: 'time', value: '07:00', required: true },
      { id: 'notes', labelKey: 'concierge.form.notes', type: 'textarea' },
  ]},
  // General — free-form
  { id: 'custom',          group: 'general', icon: '✉', fields: [
      { id: 'message', labelKey: 'concierge.form.message', type: 'textarea', required: true, rows: 4 },
  ]},
];

const REQUEST_GROUPS = ['housekeeping', 'inroom', 'reservations', 'transport', 'stay', 'general'];

function getRoomNumber() { return localStorage.getItem(ROOM_KEY) || ''; }
function setRoomNumber(v) {
  v = (v || '').trim();
  if (v) localStorage.setItem(ROOM_KEY, v); else localStorage.removeItem(ROOM_KEY);
}

function paintRoomPill() {
  const txt = document.getElementById('concierge-room-text');
  if (!txt) return;
  const r = getRoomNumber();
  txt.textContent = r ? `${t('concierge.room_label')}: ${r}` : t('concierge.set_room');
}

function renderConcierge() {
  paintRoomPill();
  const pill = document.getElementById('concierge-room-pill');
  if (pill && !pill.dataset.bound) {
    pill.dataset.bound = '1';
    pill.addEventListener('click', () => {
      const v = prompt(t('concierge.ask_room'), getRoomNumber());
      if (v !== null) { setRoomNumber(v); paintRoomPill(); }
    });
  }

  const grid = document.getElementById('concierge-grid');
  if (!grid) return;
  grid.innerHTML = '';

  REQUEST_GROUPS.forEach(group => {
    const groupReqs = REQUESTS.filter(r => r.group === group);
    if (!groupReqs.length) return;

    const head = document.createElement('h3');
    head.className = 'concierge-group-head';
    head.textContent = t(`concierge.group.${group}`);
    grid.appendChild(head);

    const row = document.createElement('div');
    row.className = 'concierge-cards';
    groupReqs.forEach(req => {
      const card = document.createElement('button');
      card.type = 'button';
      card.className = 'concierge-card';
      const isForm = Array.isArray(req.fields) && req.fields.length > 0;
      card.innerHTML = `
        <span class="concierge-card-icon">${req.icon}</span>
        <span class="concierge-card-body">
          <span class="concierge-card-title">${t(`concierge.req.${req.id}.title`)}</span>
          <span class="concierge-card-sub">${t(`concierge.req.${req.id}.sub`)}</span>
        </span>
        <span class="concierge-card-arrow">${isForm ? '✎' : '⌁'}</span>
      `;
      card.addEventListener('click', () => {
        if (isForm) openRequestForm(req); else sendRequest(req, {});
      });
      row.appendChild(card);
    });
    grid.appendChild(row);
  });
}

function openRequestForm(req) {
  const modal = document.getElementById('req-modal');
  const titleEl = document.getElementById('req-modal-title');
  const fields = document.getElementById('req-form-fields');
  const form = document.getElementById('req-form');
  if (!modal || !titleEl || !fields || !form) return;

  titleEl.textContent = t(`concierge.req.${req.id}.title`);
  fields.innerHTML = req.fields.map(f => {
    const label = t(f.labelKey);
    if (f.type === 'textarea') {
      return `<label class="req-field">${label}<textarea name="${f.id}" rows="${f.rows || 2}" ${f.required ? 'required' : ''}></textarea></label>`;
    }
    if (f.type === 'select') {
      const opts = f.options.map(o => `<option value="${o.value}">${t(o.labelKey)}</option>`).join('');
      return `<label class="req-field">${label}<select name="${f.id}" ${f.required ? 'required' : ''}>${opts}</select></label>`;
    }
    const min = f.min != null ? `min="${f.min}"` : '';
    const max = f.max != null ? `max="${f.max}"` : '';
    const val = f.value != null ? `value="${f.value}"` : '';
    return `<label class="req-field">${label}<input type="${f.type}" name="${f.id}" ${min} ${max} ${val} ${f.required ? 'required' : ''} /></label>`;
  }).join('');

  // Default date inputs to today
  fields.querySelectorAll('input[type="date"]').forEach(inp => {
    if (!inp.value) {
      const d = new Date();
      inp.value = `${d.getFullYear()}-${String(d.getMonth()+1).padStart(2,'0')}-${String(d.getDate()).padStart(2,'0')}`;
    }
  });

  applyI18n(modal);
  modal.classList.remove('hidden');

  const close = () => modal.classList.add('hidden');
  document.getElementById('req-modal-close').onclick = close;
  document.getElementById('req-backdrop').onclick = close;
  document.getElementById('req-cancel').onclick = close;

  form.onsubmit = (e) => {
    e.preventDefault();
    const values = {};
    new FormData(form).forEach((v, k) => { values[k] = v; });
    sendRequest(req, values);
    close();
  };
}

function buildMessage(req, values) {
  const lines = [];
  lines.push(`*${t('concierge.tmpl.header')}*`);
  const room = getRoomNumber();
  lines.push(`${t('concierge.tmpl.room')}: ${room || t('concierge.tmpl.no_room')}`);
  lines.push(`${t('concierge.tmpl.request')}: ${t(`concierge.req.${req.id}.title`)}`);
  (req.fields || []).forEach(f => {
    const v = values[f.id];
    if (!v) return;
    const label = t(f.labelKey);
    let display = v;
    if (f.type === 'select') {
      const opt = f.options.find(o => o.value === v);
      if (opt) display = t(opt.labelKey);
    } else if (f.type === 'number' && f.id === 'party') {
      display = `${v} ${t('concierge.form.party_unit')}`;
    }
    lines.push(`${label}: ${display}`);
  });
  lines.push('');
  lines.push(`— ${t('concierge.tmpl.footer')}`);
  return lines.join('\n');
}

function sendRequest(req, values) {
  // If room not set and request is direct-send, ask once.
  if (!getRoomNumber()) {
    const v = prompt(t('concierge.ask_room'));
    if (v !== null) setRoomNumber(v);
    paintRoomPill();
  }
  const msg = buildMessage(req, values);
  const url = `https://wa.me/${WA_NUMBER}?text=${encodeURIComponent(msg)}`;
  window.open(url, '_blank', 'noopener');
  // Auto-mark matching "Before You Leave" suggestion as tried
  const triedMap = { gazebo: 'dining_gazebo', cucina: 'dining_cucina', spa: 'spa_visit' };
  if (triedMap[req.id]) markTried(triedMap[req.id]);
}

// ── Feedback & Ratings ───────────────────────────────────────────────────────

// Same as WA_NUMBER for now — swap with management-only WhatsApp number when available.
const WA_MANAGEMENT = '201283110400';
const FB_SENT_PREFIX = 'fb_react_';

const FEEDBACK_CATEGORIES = [
  { id: 'room' }, { id: 'food' }, { id: 'pool' },
  { id: 'spa'  }, { id: 'activities' }, { id: 'staff' },
];

function renderFeedback() {
  const grid = document.getElementById('feedback-grid');
  if (!grid || grid.dataset.bound) return;
  grid.dataset.bound = '1';
  FEEDBACK_CATEGORIES.forEach(cat => {
    const card = grid.querySelector(`.feedback-cat-card[data-cat="${cat.id}"]`);
    if (card) card.addEventListener('click', () => openFeedbackForm(cat));
  });
}

function openFeedbackForm(cat) {
  const modal     = document.getElementById('req-modal');
  const titleEl   = document.getElementById('req-modal-title');
  const fieldsEl  = document.getElementById('req-form-fields');
  const form      = document.getElementById('req-form');
  const submitBtn = form ? form.querySelector('[type="submit"]') : null;
  if (!modal || !titleEl || !fieldsEl || !form) return;

  titleEl.textContent = t(`feedback.cat.${cat.id}.title`);
  if (submitBtn) submitBtn.dataset.i18n = 'feedback.send_button';

  let rating = 0;
  fieldsEl.innerHTML = `
    <div class="fb-star-row" id="fb-stars">
      ${[1,2,3,4,5].map(n => `<button type="button" class="fb-star" data-val="${n}" aria-label="${n}">★</button>`).join('')}
    </div>
    <p class="fb-star-hint" id="fb-star-hint">${t('feedback.tap_stars')}</p>
    <label class="req-field">${t('feedback.form.stood_out')}<input type="text" name="stood" /></label>
    <label class="req-field">${t('feedback.form.notes')}<textarea name="notes" rows="2"></textarea></label>
  `;

  const starsEl = fieldsEl.querySelector('#fb-stars');
  const hintEl  = fieldsEl.querySelector('#fb-star-hint');
  fieldsEl.querySelectorAll('.fb-star').forEach(btn => {
    btn.addEventListener('click', () => {
      rating = parseInt(btn.dataset.val);
      starsEl.dataset.rating = rating;
      fieldsEl.querySelectorAll('.fb-star').forEach(s =>
        s.classList.toggle('active', parseInt(s.dataset.val) <= rating)
      );
      hintEl.textContent = rating > 0 && rating <= 3
        ? t('feedback.low_rating_hint')
        : t('feedback.tap_stars');
    });
  });

  applyI18n(modal);
  modal.classList.remove('hidden');

  const close = () => {
    modal.classList.add('hidden');
    if (submitBtn) { submitBtn.dataset.i18n = 'concierge.send_button'; applyI18n(submitBtn); }
  };
  document.getElementById('req-modal-close').onclick = close;
  document.getElementById('req-backdrop').onclick   = close;
  document.getElementById('req-cancel').onclick     = close;

  form.onsubmit = (e) => {
    e.preventDefault();
    if (!rating) { alert(t('feedback.no_rating')); return; }
    const stood = form.querySelector('[name="stood"]').value;
    const notes = form.querySelector('[name="notes"]').value;
    sendFeedback(cat, rating, stood, notes);
    close();
  };
}

function buildFeedbackMessage(cat, rating, stood, notes) {
  const stars = '★'.repeat(rating) + '☆'.repeat(5 - rating);
  const lines = [
    `*${t('feedback.tmpl.header')}*`,
    `${t('concierge.tmpl.room')}: ${getRoomNumber() || t('concierge.tmpl.no_room')}`,
    `${t('feedback.tmpl.category')}: ${t(`feedback.cat.${cat.id}.title`)}`,
    `${t('feedback.tmpl.rating')}: ${stars} (${rating}/5)`,
  ];
  if (stood) lines.push(`${t('feedback.tmpl.stood_out')}: ${stood}`);
  if (notes) lines.push(`${t('feedback.tmpl.notes')}: ${notes}`);
  lines.push('', `— ${t('concierge.tmpl.footer')}`);
  return lines.join('\n');
}

function sendFeedback(cat, rating, stood, notes) {
  const msg = buildFeedbackMessage(cat, rating, stood, notes);
  window.open(`https://wa.me/${WA_MANAGEMENT}?text=${encodeURIComponent(msg)}`, '_blank', 'noopener');
}

// Smile-meter (inline after completed today's activities in My Day)
function smileKey(dow, act) { return `${FB_SENT_PREFIX}${favKey(dow, act)}`; }

function activityEnded(act) {
  const [hh, mm] = act.time.split(':').map(Number);
  const now = new Date();
  const end = new Date(now.getFullYear(), now.getMonth(), now.getDate(), hh, mm + (act.dur || 0));
  return now >= end;
}

function renderSmileMeter(dow, act, container) {
  if (localStorage.getItem(smileKey(dow, act))) return;
  if (!activityEnded(act)) return;

  const bar = document.createElement('div');
  bar.className = 'fb-smile-bar';
  bar.innerHTML = `
    <span class="fb-smile-label">${t('feedback.smile_prompt')}</span>
    <button class="fb-smile-btn" type="button" data-react="neg" aria-label="${t('feedback.smile_neg')}">😞</button>
    <button class="fb-smile-btn" type="button" data-react="neu" aria-label="${t('feedback.smile_neu')}">😐</button>
    <button class="fb-smile-btn" type="button" data-react="pos" aria-label="${t('feedback.smile_pos')}">😊</button>
  `;
  bar.querySelectorAll('.fb-smile-btn').forEach(btn => {
    btn.addEventListener('click', () => {
      sendActivityReaction(dow, act, btn.dataset.react);
      bar.remove();
    });
  });
  container.appendChild(bar);
}

function sendActivityReaction(dow, act, react) {
  localStorage.setItem(smileKey(dow, act), react);
  const emoji = { neg: '😞', neu: '😐', pos: '😊' }[react] || react;
  const label = { neg: t('feedback.smile_neg'), neu: t('feedback.smile_neu'), pos: t('feedback.smile_pos') }[react] || react;
  const lines = [
    `*${t('feedback.tmpl.activity_header')}*`,
    `${t('concierge.tmpl.room')}: ${getRoomNumber() || t('concierge.tmpl.no_room')}`,
    `${t('feedback.tmpl.activity')}: ${pickLang(act.title)} (${act.time})`,
    `${t('feedback.tmpl.reaction')}: ${emoji} ${label}`,
    '', `— ${t('concierge.tmpl.footer')}`,
  ];
  window.open(`https://wa.me/${WA_MANAGEMENT}?text=${encodeURIComponent(lines.join('\n'))}`, '_blank', 'noopener');
}

// ── Holiday Countdown & "Before You Leave" Suggestions ───────────────────────

const CHECKOUT_KEY = 'oldpalace_checkout';
const TRIED_KEY = 'oldpalace_tried';
const DISMISS_KEY = 'oldpalace_countdown_dismissed';
const SKIPPED_KEY = 'oldpalace_welcome_skipped';

function todayYmd() {
  const d = new Date();
  return ymd(d);
}

function getCheckout() { return localStorage.getItem(CHECKOUT_KEY) || ''; }
function setCheckout(v) {
  if (v) localStorage.setItem(CHECKOUT_KEY, v);
  else   localStorage.removeItem(CHECKOUT_KEY);
}

function getTried() {
  try { return new Set(JSON.parse(localStorage.getItem(TRIED_KEY)) || []); }
  catch { return new Set(); }
}
function saveTried(set) {
  try { localStorage.setItem(TRIED_KEY, JSON.stringify([...set])); } catch {}
}
function markTried(id) {
  const s = getTried(); s.add(id); saveTried(s);
  renderBeforeYouLeave();
}

// Nights left = whole days from today's midnight to checkout midnight.
function nightsLeft() {
  const c = getCheckout();
  if (!c) return null;
  const today = new Date(); today.setHours(0, 0, 0, 0);
  const out = new Date(c + 'T00:00:00');
  const ms = out.getTime() - today.getTime();
  return Math.round(ms / 86400000);
}

// Wipe guest state the morning after checkout so the next guest opens fresh.
function sweepIfPastCheckout() {
  const n = nightsLeft();
  if (n === null) return;
  if (n < 0) {
    localStorage.removeItem(CHECKOUT_KEY);
    localStorage.removeItem(TRIED_KEY);
    localStorage.removeItem(DISMISS_KEY);
    localStorage.removeItem(SKIPPED_KEY);
    localStorage.removeItem(ROOM_KEY);
    localStorage.removeItem(FAV_KEY);
    // Clear smile-meter "already sent" flags
    Object.keys(localStorage).filter(k => k.startsWith(FB_SENT_PREFIX)).forEach(k => localStorage.removeItem(k));
  }
}

// ── Countdown ribbon ────────────────────────────────────────────────────────

function paintCountdownRibbon() {
  const el = document.getElementById('countdown-ribbon');
  if (!el) return;
  const n = nightsLeft();
  if (n === null || n < 0) { el.classList.add('hidden'); el.innerHTML = ''; return; }

  const dismissed = localStorage.getItem(DISMISS_KEY) === todayYmd();
  if (dismissed) { el.classList.add('hidden'); el.innerHTML = ''; return; }

  el.classList.remove('hidden');
  el.classList.toggle('countdown-farewell', n === 0);

  if (n === 0) {
    el.innerHTML = `
      <span class="countdown-text">${t('stay.ribbon.last_day')}</span>
      <button type="button" class="countdown-review-btn" id="countdown-review-btn">${t('stay.ribbon.leave_review')}</button>
      <button type="button" class="countdown-dismiss" id="countdown-dismiss" aria-label="${t('stay.ribbon.dismiss')}">×</button>
    `;
    document.getElementById('countdown-review-btn').addEventListener('click', () => {
      const tab = document.querySelector('.tab-btn[data-tab="feedback"]');
      if (tab) tab.click();
    });
  } else {
    const key = n >= 5 ? 'stay.ribbon.welcome' : 'stay.ribbon.days_left';
    el.innerHTML = `
      <span class="countdown-text">${t(key).replace('{n}', n)}</span>
      <button type="button" class="countdown-dismiss" id="countdown-dismiss" aria-label="${t('stay.ribbon.dismiss')}">×</button>
    `;
  }
  const dismissBtn = document.getElementById('countdown-dismiss');
  if (dismissBtn) dismissBtn.addEventListener('click', () => {
    localStorage.setItem(DISMISS_KEY, todayYmd());
    paintCountdownRibbon();
  });
}

// ── Welcome card (one-time checkout date prompt) ────────────────────────────

function paintWelcomeCard() {
  const card = document.getElementById('welcome-card');
  if (!card) return;
  const skipped = localStorage.getItem(SKIPPED_KEY) === '1';
  const hasCheckout = !!getCheckout();
  if (hasCheckout || skipped) { card.classList.add('hidden'); return; }
  card.classList.remove('hidden');
  applyI18n(card);
  const input = document.getElementById('welcome-checkout-input');
  if (input && !input.value) {
    const tomorrow = new Date(); tomorrow.setDate(tomorrow.getDate() + 5);
    input.min = todayYmd();
    input.value = ymd(tomorrow);
  }
}

function initStay() {
  paintWelcomeCard();
  const saveBtn = document.getElementById('welcome-checkout-save');
  const skipBtn = document.getElementById('welcome-checkout-skip');
  const input = document.getElementById('welcome-checkout-input');
  if (saveBtn && !saveBtn.dataset.bound) {
    saveBtn.dataset.bound = '1';
    saveBtn.addEventListener('click', () => {
      const v = (input && input.value || '').trim();
      if (!v) return;
      setCheckout(v);
      paintWelcomeCard();
      paintCountdownRibbon();
      renderBeforeYouLeave();
    });
  }
  if (skipBtn && !skipBtn.dataset.bound) {
    skipBtn.dataset.bound = '1';
    skipBtn.addEventListener('click', () => {
      localStorage.setItem(SKIPPED_KEY, '1');
      paintWelcomeCard();
    });
  }
}

// ── Suggestion engine ───────────────────────────────────────────────────────

const DINING_VENUES = [
  { id: 'dining_gazebo', icon: '🕯', nameKey: 'stay.sugg.gazebo',  reqId: 'gazebo' },
  { id: 'dining_cucina', icon: '🍝', nameKey: 'stay.sugg.cucina',  reqId: 'cucina' },
];
const SPA_SUGG = { id: 'spa_visit', icon: '💆', nameKey: 'stay.sugg.spa', reqId: 'spa' };

function uniqueAfternoonClassesAhead(daysAhead) {
  // Returns list of { dow, act, chancesLeft } for distinct titles in the next N days.
  const seen = new Map();
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const act = AFTERNOON_CLASS[dow];
    if (!act) continue;
    const k = titleKey(act);
    if (!seen.has(k)) seen.set(k, { dow, act, dates: [] });
    seen.get(k).dates.push(new Date(d));
  }
  return [...seen.values()].map(v => ({ dow: v.dow, act: v.act, chancesLeft: v.dates.length }));
}

function uniqueEveningShowsAhead(daysAhead) {
  const seen = new Map();
  for (let i = 0; i <= daysAhead; i++) {
    const d = new Date(); d.setDate(d.getDate() + i);
    const dow = d.getDay();
    const show = EVENING_SHOWS[dow];
    if (!show) continue;
    const k = typeof show.title === 'object' ? (show.title.en || '') : show.title;
    if (!seen.has(k)) seen.set(k, { dow, show, count: 0 });
    seen.get(k).count++;
  }
  return [...seen.values()].map(v => ({ dow: v.dow, show: v.show, chancesLeft: v.count }));
}

function computeSuggestions() {
  const n = nightsLeft();
  if (n === null || n < 0) return [];
  const daysAhead = Math.min(n, 6);
  const tried = getTried();
  const favs = getFavorites();
  const out = [];

  // 1. Evening shows not favorited
  uniqueEveningShowsAhead(daysAhead).forEach(({ dow, show, chancesLeft }) => {
    const id = `show_${dow}`;
    if (tried.has(id)) return;
    // Check if favorited any of the upcoming instances
    const showActKey = (() => {
      const t = typeof show.title === 'object' ? (show.title.en || '') : show.title;
      return t;
    })();
    let favored = false;
    for (let i = 0; i <= daysAhead; i++) {
      const d = new Date(); d.setDate(d.getDate() + i);
      const ddow = d.getDay();
      if (ddow !== dow) continue;
      const sched = getSchedule(ddow);
      const showAct = sched.find(a => a.cat === 'Evening' && titleKey(a) === showActKey);
      if (showAct && favs.has(favKey(ddow, showAct))) { favored = true; break; }
    }
    if (favored) return;
    out.push({
      id, type: 'show', icon: '🎭', chancesLeft,
      title: pickLang(show.title),
      reason: chancesLeft === 1 ? t('stay.reason.one_chance') : t('stay.reason.n_chances').replace('{n}', chancesLeft),
      actionKey: 'stay.action.show_in_programme',
      onAction: () => {
        const tab = document.querySelector('.tab-btn[data-tab="programme"]');
        if (tab) tab.click();
        selectedDow = dow;
        renderDay(dow, dow === new Date().getDay());
      },
    });
  });

  // 2. Unique afternoon classes not favorited
  uniqueAfternoonClassesAhead(daysAhead).forEach(({ dow, act, chancesLeft }) => {
    const id = `class_${titleKey(act)}`;
    if (tried.has(id)) return;
    if (favs.has(favKey(dow, act))) return;
    out.push({
      id, type: 'class', icon: act.icon || '✨', chancesLeft,
      title: pickLang(act.title),
      reason: chancesLeft === 1 ? t('stay.reason.one_chance') : t('stay.reason.n_chances').replace('{n}', chancesLeft),
      actionKey: 'stay.action.show_in_programme',
      onAction: () => {
        const tab = document.querySelector('.tab-btn[data-tab="programme"]');
        if (tab) tab.click();
        selectedDow = dow;
        renderDay(dow, dow === new Date().getDay());
      },
    });
  });

  // 3. Dining venues not yet booked
  DINING_VENUES.forEach(v => {
    if (tried.has(v.id)) return;
    out.push({
      id: v.id, type: 'dining', icon: v.icon, chancesLeft: 99,
      title: t(v.nameKey),
      reason: t('stay.reason.not_tried'),
      actionKey: 'stay.action.book_concierge',
      onAction: () => {
        const tab = document.querySelector('.tab-btn[data-tab="concierge"]');
        if (tab) tab.click();
        const req = REQUESTS.find(r => r.id === v.reqId);
        if (req) setTimeout(() => openRequestForm(req), 80);
      },
    });
  });

  // 4. Spa
  if (!tried.has(SPA_SUGG.id)) {
    out.push({
      id: SPA_SUGG.id, type: 'spa', icon: SPA_SUGG.icon, chancesLeft: 99,
      title: t(SPA_SUGG.nameKey),
      reason: t('stay.reason.not_tried'),
      actionKey: 'stay.action.book_concierge',
      onAction: () => {
        const tab = document.querySelector('.tab-btn[data-tab="concierge"]');
        if (tab) tab.click();
        const req = REQUESTS.find(r => r.id === SPA_SUGG.reqId);
        if (req) setTimeout(() => openRequestForm(req), 80);
      },
    });
  }

  // Rank: scarcity first (1 chance left → top), then category order (already arranged).
  out.sort((a, b) => a.chancesLeft - b.chancesLeft);
  return out.slice(0, 6);
}

// ── "Before You Leave" section ──────────────────────────────────────────────

function renderBeforeYouLeave() {
  const wrap = document.getElementById('before-you-leave');
  if (!wrap) return;
  const n = nightsLeft();
  if (n === null || n < 0) { wrap.classList.add('hidden'); wrap.innerHTML = ''; return; }

  // Last day → farewell variant
  if (n === 0) {
    wrap.classList.remove('hidden');
    wrap.innerHTML = `
      <div class="byl-head">
        <h3 class="byl-title">${t('stay.farewell_title')}</h3>
      </div>
      <button type="button" class="suggestion-card byl-farewell-card" id="byl-farewell">
        <span class="suggestion-icon">💌</span>
        <span class="suggestion-body">
          <span class="suggestion-title">${t('stay.farewell_card_title')}</span>
          <span class="suggestion-reason">${t('stay.farewell_card_sub')}</span>
        </span>
        <span class="suggestion-arrow">›</span>
      </button>
    `;
    const btn = document.getElementById('byl-farewell');
    if (btn) btn.addEventListener('click', () => {
      const tab = document.querySelector('.tab-btn[data-tab="feedback"]');
      if (tab) tab.click();
    });
    return;
  }

  if (n > 5) { wrap.classList.add('hidden'); wrap.innerHTML = ''; return; }

  const suggestions = computeSuggestions();
  if (!suggestions.length) { wrap.classList.add('hidden'); wrap.innerHTML = ''; return; }

  wrap.classList.remove('hidden');
  const subText = n === 1 ? t('stay.byl_sub_one') : t('stay.byl_sub_n').replace('{n}', n);
  wrap.innerHTML = `
    <div class="byl-head">
      <h3 class="byl-title">🧳 ${t('stay.byl_title')}</h3>
      <p class="byl-sub">${subText}</p>
    </div>
    <div class="byl-list"></div>
  `;
  const list = wrap.querySelector('.byl-list');
  suggestions.forEach(s => {
    const card = document.createElement('div');
    card.className = 'suggestion-card';
    const scarcity = s.chancesLeft === 1
      ? `<span class="suggestion-scarcity">${t('stay.scarcity.one')}</span>`
      : '';
    card.innerHTML = `
      <span class="suggestion-icon">${s.icon}</span>
      <span class="suggestion-body">
        <span class="suggestion-title">${s.title} ${scarcity}</span>
        <span class="suggestion-reason">${s.reason}</span>
      </span>
      <span class="suggestion-actions">
        <button type="button" class="suggestion-action-primary">${t(s.actionKey)}</button>
        <button type="button" class="suggestion-done" aria-label="${t('stay.mark_done')}" title="${t('stay.mark_done')}">✓</button>
      </span>
    `;
    card.querySelector('.suggestion-action-primary').addEventListener('click', s.onAction);
    card.querySelector('.suggestion-done').addEventListener('click', () => markTried(s.id));
    list.appendChild(card);
  });
}
