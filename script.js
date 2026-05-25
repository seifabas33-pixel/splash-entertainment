// ── Activity Data (from Old Palace Resort) ────────────────────────────────────

const BASE_ACTIVITIES = [
  { time: '10:30', displayTime: '10:30', ampm: 'AM', title: 'Darts Game',               location: 'Games Area',           category: 'Games',   duration: 60,  desc: 'Darts competition for all levels — sign up with the animation team.',                icon: '🎯' },
  { time: '10:30', displayTime: '10:30', ampm: 'AM', title: 'Morning Stretching',        location: 'Main Pool',            category: 'Sport',   duration: 30,  desc: 'Gentle guided morning stretch session suitable for all ages.',                      icon: '🧘' },
  { time: '11:00', displayTime: '11:00', ampm: 'AM', title: 'Arabic Lesson',             location: 'Beach Bar',            category: 'Games',   duration: 30,  desc: 'Learn fun Arabic phrases with the animation team.',                                 icon: '🗣️' },
  { time: '11:00', displayTime: '11:00', ampm: 'AM', title: 'Boccia Game',               location: 'Beach',                category: 'Games',   duration: 30,  desc: 'Classic bocce ball game — all skill levels welcome.',                               icon: '🎳' },
  { time: '11:30', displayTime: '11:30', ampm: 'AM', title: 'Water Gym & Cocktail Games',location: 'Main Pool',            category: 'Aqua',    duration: 60,  desc: 'Pool aerobics and fun water games with complimentary cocktails.',                   icon: '🍹' },
  { time: '15:30', displayTime: '3:30',  ampm: 'PM', title: 'Beach Volleyball',          location: 'Beach',                category: 'Sport',   duration: 60,  desc: 'Teams on the sand at Sahl Hasheesh Bay — all welcome!',                            icon: '🏖️' },
  { time: '16:00', displayTime: '4:00',  ampm: 'PM', title: 'Yoga Class',                location: 'Old Palace Beachfront',category: 'Sport',   duration: 45,  desc: 'Relaxing yoga session as the afternoon sun begins to dip.',                         icon: '🧘‍♀️' },
  { time: '20:30', displayTime: '8:30',  ampm: 'PM', title: 'Kids Family Disco',         location: 'La Bonita',            category: 'Kids',    duration: 45,  desc: 'Fun disco for the whole family — kids especially welcome!',                         icon: '🕺' },
  { time: '22:30', displayTime: '10:30', ampm: 'PM', title: 'Disco Time',                location: 'La Bonita',            category: 'Evening', duration: 90,  desc: 'La Bonita comes alive — dance the night away until midnight!',                     icon: '🎶' },
];

const AFTERNOON_CLASS = {
  0: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Fitness Class', location: 'Main Pool', category: 'Sport', duration: 60, desc: 'High-energy fitness class at the pool deck.', icon: '💪' },
  1: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Dance Class',   location: 'Main Pool', category: 'Dance', duration: 60, desc: 'Fun dance class by the pool with the animation team.', icon: '💃' },
  2: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Fitness Class', location: 'Main Pool', category: 'Sport', duration: 60, desc: 'High-energy fitness class at the pool deck.', icon: '💪' },
  3: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Dance Class',   location: 'Main Pool', category: 'Dance', duration: 60, desc: 'Fun dance class by the pool with the animation team.', icon: '💃' },
  4: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Fitness Class', location: 'Main Pool', category: 'Sport', duration: 60, desc: 'High-energy fitness class at the pool deck.', icon: '💪' },
  5: { time: '15:30', displayTime: '3:30', ampm: 'PM', title: 'Dance Class',   location: 'Main Pool', category: 'Dance', duration: 60, desc: 'Fun dance class by the pool with the animation team.', icon: '💃' },
};

const KIDS_MORNING = {
  0: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Crafts Workshop',        location: 'Kids Zone',         category: 'Kids', duration: 120, desc: 'Creative crafts, painting and drawing for ages 4–10.',                          icon: '🎨' },
  1: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Mini-Disco & Dance',     location: 'Kids Zone',         category: 'Kids', duration: 120, desc: 'Mini disco and fun dance lessons for the little ones.',                          icon: '💃' },
  2: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Coloring Stones',        location: 'Beach',             category: 'Kids', duration: 120, desc: 'Creative stone painting and art on the beach for ages 4–10.',                    icon: '🪨' },
  3: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: La Petite Chef',         location: 'Al Kasr Restaurant',category: 'Kids', duration: 120, desc: 'Junior cooking class with the resort chefs — ages 4–10.',                        icon: '👨‍🍳' },
  4: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Pirates & Indian Day',   location: 'Kids Zone',         category: 'Kids', duration: 120, desc: 'A fun-filled themed day — pirates adventure meets Indian culture!',              icon: '🏴‍☠️' },
  5: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Mini Olympics',          location: 'Main Pool',         category: 'Kids', duration: 120, desc: 'Mini Olympics with fun sports challenges and medals for all participants.',     icon: '🏅' },
  6: { time: '10:00', displayTime: '10:00', ampm: 'AM', title: 'Kids Club: Family Day',             location: 'Kids Zone & Pool',  category: 'Kids', duration: 120, desc: 'Special family day — a full day of activities for the whole family together.', icon: '👨‍👩‍👧‍👦' },
};

const KIDS_AFTERNOON = {
  0: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Face Painting',      location: 'Kids Zone',         category: 'Kids', duration: 90, desc: 'Afternoon face painting and drawing session — creativity unleashed!',                         icon: '🎨' },
  1: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Foam Party',         location: 'Main Pool',         category: 'Kids', duration: 90, desc: 'Afternoon foam party for kids at the main pool — get ready to get soaked!',                   icon: '🫧' },
  2: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Beach Action',       location: 'Beach',             category: 'Kids', duration: 90, desc: 'Beach games, sand castles and fun beach activities for kids.',                               icon: '🏖️' },
  3: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Cookie Making',      location: 'Al Kasr Restaurant',category: 'Kids', duration: 90, desc: 'Cookie baking afternoon at the restaurant — all ages welcome.',                               icon: '🍪' },
  4: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Pirates & Indian',   location: 'Kids Zone',         category: 'Kids', duration: 90, desc: 'Afternoon continuation of the themed day — games, costumes and more!',                         icon: '🏴‍☠️' },
  5: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Foam Party',         location: 'Main Pool',         category: 'Kids', duration: 90, desc: 'Friday foam party for kids — biggest one of the week!',                                       icon: '🫧' },
  6: { time: '15:00', displayTime: '3:00', ampm: 'PM', title: 'Kids Club: Family Day',         location: 'Kids Zone & Pool',  category: 'Kids', duration: 90, desc: 'Afternoon family activities — fun for every age together.',                                   icon: '👨‍👩‍👧‍👦' },
};

const EVENING_SHOWS = [
  { dow: 0, title: 'Tanoura & Fire Show',          venue: 'La Bonita',          time: '8:45 PM', desc: 'Spectacular Tanoura spinning and fire performance — a dazzling display of traditional Egyptian folklore.' },
  { dow: 1, title: 'Oriental Folklore Night',      venue: 'Lobby Bar',          time: '9:00 PM', desc: 'Traditional Egyptian and Arabic folklore — music, belly dance, and authentic costumes.' },
  { dow: 2, title: 'White Party',                  venue: 'La Bonita',          time: '7:30 PM', desc: 'All-white dress code party with DJ, cocktails and dancing until midnight.' },
  { dow: 3, title: 'Bedouin Night — Desert Magic', venue: 'La Bonita',          time: '8:30 PM', desc: 'Immersive Bedouin cultural experience with live Oud music, belly dance, and desert ambiance.' },
  { dow: 4, title: 'Mr. & Ms. Old Palace',         venue: 'La Bonita',          time: '9:00 PM', desc: 'Fun guest talent competition — nominate yourself or a friend to take the stage!' },
  { dow: 5, title: 'Crazy Raffle & Karaoke Night', venue: 'Lobby Bar / La Bonita', time: '9:00 PM', desc: 'Win amazing prizes in the Crazy Raffle then take to the mic for Karaoke!' },
  { dow: 6, title: 'Live Music & Belly Dance Gala',venue: 'Lobby Bar',          time: '7:00 PM', desc: 'Live lounge band performance followed by a spectacular belly dance gala show.' },
];

const CAT_STYLE = {
  Aqua:    { bg: 'rgba(0,180,216,0.22)',  text: '#4dd8f0' },
  Sport:   { bg: 'rgba(30,110,220,0.22)', text: '#74aaff' },
  Kids:    { bg: 'rgba(255,165,0,0.22)',  text: '#ffb84d' },
  Dance:   { bg: 'rgba(220,30,99,0.22)',  text: '#ff80b0' },
  Games:   { bg: 'rgba(255,90,34,0.22)',  text: '#ff9060' },
  Evening: { bg: 'rgba(110,58,183,0.22)', text: '#c39af0' },
};

const CAT_FILTER_COLOR = {
  All:     'linear-gradient(90deg,var(--red),var(--rose))',
  Aqua:    'linear-gradient(90deg,#0096B4,#00cfef)',
  Sport:   'linear-gradient(90deg,#004AAD,#2272ff)',
  Kids:    'linear-gradient(90deg,#B8660A,#f5a020)',
  Dance:   'linear-gradient(90deg,#AD1457,#f04888)',
  Games:   'linear-gradient(90deg,#BF360C,#ff6030)',
  Evening: 'linear-gradient(90deg,#512DA8,#9c55f5)',
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
    const showTime = show.time.startsWith('7:') ? '19:00' : show.time.startsWith('8:30') ? '20:30' : show.time.startsWith('8:45') ? '20:45' : '21:00';
    list.push({ time: showTime, displayTime: show.time.replace(' PM','').replace(' AM',''), ampm: show.time.includes('PM') ? 'PM' : 'AM', title: show.title, location: show.venue, category: 'Evening', duration: 75, desc: show.desc, icon: '🎭' });
  }
  return list.sort((a, b) => a.time.localeCompare(b.time));
}

function isNow(act, now) {
  const [h, m] = act.time.split(':').map(Number);
  const startMins = h * 60 + m;
  return now.getHours() * 60 + now.getMinutes() >= startMins &&
         now.getHours() * 60 + now.getMinutes() < startMins + act.duration;
}

// ── Entrance ──────────────────────────────────────────────────────────────────

function spawnParticles() {
  const host = document.getElementById('particles-host');
  for (let i = 0; i < 30; i++) {
    const p = document.createElement('span');
    p.className = 'particle';
    const sz = 2 + Math.random() * 4;
    p.style.cssText = `left:${(Math.random()*100).toFixed(1)}%;width:${sz.toFixed(1)}px;height:${sz.toFixed(1)}px;--op:${(0.12+Math.random()*0.3).toFixed(2)};animation-delay:${(Math.random()*7).toFixed(1)}s;animation-duration:${(5+Math.random()*9).toFixed(1)}s`;
    host.appendChild(p);
  }
}

function setupEntrance() {
  const now = new Date();
  const dow = now.getDay();
  const dateStr = `${DAYS[dow]}  ·  ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;
  document.getElementById('e-date').textContent = dateStr;

  const show = EVENING_SHOWS[dow];
  document.getElementById('e-show').innerHTML =
    `<div class="e-show-inner"><span class="e-show-label">Tonight</span>🎭 ${show.title} · ${show.time}</div>`;
}

document.getElementById('enter-btn').addEventListener('click', () => {
  const entrance = document.getElementById('entrance');
  entrance.classList.add('exiting');
  setTimeout(() => {
    entrance.style.display = 'none';
    const app = document.getElementById('app');
    app.classList.remove('hidden');
    buildApp();
  }, 750);
});

// ── App ───────────────────────────────────────────────────────────────────────

let activeFilter = 'All';

function buildApp() {
  const now = new Date();
  const dow = now.getDay();
  const activities = getSchedule(dow);
  const show = EVENING_SHOWS[dow];

  // Header date
  document.getElementById('app-date-sub').textContent =
    `${DAYS[dow]}, ${now.getDate()} ${MONTHS[now.getMonth()]} ${now.getFullYear()}`;

  // Happening now
  const current = activities.find(a => isNow(a, now));
  const banner = document.getElementById('now-banner');
  if (current) {
    banner.classList.remove('hidden');
    banner.innerHTML = `<div class="now-dot"></div><strong>Happening Now:</strong> ${current.icon} ${current.title} — ${current.location}`;
  }

  // Tonight's show
  document.getElementById('show-section').innerHTML = `
    <div class="show-card">
      <div class="show-icon">🎭</div>
      <div>
        <div class="show-badge">Tonight's Show</div>
        <div class="show-title">${show.title}</div>
        <div class="show-meta">📍 ${show.venue} &nbsp;·&nbsp; 🕐 ${show.time}</div>
        <div class="show-desc">${show.desc}</div>
      </div>
    </div>
  `;

  // Filters
  const categories = ['All', ...new Set(activities.map(a => a.category))];
  const filterBar = document.getElementById('filter-bar');
  filterBar.innerHTML = '';
  categories.forEach(cat => {
    const btn = document.createElement('button');
    btn.className = 'filter-btn' + (cat === activeFilter ? ' active' : '');
    btn.textContent = cat;
    if (cat === activeFilter) btn.style.background = CAT_FILTER_COLOR[cat] || CAT_FILTER_COLOR['All'];
    btn.addEventListener('click', () => {
      activeFilter = cat;
      document.querySelectorAll('.filter-btn').forEach(b => {
        b.classList.remove('active');
        b.style.background = '';
      });
      btn.classList.add('active');
      btn.style.background = CAT_FILTER_COLOR[cat] || CAT_FILTER_COLOR['All'];
      renderGrid(activities, now);
    });
    filterBar.appendChild(btn);
  });

  renderGrid(activities, now);
}

function renderGrid(activities, now) {
  const grid = document.getElementById('activity-grid');
  const filtered = activeFilter === 'All' ? activities : activities.filter(a => a.category === activeFilter);
  grid.innerHTML = '';
  filtered.forEach((act, i) => {
    const cat = CAT_STYLE[act.category] || { bg: 'rgba(255,255,255,0.1)', text: '#fff' };
    const happening = isNow(act, now);
    const card = document.createElement('article');
    card.className = 'a-card' + (happening ? ' now-card' : '');
    card.style.animationDelay = `${i * 0.04}s`;
    card.innerHTML = `
      <div class="a-time">
        <div class="a-time-val">${act.displayTime}</div>
        <div class="a-time-ampm">${act.ampm}</div>
      </div>
      <div class="a-icon">${act.icon}</div>
      <div class="a-body">
        <div class="a-title">${act.title}</div>
        <div class="a-loc">📍 ${act.location}</div>
        <div class="a-desc">${act.desc}</div>
      </div>
      <div class="a-meta">
        <span class="a-cat" style="background:${cat.bg};color:${cat.text}">${act.category}</span>
        <span class="a-dur">${act.duration} min</span>
      </div>
    `;
    grid.appendChild(card);
  });

  if (filtered.length === 0) {
    grid.innerHTML = '<p style="color:rgba(255,255,255,0.4);padding:1rem 0">No activities in this category today.</p>';
  }
}

// ── Init ──────────────────────────────────────────────────────────────────────

spawnParticles();
setupEntrance();
