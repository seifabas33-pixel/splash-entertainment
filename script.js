// ── Activity Data ─────────────────────────────────────────────────────────────

const BASE_ACTIVITIES = [
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

const AFTERNOON_CLASS = {
  0: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  1: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
  2: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  3: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
  4: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Fitness Class', location: 'Main Pool', cat: 'Sport', dur: 60, desc: 'High-energy fitness class at the pool deck.',               icon: '💪' },
  5: { time: '15:30', hh: '3:30', ap: 'PM', title: 'Dance Class',   location: 'Main Pool', cat: 'Dance', dur: 60, desc: 'Fun dance class by the pool with the animation team.',        icon: '💃' },
};

const KIDS_MORNING = {
  0: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Crafts Workshop',      location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'Creative crafts, painting and drawing for ages 4–10.',                          icon: '🎨' },
  1: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Mini-Disco & Dance',   location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'Mini disco and fun dance lessons for the little ones.',                          icon: '💃' },
  2: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Coloring Stones',      location: 'Beach',              cat: 'Kids', dur: 120, desc: 'Creative stone painting and art on the beach for ages 4–10.',                    icon: '🪨' },
  3: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: La Petite Chef',       location: 'Al Kasr Restaurant', cat: 'Kids', dur: 120, desc: 'Junior cooking class with the resort chefs — ages 4–10.',                        icon: '👨‍🍳' },
  4: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Pirates & Indian Day', location: 'Kids Zone',          cat: 'Kids', dur: 120, desc: 'A fun-filled themed day — pirates adventure meets Indian culture!',              icon: '🏴‍☠️' },
  5: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Mini Olympics',        location: 'Main Pool',          cat: 'Kids', dur: 120, desc: 'Mini Olympics with fun sports challenges and medals for all.',                   icon: '🏅' },
  6: { time: '10:00', hh: '10:00', ap: 'AM', title: 'Kids Club: Family Day',           location: 'Kids Zone & Pool',   cat: 'Kids', dur: 120, desc: 'Special family day — a full day of activities for the whole family.',            icon: '👨‍👩‍👧‍👦' },
};

const KIDS_AFTERNOON = {
  0: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Face Painting',       location: 'Kids Zone',          cat: 'Kids', dur: 90, desc: 'Afternoon face painting and drawing — creativity unleashed!',                         icon: '🎨' },
  1: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Foam Party',          location: 'Main Pool',          cat: 'Kids', dur: 90, desc: 'Afternoon foam party at the main pool — get ready to get soaked!',                    icon: '🫧' },
  2: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Beach Action',        location: 'Beach',              cat: 'Kids', dur: 90, desc: 'Beach games, sand castles and fun activities for kids.',                              icon: '🏖️' },
  3: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Cookie Making',       location: 'Al Kasr Restaurant', cat: 'Kids', dur: 90, desc: 'Cookie baking afternoon at the restaurant — all ages welcome.',                       icon: '🍪' },
  4: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Pirates & Indian',    location: 'Kids Zone',          cat: 'Kids', dur: 90, desc: 'Afternoon themed games, costumes and adventure!',                                     icon: '🏴‍☠️' },
  5: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Foam Party',          location: 'Main Pool',          cat: 'Kids', dur: 90, desc: 'Friday foam party for kids — biggest one of the week!',                              icon: '🫧' },
  6: { time: '15:00', hh: '3:00', ap: 'PM', title: 'Kids Club: Family Day',          location: 'Kids Zone & Pool',   cat: 'Kids', dur: 90, desc: 'Afternoon family activities — fun for every age together.',                          icon: '👨‍👩‍👧‍👦' },
};

const EVENING_SHOWS = [
  { dow: 0, title: 'Tanoura & Fire Show',           venue: 'La Bonita',             time: '8:45 PM', desc: 'Spectacular Tanoura spinning and fire performance — a dazzling display of traditional Egyptian folklore.' },
  { dow: 1, title: 'Oriental Folklore Night',       venue: 'Lobby Bar',             time: '9:00 PM', desc: 'Traditional Egyptian and Arabic folklore — music, belly dance, and authentic costumes.' },
  { dow: 2, title: 'White Party',                   venue: 'La Bonita',             time: '7:30 PM', desc: 'All-white dress code party with DJ, cocktails and dancing until midnight.' },
  { dow: 3, title: 'Bedouin Night — Desert Magic',  venue: 'La Bonita',             time: '8:30 PM', desc: 'Immersive Bedouin cultural experience with live Oud music, belly dance, and desert ambiance.' },
  { dow: 4, title: 'Mr. & Ms. Old Palace',          venue: 'La Bonita',             time: '9:00 PM', desc: 'Fun guest talent competition — nominate yourself or a friend to take the stage!' },
  { dow: 5, title: 'Crazy Raffle & Karaoke Night',  venue: 'Lobby Bar / La Bonita', time: '9:00 PM', desc: 'Win amazing prizes in the Crazy Raffle, then take to the mic for Karaoke!' },
  { dow: 6, title: 'Live Music & Belly Dance Gala', venue: 'Lobby Bar',             time: '7:00 PM', desc: 'Live lounge band performance followed by a spectacular belly dance gala show.' },
];

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

(function initEntrance() {
  const now = new Date();
  const dow = now.getDay();

  document.getElementById('e-date').textContent = fmtDate(now);

  const show = EVENING_SHOWS[dow];
  document.getElementById('e-show-pill').innerHTML = `
    <div class="e-show-inner">
      <span class="e-show-tag">Tonight</span>
      🎭&nbsp; ${show.title} &nbsp;·&nbsp; ${show.time}
    </div>
  `;

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

function buildApp() {
  const now  = new Date();
  const dow  = now.getDay();
  const acts = getSchedule(dow);
  const show = EVENING_SHOWS[dow];

  initTabs();
  document.getElementById('app-date-line').textContent = fmtDate(now).toUpperCase();

  // Happening Now
  const current = acts.find(a => isNow(a, now));
  const banner  = document.getElementById('now-banner');
  if (current) {
    banner.classList.remove('hidden');
    banner.innerHTML = `<div class="now-dot"></div><span><strong>Happening Now</strong> &nbsp;—&nbsp; ${current.icon} ${current.title}, ${current.location}</span>`;
  }

  // Tonight's Show card
  document.getElementById('show-section').innerHTML = `
    <div class="show-card">
      <div class="show-icon">🎭</div>
      <div>
        <div class="show-badge">Tonight's Show</div>
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
      renderGrid(acts, now);
    });
    filterBar.appendChild(btn);
  });

  renderGrid(acts, now);
}

function renderGrid(acts, now) {
  const grid     = document.getElementById('activity-grid');
  const filtered = activeFilter === 'All' ? acts : acts.filter(a => a.cat === activeFilter);
  grid.innerHTML  = '';

  if (!filtered.length) {
    grid.innerHTML = '<p style="color:var(--faint);padding:0.5rem 0;font-size:0.85rem;letter-spacing:0.06em">No activities in this category today.</p>';
    return;
  }

  filtered.forEach((act, i) => {
    const style  = CAT_STYLE[act.cat] || { color: '#aaa' };
    const isNowAct = isNow(act, now);
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
        <span class="a-cat" style="color:${style.color};border-color:${style.color}">${act.cat}</span>
        <span class="a-dur">${act.dur} min</span>
      </div>
    `;
    grid.appendChild(card);
  });
}
