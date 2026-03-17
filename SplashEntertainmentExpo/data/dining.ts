// ─── Types ────────────────────────────────────────────────────────────────────

export type DiningType = 'Buffet' | 'A la Carte' | 'BBQ' | 'Bar' | 'Café';

export interface MealPeriod {
  label: 'Breakfast' | 'Lunch' | 'Dinner' | 'All Day';
  open: string;   // "06:30" — 24h
  close: string;  // "22:30" — 24h
}

export interface Restaurant {
  id: string;
  name: string;
  type: DiningType;
  cuisine: string;
  description: string;
  location: string;
  periods: MealPeriod[];
  reservationRequired: boolean;
  reservationNote: string | null;
  allInclusive: boolean;
  dresscode: string | null;
  specialNote: string | null;
  icon: string;
}

export interface Bar {
  id: string;
  name: string;
  location: string;
  description: string;
  openTime: string;   // "11:00"
  closeTime: string;  // "24:00"
  highlights: string[];
  icon: string;
}

// ─── Restaurants ──────────────────────────────────────────────────────────────

export const RESTAURANTS: Restaurant[] = [
  {
    id: 'rest-01',
    name: 'Marsa',
    type: 'Buffet',
    cuisine: 'International',
    description:
      "The resort's main restaurant offering lavish international buffets with live cooking stations, Mediterranean tapas, Middle Eastern mezzeh, grilled meats, fresh pasta, and a dessert buffet.",
    location: 'Main Building',
    periods: [
      { label: 'Breakfast', open: '06:30', close: '10:30' },
      { label: 'Lunch',     open: '13:00', close: '15:00' },
      { label: 'Dinner',    open: '18:30', close: '22:30' },
    ],
    reservationRequired: false,
    reservationNote: null,
    allInclusive: true,
    dresscode: 'Smart Casual for Dinner',
    specialNote: null,
    icon: '🍽️',
  },
  {
    id: 'rest-02',
    name: 'Amasis',
    type: 'A la Carte',
    cuisine: 'Seafood',
    description:
      'Elegant beachfront restaurant specialising in the freshest Red Sea seafood — grilled sea bass, fried calamari, and catch-of-the-day specials served with panoramic sea views.',
    location: 'Beachfront',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: true,
    reservationNote: '1 complimentary dinner per stay included',
    allInclusive: false,
    dresscode: 'Smart Casual',
    specialNote: 'Advance reservation via concierge or front desk required.',
    icon: '🦞',
  },
  {
    id: 'rest-03',
    name: 'Noba',
    type: 'A la Carte',
    cuisine: 'Italian',
    description:
      'Sophisticated Italian à la carte restaurant serving hand-made pasta, wood-fired pizzas, antipasti, and classic Italian desserts in a stylish setting.',
    location: 'Resort Complex',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: true,
    reservationNote: '1 complimentary dinner per stay included',
    allInclusive: false,
    dresscode: 'Smart Casual',
    specialNote: 'The Noba Bar & Lounge is open from 11:00 AM for drinks.',
    icon: '🍝',
  },
  {
    id: 'rest-04',
    name: 'Souk Café',
    type: 'A la Carte',
    cuisine: 'Arabian',
    description:
      'Immersive Bedouin-themed dining with authentic Arabian cuisine, shisha pipes, Arabic coffee and tea, and live belly dancing in a vibrant souk atmosphere.',
    location: 'Resort Complex',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: false,
    reservationNote: 'Reservation recommended',
    allInclusive: false,
    dresscode: null,
    specialNote: 'À la carte pricing. Features belly dancing and shisha lounge.',
    icon: '🏮',
  },
  {
    id: 'rest-05',
    name: 'Breezes',
    type: 'BBQ',
    cuisine: 'Oriental',
    description:
      'Poolside oriental BBQ restaurant serving grilled meats, mezze, and fresh salads. Perfect for a relaxed lunch or dinner by the main entertainment pool.',
    location: 'Breezes Pool Area',
    periods: [
      { label: 'Lunch',  open: '12:00', close: '15:00' },
      { label: 'Dinner', open: '18:30', close: '22:00' },
    ],
    reservationRequired: false,
    reservationNote: null,
    allInclusive: false,
    dresscode: null,
    specialNote: 'À la carte pricing. Pool attire welcome at lunch.',
    icon: '🔥',
  },
];

// ─── Bars ─────────────────────────────────────────────────────────────────────

export const BARS: Bar[] = [
  {
    id: 'bar-01',
    name: 'Coral Beach Bar',
    location: 'Beach',
    description:
      'Stylish beach bar serving cocktails, mocktails, and light snacks directly on the private beach at Abu Dabbab Bay.',
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['Beach cocktails', 'Light snacks', 'Sunset views'],
    icon: '🌴',
  },
  {
    id: 'bar-02',
    name: 'Axis',
    location: 'Entertainment Wing',
    description:
      "The resort's premier disco, nightclub, and sports bar. DJ shows every evening followed by themed parties — the heart of the resort's nightlife.",
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['DJ shows nightly', 'Themed parties', 'Sports screens', 'Cocktails'],
    icon: '🎵',
  },
  {
    id: 'bar-03',
    name: 'Kush',
    location: 'Off Lobby',
    description:
      'Relaxed café lounge off the main lobby. Perfect for morning coffee, afternoon pastries, or a quiet aperitivo before dinner.',
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['Coffee & tea', 'Aperitivo hour', 'Pastries', 'Lounge seating'],
    icon: '☕',
  },
  {
    id: 'bar-04',
    name: 'Breezes Bar',
    location: 'Breezes Pool',
    description:
      'Poolside bar at the main entertainment pool — stay hydrated between activities without leaving the water.',
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['Poolside service', 'Cocktails', 'Mocktails', 'Snacks'],
    icon: '🍹',
  },
  {
    id: 'bar-05',
    name: 'Lobby Bar',
    location: 'Main Lobby',
    description:
      'The social hub of the resort with nightly live entertainment — belly dancers, Egyptian dance shows, pianists, and singers.',
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['Live entertainment', 'Belly dancers', 'Live music', 'Cocktails'],
    icon: '🎹',
  },
  {
    id: 'bar-06',
    name: 'Noba Bar & Lounge',
    location: 'Noba Restaurant',
    description:
      'Sophisticated pre-dinner lounge attached to the Italian Noba restaurant. Fine cocktails and wine selection in an elegant setting.',
    openTime: '11:00',
    closeTime: '24:00',
    highlights: ['Fine cocktails', 'Wine selection', 'Pre-dinner drinks'],
    icon: '🍷',
  },
];

// ─── Helper: is a bar/restaurant currently open ───────────────────────────────

export function isVenueOpenNow(
  openTime: string,
  closeTime: string,
  now: Date,
): boolean {
  const [oh, om] = openTime.split(':').map(Number);
  const [ch, cm] = closeTime.split(':').map(Number);
  const nowMins = now.getHours() * 60 + now.getMinutes();
  const openMins = oh * 60 + om;
  // Handle midnight closing (24:00 stored as 24*60)
  const closeMins = ch === 24 ? 24 * 60 : ch * 60 + cm;
  return nowMins >= openMins && nowMins < closeMins;
}

export function isPeriodOpenNow(period: MealPeriod, now: Date): boolean {
  return isVenueOpenNow(period.open, period.close, now);
}

export function isRestaurantOpenNow(restaurant: Restaurant, now: Date): boolean {
  return restaurant.periods.some((p) => isPeriodOpenNow(p, now));
}
