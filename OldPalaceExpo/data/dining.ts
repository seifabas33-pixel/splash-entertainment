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
    name: 'Al Kasr',
    type: 'Buffet',
    cuisine: 'International',
    description:
      "The resort's main restaurant delivering generous international buffets with live cooking stations, Mediterranean and Middle Eastern dishes, grilled meats, fresh salads, and a dessert spread.",
    location: 'Main Building',
    periods: [
      { label: 'Breakfast', open: '07:00', close: '10:30' },
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
    name: 'La Cucina',
    type: 'A la Carte',
    cuisine: 'Italian',
    description:
      'Elegant Italian à la carte restaurant serving hand-made pasta, wood-fired pizzas, antipasti, seafood risotto, and classic Italian desserts in a refined setting.',
    location: 'Resort Complex',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: true,
    reservationNote: '1 complimentary dinner per week included with All-Inclusive',
    allInclusive: false,
    dresscode: 'Smart Casual',
    specialNote: 'Advance reservation via reception. Fills quickly — book early.',
    icon: '🍝',
  },
  {
    id: 'rest-03',
    name: 'The Gazebo',
    type: 'A la Carte',
    cuisine: 'International Fine Dining',
    description:
      'Candlelit fine-dining restaurant with panoramic sea views — international cuisine prepared to an elegant standard, ideal for a special occasion or a quiet dinner for two.',
    location: 'Beachfront Terrace',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: true,
    reservationNote: '1 complimentary dinner per week included with All-Inclusive',
    allInclusive: false,
    dresscode: 'Smart Casual — no beachwear',
    specialNote: 'Advance reservation strongly recommended.',
    icon: '🕯️',
  },
  {
    id: 'rest-04',
    name: 'Poncho',
    type: 'A la Carte',
    cuisine: 'Brazilian Steakhouse',
    description:
      'Lively Brazilian churrascaria serving premium cuts of grilled meat carved tableside, plus traditional sides, salads, and Brazilian desserts.',
    location: 'Resort Entrance Area',
    periods: [
      { label: 'Dinner', open: '18:30', close: '22:30' },
    ],
    reservationRequired: true,
    reservationNote: '1 complimentary dinner per week included with All-Inclusive',
    allInclusive: false,
    dresscode: 'Smart Casual',
    specialNote: 'Very popular — reserve as early as possible upon check-in.',
    icon: '🥩',
  },
];

// ─── Bars ─────────────────────────────────────────────────────────────────────

export const BARS: Bar[] = [
  {
    id: 'bar-01',
    name: 'Pool Bar',
    location: 'Main Pool',
    description:
      'Swim-up and poolside bar serving refreshing cocktails, mocktails, cold beers, and light snacks — stay in the water while you order.',
    openTime: '10:00',
    closeTime: '23:00',
    highlights: ['Swim-up access', 'Cocktails & mocktails', 'Cold beers', 'Light snacks'],
    icon: '🍹',
  },
  {
    id: 'bar-02',
    name: 'Lobby Bar',
    location: 'Main Lobby',
    description:
      'The social heart of the resort — coffee and pastries by day, cocktails and live entertainment by night. Animation team evening shows often start here.',
    openTime: '10:00',
    closeTime: '24:00',
    highlights: ['Live entertainment', 'Cocktails', 'Coffee & tea', 'Evening shows'],
    icon: '🎹',
  },
  {
    id: 'bar-03',
    name: 'Beach Bar',
    location: 'Private Beach',
    description:
      'Beachside bar with your feet in the sand — ice-cold drinks, tropical cocktails, and light bites while you enjoy the Red Sea views.',
    openTime: '10:00',
    closeTime: '18:00',
    highlights: ['Beachside service', 'Tropical cocktails', 'Snacks', 'Sea views'],
    icon: '🌴',
  },
  {
    id: 'bar-04',
    name: 'Shisha Corner',
    location: 'Oriental Lounge',
    description:
      'Relaxed oriental lounge with traditional shisha pipes, Arabic coffee, mint tea, and light bites in a warm, atmospheric setting.',
    openTime: '16:00',
    closeTime: '24:00',
    highlights: ['Shisha pipes', 'Arabic coffee', 'Mint tea', 'Relaxed atmosphere'],
    icon: '🏮',
  },
  {
    id: 'bar-05',
    name: 'La Bonita',
    location: 'Off the Lobby (Underground)',
    description:
      "Old Palace's underground nightclub and bar — nightly animation team shows followed by DJ-driven disco. The liveliest spot in the resort after dark.",
    openTime: '20:30',
    closeTime: '24:00',
    highlights: ['Nightly shows', 'DJ disco', 'Cocktails', 'Animation performances'],
    icon: '🎵',
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
