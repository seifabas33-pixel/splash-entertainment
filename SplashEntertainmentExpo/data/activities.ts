// ─── Types ────────────────────────────────────────────────────────────────────

export type ActivityCategory =
  | 'Aqua'
  | 'Sport'
  | 'Kids'
  | 'Dance'
  | 'Games'
  | 'Evening';

export interface Activity {
  id: string;
  time: string;           // "09:00" — 24h for sorting/comparison
  displayTime: string;    // "9:00 AM" — shown in UI
  title: string;
  location: string;
  category: ActivityCategory;
  durationMinutes: number;
  description: string;
  icon: string;
}

export interface EveningShow {
  id: string;
  dayOfWeek: number;   // 0=Sunday … 6=Saturday
  title: string;
  venue: string;
  startTime: string;
  description: string;
}

// ─── Base activities — every working day (Sun–Fri) ───────────────────────────
// Saturday = Animation Day Off (no schedule)

const BASE_ACTIVITIES: Omit<Activity, 'id'>[] = [
  // ── Morning ──────────────────────────────────────────────────────────────
  {
    time: '10:30', displayTime: '10:30 AM',
    title: 'Darts Game',
    location: 'Games Area',
    category: 'Games', durationMinutes: 60,
    description: 'Darts competition for all levels — sign up with the animation team.',
    icon: '🎯',
  },
  {
    time: '10:30', displayTime: '10:30 AM',
    title: 'Morning Stretching',
    location: 'Breeze Pool',
    category: 'Sport', durationMinutes: 30,
    description: 'Gentle guided morning stretch session suitable for all ages.',
    icon: '🧘',
  },
  {
    time: '11:00', displayTime: '11:00 AM',
    title: 'Arabic Lesson',
    location: 'Beach Bar',
    category: 'Games', durationMinutes: 30,
    description: 'Learn fun Arabic phrases with the animation team.',
    icon: '🗣️',
  },
  {
    time: '11:00', displayTime: '11:00 AM',
    title: 'Boccia Game',
    location: 'Beach',
    category: 'Games', durationMinutes: 30,
    description: 'Classic bocce ball game — all skill levels welcome.',
    icon: '🎳',
  },
  {
    time: '11:30', displayTime: '11:30 AM',
    title: 'Water Gym & Cocktail Games',
    location: 'Breeze Pool',
    category: 'Aqua', durationMinutes: 60,
    description: 'Pool aerobics and fun water games with complimentary cocktails.',
    icon: '🍹',
  },
  // ── Afternoon ────────────────────────────────────────────────────────────
  {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Beach Volleyball',
    location: 'Beach',
    category: 'Sport', durationMinutes: 60,
    description: 'Teams on the sand at Abu Dabbab Bay — all welcome!',
    icon: '🏖️',
  },
  {
    time: '16:00', displayTime: '4:00 PM',
    title: 'Yoga Class',
    location: 'Hilton Marsa Alam',
    category: 'Sport', durationMinutes: 45,
    description: 'Relaxing yoga session as the afternoon sun begins to dip.',
    icon: '🧘‍♀️',
  },
  // ── Evening ──────────────────────────────────────────────────────────────
  {
    time: '20:30', displayTime: '8:30 PM',
    title: 'Kids Family Disco',
    location: 'Axis',
    category: 'Kids', durationMinutes: 45,
    description: 'Fun disco for the whole family — kids especially welcome!',
    icon: '🕺',
  },
  {
    time: '22:30', displayTime: '10:30 PM',
    title: 'Disco Time',
    location: 'Axis Bar',
    category: 'Evening', durationMinutes: 90,
    description: 'The resort nightclub comes alive — dance until midnight!',
    icon: '🎶',
  },
];

// ─── Afternoon class — alternates Fitness / Dance by day of week ──────────────
// Sun (0), Tue (2), Thu (4) → Fitness Class
// Mon (1), Wed (3), Fri (5) → Dance Class

const AFTERNOON_CLASS_BY_DOW: Partial<Record<number, Omit<Activity, 'id'>>> = {
  0: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Fitness Class',
    location: 'Breeze Pool',
    category: 'Sport', durationMinutes: 60,
    description: 'High-energy fitness class at the pool deck.',
    icon: '💪',
  },
  1: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Dance Class',
    location: 'Breeze Pool',
    category: 'Dance', durationMinutes: 60,
    description: 'Fun dance class by the pool with the animation team.',
    icon: '💃',
  },
  2: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Fitness Class',
    location: 'Breeze Pool',
    category: 'Sport', durationMinutes: 60,
    description: 'High-energy fitness class at the pool deck.',
    icon: '💪',
  },
  3: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Dance Class',
    location: 'Breeze Pool',
    category: 'Dance', durationMinutes: 60,
    description: 'Fun dance class by the pool with the animation team.',
    icon: '💃',
  },
  4: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Fitness Class',
    location: 'Breeze Pool',
    category: 'Sport', durationMinutes: 60,
    description: 'High-energy fitness class at the pool deck.',
    icon: '💪',
  },
  5: {
    time: '15:30', displayTime: '3:30 PM',
    title: 'Dance Class',
    location: 'Breeze Pool',
    category: 'Dance', durationMinutes: 60,
    description: 'Fun dance class by the pool with the animation team.',
    icon: '💃',
  },
};

// ─── Evening shows — real weekly rotation ────────────────────────────────────

export const EVENING_SHOWS: EveningShow[] = [
  {
    id: 'show-00',
    dayOfWeek: 0,
    title: 'Night of Chicago',
    venue: 'Breeze Pool (Outdoor Stage)',
    startTime: '8:45 PM',
    description: 'A spectacular outdoor show featuring the iconic songs and style of Chicago.',
  },
  {
    id: 'show-01',
    dayOfWeek: 1,
    title: 'Oriental Folklore Night',
    venue: 'Splash Stage',
    startTime: '9:00 PM',
    description: 'Traditional Egyptian and Arabic folklore — music, dance and authentic costumes.',
  },
  {
    id: 'show-02',
    dayOfWeek: 2,
    title: 'White Party',
    venue: 'Axis Bar',
    startTime: '7:30 PM',
    description: 'All-white dress code party with DJ, cocktails and dancing until midnight.',
  },
  {
    id: 'show-03',
    dayOfWeek: 3,
    title: 'Magic of Marsa — Bedouin Show',
    venue: 'Breeze Pool',
    startTime: '8:30 PM',
    description: 'Immersive Bedouin cultural experience with Tanoura spinning, live music and desert ambiance.',
  },
  {
    id: 'show-04',
    dayOfWeek: 4,
    title: 'Mr. & Ms. Hilton',
    venue: 'Axis Bar',
    startTime: '9:00 PM',
    description: 'Fun guest talent competition — nominate yourself or a friend to take the stage!',
  },
  {
    id: 'show-05',
    dayOfWeek: 5,
    title: 'Oriental Show + Crazy Raffle & Karaoke',
    venue: 'Lobby / Axis Bar',
    startTime: '9:00 PM',
    description: 'Oriental dance performance followed by the Crazy Raffle and Karaoke show.',
  },
  {
    id: 'show-06',
    dayOfWeek: 6,
    title: 'Live Music — Keytar Band',
    venue: 'Lobby',
    startTime: '7:00 PM',
    description: 'Live lounge music from the resident Keytar Band in the hotel lobby.',
  },
];

// ─── Kids Club MORNING — 10:00–12:00 every day ───────────────────────────────
// 0=Sun  1=Mon  2=Tue  3=Wed  4=Thu  5=Fri  6=Sat

const KIDS_CLUB_MORNING_BY_DOW: Record<number, Omit<Activity, 'id'>> = {
  0: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Crafts Workshop',
    location: 'Kids Zone',
    category: 'Kids', durationMinutes: 120,
    description: 'Creative crafts, painting and drawing for ages 4–10.',
    icon: '🎨',
  },
  1: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Mini-Disco & Dance Lessons',
    location: 'Kids Zone',
    category: 'Kids', durationMinutes: 120,
    description: 'Mini disco and fun dance lessons for the little ones.',
    icon: '💃',
  },
  2: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Coloring Stones',
    location: 'Beach',
    category: 'Kids', durationMinutes: 120,
    description: 'Creative stone painting and art on the beach for ages 4–10.',
    icon: '🪨',
  },
  3: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: La Petite Chef',
    location: 'Breeze Restaurant',
    category: 'Kids', durationMinutes: 120,
    description: 'Junior cooking class with the resort chefs — ages 4–10.',
    icon: '👨‍🍳',
  },
  4: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Pirates Day / Indian Day',
    location: 'Kids Zone',
    category: 'Kids', durationMinutes: 120,
    description: 'A fun-filled themed day — pirates adventure meets Indian culture!',
    icon: '🏴‍☠️',
  },
  5: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Mini Olympics',
    location: 'Breeze Pool',
    category: 'Kids', durationMinutes: 120,
    description: 'Mini Olympics with fun sports challenges and medals for all participants.',
    icon: '🏅',
  },
  6: {
    time: '10:00', displayTime: '10:00 AM',
    title: 'Kids Club: Family Day',
    location: 'Kids Zone & Pool',
    category: 'Kids', durationMinutes: 120,
    description: 'Special family day — a full day of activities for the whole family together.',
    icon: '👨‍👩‍👧‍👦',
  },
};

// ─── Kids Club AFTERNOON — 15:00–16:30 every day ─────────────────────────────

const KIDS_CLUB_AFTERNOON_BY_DOW: Record<number, Omit<Activity, 'id'>> = {
  0: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Face Painting & Drawing',
    location: 'Kids Zone',
    category: 'Kids', durationMinutes: 90,
    description: 'Afternoon face painting and drawing session — creativity unleashed!',
    icon: '🎨',
  },
  1: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Foam Party',
    location: 'Breeze Pool',
    category: 'Kids', durationMinutes: 90,
    description: 'Afternoon foam party for kids at the main pool — get ready to get soaked!',
    icon: '🫧',
  },
  2: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Beach Action',
    location: 'Beach',
    category: 'Kids', durationMinutes: 90,
    description: 'Beach games, sand castles and fun beach activities for kids.',
    icon: '🏖️',
  },
  3: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Cookie Making',
    location: 'Breeze Restaurant',
    category: 'Kids', durationMinutes: 90,
    description: 'Cookie baking afternoon at the Breeze restaurant — all ages welcome.',
    icon: '🍪',
  },
  4: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Pirates Day / Indian Day',
    location: 'Kids Zone',
    category: 'Kids', durationMinutes: 90,
    description: 'Afternoon continuation of the pirates & Indian day theme — games, costumes and more!',
    icon: '🏴‍☠️',
  },
  5: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Foam Party',
    location: 'Breeze Pool',
    category: 'Kids', durationMinutes: 90,
    description: 'Friday foam party for kids — biggest one of the week!',
    icon: '🫧',
  },
  6: {
    time: '15:00', displayTime: '3:00 PM',
    title: 'Kids Club: Family Day',
    location: 'Kids Zone & Pool',
    category: 'Kids', durationMinutes: 90,
    description: 'Afternoon family activities — fun for every age together.',
    icon: '👨‍👩‍👧‍👦',
  },
};

// ─── Build activity list for a specific date ─────────────────────────────────

export function getActivitiesForDate(date: Date): Activity[] {
  const dow = date.getDay(); // 0=Sun … 6=Sat
  const result: Omit<Activity, 'id'>[] = [];

  // Kids Club runs 7 days — morning & afternoon sessions
  result.push(KIDS_CLUB_MORNING_BY_DOW[dow]);
  result.push(KIDS_CLUB_AFTERNOON_BY_DOW[dow]);

  if (dow === 6) {
    // Saturday = Animation Day Off — Kids Club only, no other activities
    return result.map((a, i) => ({ ...a, id: `act-${dow}-${i.toString().padStart(2, '0')}` }));
  }

  // Base daily activities (morning + fixed afternoon + evening) — Sun–Fri only
  result.push(...BASE_ACTIVITIES);

  // Today's afternoon class (Fitness or Dance — alternates by day of week)
  const afternoonClass = AFTERNOON_CLASS_BY_DOW[dow];
  if (afternoonClass) result.push(afternoonClass);

  // Tonight's evening show
  const show = EVENING_SHOWS.find((s) => s.dayOfWeek === dow);
  if (show) {
    const showTime24 =
      show.startTime.startsWith('7:')   ? '19:00' :
      show.startTime.startsWith('8:30') ? '20:30' :
      show.startTime.startsWith('8:45') ? '20:45' :
      '21:00';
    result.push({
      time: showTime24,
      displayTime: show.startTime,
      title: show.title,
      location: show.venue,
      category: 'Evening',
      durationMinutes: 75,
      description: show.description,
      icon: '🎭',
    });
  }

  return result
    .map((a, i) => ({ ...a, id: `act-${dow}-${i.toString().padStart(2, '0')}` }))
    .sort((a, b) => a.time.localeCompare(b.time));
}

// ─── DAILY_ACTIVITIES — today's real schedule ─────────────────────────────────
// NOTE: This is a module-level constant computed once at import time.
// It is intentionally kept for backward-compatibility only.
// All screens should call getActivitiesForDate(new Date()) directly so
// they always reflect the actual current date (critical around midnight).
//
// @deprecated — use getActivitiesForDate(new Date()) in components instead.
export const DAILY_ACTIVITIES: Activity[] = getActivitiesForDate(new Date());

// ─── Category display config ──────────────────────────────────────────────────

export const CATEGORY_COLORS: Record<
  ActivityCategory,
  { bg: string; text: string }
> = {
  Aqua:    { bg: 'rgba(0, 180, 216, 0.18)',  text: '#0096B4' },
  Sport:   { bg: 'rgba(0, 74, 173, 0.14)',   text: '#004AAD' },
  Kids:    { bg: 'rgba(255, 165, 0, 0.18)',   text: '#B8660A' },
  Dance:   { bg: 'rgba(233, 30, 99, 0.14)',   text: '#AD1457' },
  Games:   { bg: 'rgba(255, 87, 34, 0.14)',   text: '#BF360C' },
  Evening: { bg: 'rgba(103, 58, 183, 0.16)',  text: '#512DA8' },
};

export const ALL_CATEGORIES: ActivityCategory[] = [
  'Aqua',
  'Sport',
  'Kids',
  'Dance',
  'Games',
  'Evening',
];

// ─── Helper: which activity is happening right now ────────────────────────────

export function getHappeningNow(
  activities: Activity[],
  now: Date,
): Activity | null {
  const nowMins = now.getHours() * 60 + now.getMinutes();
  return (
    activities.find((a) => {
      const [h, m] = a.time.split(':').map(Number);
      const startMins = h * 60 + m;
      const endMins = startMins + a.durationMinutes;
      return nowMins >= startMins && nowMins < endMins;
    }) ?? null
  );
}

// ─── Helper: tonight's show ───────────────────────────────────────────────────

export function getTonightsShow(now: Date): EveningShow {
  return EVENING_SHOWS[now.getDay()];
}
