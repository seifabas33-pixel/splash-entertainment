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

// Normalise loaded activity — adds hh/ap if missing so renderers don't care.
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
  return `${DAYS[now.getDay()]}  ·  ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
}

// ── Entrance ──────────────────────────────────────────────────────────────────

(async function initEntrance() {
  const now = new Date();
  const dow = now.getDay();

  document.getElementById('e-date').textContent = fmtDate(now);

  await loadProgramme();

  const show = EVENING_SHOWS[dow];
  document.getElementById('e-show-pill').innerHTML = `
    <div class="e-show-inner">
      <span class="e-show-tag">Tonight</span>
      🎭&nbsp; ${show.title} &nbsp;·&nbsp; ${show.time}
    </div>
  `;

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
    const code = prompt('Staff passcode:');
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
      if (target === 'myday') renderMyDay();
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

function favKey(dow, act) { return `${dow}|${act.time}|${act.title}`; }

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
function notifyKey(date, act) { return `${ymd(date)}|${act.time}|${act.title}`; }

function activityStartDate(offset, act) {
  const d = dateForOffset(offset);
  const [h, m] = act.time.split(':').map(Number);
  d.setHours(h, m, 0, 0);
  return d;
}

function showReminder(act, startDate) {
  const title = `${act.icon || '⭐'} ${act.title}`;
  const body  = `Starts at ${act.hh}${act.ap ? ' ' + act.ap : ''}${act.location ? ' · ' + act.location : ''}`;
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
    hint.textContent = 'Reminders not supported on this device.';
    bar.classList.remove('hidden');
    toggle.style.display = 'none';
    return;
  }

  bar.classList.remove('hidden');

  const paint = () => {
    const enabled = remindersEnabled() && Notification.permission === 'granted';
    toggle.classList.toggle('is-on', enabled);
    toggle.querySelector('.reminder-toggle-label').textContent =
      enabled ? 'Reminders on' : 'Enable reminders';
    if (Notification.permission === 'denied') {
      hint.textContent = 'Notifications blocked — enable them in your browser settings.';
      hint.classList.remove('is-success');
    } else if (enabled) {
      hint.textContent = "We'll ping you 15 min before each starred show.";
      hint.classList.add('is-success');
    } else {
      hint.textContent = getFavorites().size
        ? 'Turn on reminders to get pinged 15 min before each show.'
        : '';
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

  buildDaySelector(now);
  renderDay(todayDow, true);
  updateMydayBadge();
  initReminders();

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
      ${isToday ? '<span class="day-today-badge">Today</span>' : ''}
      <span class="day-name">${DAYS[dow].slice(0, 3).toUpperCase()}</span>
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
    banner.innerHTML = `<div class="now-dot"></div><span><strong>Happening Now</strong> &nbsp;—&nbsp; ${current.icon} ${current.title}, ${current.location}</span>`;
  } else {
    banner.classList.add('hidden');
    banner.innerHTML = '';
  }

  // Evening Show card
  document.getElementById('show-section').innerHTML = `
    <div class="show-card">
      <div class="show-icon">🎭</div>
      <div>
        <div class="show-badge">${isToday ? "Tonight's Show" : 'Evening Show'}</div>
        <div class="show-title">${show.title}</div>
        <div class="show-meta">📍 ${show.venue} &nbsp;&nbsp;·&nbsp;&nbsp; 🕐 ${show.time}</div>
        <div class="show-desc">${show.desc}</div>
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
    btn.textContent = cat;
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
    grid.innerHTML = '<p style="color:var(--faint);padding:0.5rem 0;font-size:0.85rem;letter-spacing:0.06em">No activities in this category on this day.</p>';
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
        <div class="a-title">${act.title}</div>
        <div class="a-loc">📍 ${act.location}</div>
        <div class="a-desc">${act.desc}</div>
      </div>
      <div class="a-meta">
        <button class="a-fav${fav ? ' is-fav' : ''}" title="Add to My Day" aria-label="Add to My Day">${fav ? '★' : '☆'}</button>
        <span class="a-cat" style="color:${style.color};border-color:${style.color}">${act.cat}</span>
        <span class="a-dur">${act.dur} min</span>
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

  if (favs.size === 0) {
    container.innerHTML = `
      <div class="myday-empty">
        <div class="myday-empty-icon">★</div>
        <p class="myday-empty-title">Your day is a blank canvas</p>
        <p class="myday-empty-sub">Browse the Programme and tap the ☆ star on any activity to build your personal itinerary.</p>
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
    const label = offset === 0 ? 'Today' : DAYS[dow];
    group.innerHTML = `
      <div class="myday-group-head">
        <span class="myday-group-day">${label}</span>
        <span class="myday-group-date">${d.getDate()} ${MONTHS[d.getMonth()]}</span>
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
          <div class="a-title">${act.title}</div>
          <div class="a-loc">📍 ${act.location}</div>
          <div class="a-desc">${act.desc}</div>
        </div>
        <div class="a-meta">
          <button class="a-fav is-fav" title="Remove from My Day" aria-label="Remove from My Day">★</button>
          <span class="a-cat" style="color:${style.color};border-color:${style.color}">${act.cat}</span>
          <span class="a-dur">${act.dur} min</span>
        </div>`;
      card.querySelector('.a-fav').addEventListener('click', () => {
        toggleFavorite(dow, act);
        updateMydayBadge();
        refreshProgrammeGrid();
        renderMyDay();
      });
      list.appendChild(card);
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
    const tries = prompt('Staff passcode:');
    if (tries !== ADMIN_PASSCODE) { alert('Wrong passcode.'); return; }
    sessionStorage.setItem(ADMIN_SESSION, 'true');
  }
  document.querySelectorAll('.tab-btn').forEach(b => b.classList.remove('active'));
  document.querySelectorAll('.tab-panel').forEach(p => { p.classList.remove('active'); p.classList.add('hidden'); });
  panel.classList.remove('hidden');
  panel.classList.add('active');
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
          ${DAYS.map((d, i) => `<button class="admin-day${String(i) === adminDayKey ? ' active' : ''}" data-dow="${i}">${d.slice(0,3)}</button>`).join('')}
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

function renderAdminList() {
  const list = document.getElementById('admin-list');
  if (!list) return;
  const rows = currentDraftRows();
  const isEvening = adminSection === 'eveningShows';

  if (!rows.length) {
    list.innerHTML = '<p class="admin-empty">No entry for this slot. Click + Add to create one.</p>';
    return;
  }

  list.innerHTML = rows.map((r, i) => isEvening ? `
    <div class="admin-row" data-i="${i}">
      <div class="admin-row-head">
        <span class="admin-row-time">${DAYS[r.dow]}</span>
        <span class="admin-row-title">${escapeHtml(r.title)}</span>
        <button class="admin-row-del" data-i="${i}">✕</button>
      </div>
      <div class="admin-form">
        <label>Day <select data-f="dow">${DAYS.map((d, j) => `<option value="${j}"${j === r.dow ? ' selected' : ''}>${d}</option>`).join('')}</select></label>
        <label>Title <input data-f="title" value="${escapeAttr(r.title)}" /></label>
        <label>Venue <input data-f="venue" value="${escapeAttr(r.venue)}" /></label>
        <label>Time <input data-f="time" value="${escapeAttr(r.time)}" placeholder="8:45 PM" /></label>
        <label class="admin-wide">Description <textarea data-f="desc" rows="2">${escapeHtml(r.desc)}</textarea></label>
      </div>
    </div>` : `
    <div class="admin-row" data-i="${i}">
      <div class="admin-row-head">
        <span class="admin-row-time">${escapeHtml(r.time)}</span>
        <span class="admin-row-title">${escapeHtml(r.title)}</span>
        ${adminSection === 'base' ? `<button class="admin-row-del" data-i="${i}">✕</button>` : ''}
      </div>
      <div class="admin-form">
        <label>Time (24-h) <input data-f="time" value="${escapeAttr(r.time)}" placeholder="HH:MM" /></label>
        <label>Title <input data-f="title" value="${escapeAttr(r.title)}" /></label>
        <label>Location <input data-f="location" value="${escapeAttr(r.location)}" /></label>
        <label>Category <select data-f="cat">${CATS.map(c => `<option${c === r.cat ? ' selected' : ''}>${c}</option>`).join('')}</select></label>
        <label>Duration (min) <input data-f="dur" type="number" min="5" max="300" value="${r.dur}" /></label>
        <label>Icon <input data-f="icon" value="${escapeAttr(r.icon || '')}" maxlength="4" /></label>
        <label class="admin-wide">Description <textarea data-f="desc" rows="2">${escapeHtml(r.desc)}</textarea></label>
      </div>
    </div>`).join('');

  list.querySelectorAll('.admin-row').forEach(rowEl => {
    const i = Number(rowEl.dataset.i);
    rowEl.querySelectorAll('[data-f]').forEach(inp => {
      inp.addEventListener('input', () => {
        const rows2 = currentDraftRows();
        const v = inp.tagName === 'SELECT' && inp.dataset.f === 'dow' ? Number(inp.value)
                : inp.dataset.f === 'dur' ? Number(inp.value)
                : inp.value;
        rows2[i] = { ...rows2[i], [inp.dataset.f]: v };
        setCurrentDraftRows(rows2);
      });
    });
    const del = rowEl.querySelector('.admin-row-del');
    if (del) del.addEventListener('click', () => {
      const rows2 = currentDraftRows();
      rows2.splice(i, 1);
      setCurrentDraftRows(rows2);
      renderAdminList();
    });
  });
}

function adminAdd() {
  const rows = currentDraftRows();
  let blank;
  if (adminSection === 'eveningShows') {
    blank = { dow: 0, title: 'New Show', venue: '', time: '8:00 PM', desc: '' };
  } else {
    blank = { time: '12:00', title: 'New Activity', location: '', cat: 'Games', dur: 30, desc: '', icon: '✨' };
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
