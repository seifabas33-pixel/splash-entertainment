// ─── Types ────────────────────────────────────────────────────────────────────

export type AgeGroup = 'All' | 'Adults' | 'Family' | 'Kids';

export interface Pool {
  id: string;
  name: string;
  areaM2: number;
  description: string;
  features: string[];
  ageGroup: AgeGroup;
  depthNote: string | null;
}

export interface Facility {
  id: string;
  name: string;
  description: string;
  location: string;
  openHours: string;
  priceNote: string | null;
  icon: string;
  zoneId: string;
}

export interface ResortZone {
  id: string;
  name: string;
  description: string;
  icon: string;
  accentColor: string;
  facilityIds: string[];
  imageKey: string;   // key into LOCAL_IMAGES or a remote URI
}

// ─── Pools ────────────────────────────────────────────────────────────────────

export const POOLS: Pool[] = [
  {
    id: 'pool-01',
    name: 'Breezes Pool',
    areaM2: 1600,
    description:
      "The resort's main entertainment pool and the heart of daily animation — Aqua Gym, Water Polo, Zumba, and more happen here.",
    features: ['Animation activities', 'Pool bar', 'Loungers', 'Sun umbrellas', 'Volleyball net'],
    ageGroup: 'All',
    depthNote: null,
  },
  {
    id: 'pool-02',
    name: 'Seashells Pool',
    areaM2: 435,
    description:
      'Peaceful adults-only sanctuary away from the main activity area. Ideal for a quiet swim or sunbathe.',
    features: ['Adults only', 'Quiet zone', 'Loungers', 'Towel service'],
    ageGroup: 'Adults',
    depthNote: null,
  },
  {
    id: 'pool-03',
    name: 'Splash Pool',
    areaM2: 305,
    description:
      'Family-friendly zero-entry pool with a gradual slope — perfect for guests with young children.',
    features: ['Zero-entry slope', 'Family friendly', 'Adjacent to Kids Zone'],
    ageGroup: 'Family',
    depthNote: 'Zero-entry design',
  },
  {
    id: 'pool-04',
    name: 'Waves Pool',
    areaM2: 200,
    description:
      'Compact family pool offering a calmer alternative to the main Breezes Pool.',
    features: ['Family friendly', 'Loungers', 'Shaded area'],
    ageGroup: 'Family',
    depthNote: null,
  },
  {
    id: 'pool-05',
    name: 'Kids Paddling Pool',
    areaM2: 50,
    description:
      'Safe, very shallow paddling pool for infants and toddlers, located next to the Kids Club.',
    features: ['Toddler-safe', 'Shaded seating', 'Adjacent to Kids Club'],
    ageGroup: 'Kids',
    depthNote: '0.5 m maximum depth',
  },
];

// ─── Facilities ───────────────────────────────────────────────────────────────

export const FACILITIES: Facility[] = [
  {
    id: 'fac-01',
    name: 'Planet Spa',
    description:
      'Full-service spa offering body massages, facials, body wraps, scrubs, and manicures using local botanicals and premium products.',
    location: 'Spa Wing',
    openHours: '9:00 AM – 9:00 PM',
    priceNote: 'From ~€40 per treatment',
    icon: '💆',
    zoneId: 'zone-wellness',
  },
  {
    id: 'fac-02',
    name: '24-Hour Gym',
    description:
      'Fully equipped fitness centre with cardio machines, free weights, resistance equipment, and daily fitness classes.',
    location: 'Wellness Wing',
    openHours: '24 hours',
    priceNote: 'Complimentary for all guests',
    icon: '🏋️',
    zoneId: 'zone-wellness',
  },
  {
    id: 'fac-03',
    name: 'Private Beach',
    description:
      "Resort's private beach at Abu Dabbab Bay — 400 m from the main building. Famous for sea turtles, dugongs, and pristine coral reef.",
    location: 'Abu Dabbab Bay',
    openHours: 'Sunrise – Sunset',
    priceNote: 'Complimentary — towels, parasols & loungers included',
    icon: '🏖️',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-04',
    name: 'House Reef Snorkelling',
    description:
      'Direct access to the house reef from the beach. See sea turtles, dugongs, colourful reef fish, and stingrays in crystal-clear water.',
    location: 'Beach',
    openHours: 'Sunrise – Sunset',
    priceNote: 'Equipment rental available from beach team',
    icon: '🤿',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-05',
    name: 'Blue Ocean Dive Center',
    description:
      'PADI 5-Star dive centre with unlimited house reef diving, daily boat dives, and 35+ dive sites accessible in Abu Dabbab Bay.',
    location: 'Beachfront',
    openHours: '8:00 AM – 5:00 PM',
    priceNote: 'From ~€50 per dive. Courses available.',
    icon: '🌊',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-06',
    name: 'Kids Club',
    description:
      'Supervised kids activities for ages 4–10: arts & crafts, mini-disco, storytelling, pool games, foam parties, and table games.',
    location: 'Kids Zone',
    openHours: '9:00 AM – 6:00 PM',
    priceNote: 'Complimentary',
    icon: '🎠',
    zoneId: 'zone-kids',
  },
  {
    id: 'fac-07',
    name: 'Aqua Park',
    description:
      'Water slides and splash features for children and adults, adjacent to the main pool area.',
    location: 'Pool Area',
    openHours: '10:00 AM – 6:00 PM',
    priceNote: 'Complimentary',
    icon: '🎢',
    zoneId: 'zone-pools',
  },
  {
    id: 'fac-08',
    name: 'Games Area',
    description:
      'Table tennis, darts, pool table, and other games. Daily tournament schedule posted by the animation team.',
    location: 'Recreation Area',
    openHours: '10:00 AM – 10:00 PM',
    priceNote: 'Complimentary',
    icon: '🏓',
    zoneId: 'zone-entertainment',
  },
  {
    id: 'fac-09',
    name: 'Amphitheater',
    description:
      'Open-air amphitheater hosting nightly shows — Fire Show, Belly Dance Gala, Live Music, Folklore Night and more.',
    location: 'Central Gardens',
    openHours: 'Shows from 8:00 PM',
    priceNote: 'Complimentary',
    icon: '🎭',
    zoneId: 'zone-entertainment',
  },
];

// ─── Resort zones (for map screen) ───────────────────────────────────────────

export const RESORT_ZONES: ResortZone[] = [
  {
    id: 'zone-pools',
    name: 'Pool Complex',
    description: '5 pools covering 2,590 m² — the centre of daytime resort life.',
    icon: '🏊',
    accentColor: '#00B4D8',
    facilityIds: ['fac-07'],
    imageKey: 'resort_pool',
  },
  {
    id: 'zone-beach',
    name: 'Beach & Water Sports',
    description: 'Private beach at Abu Dabbab Bay with snorkelling, diving, and watersports.',
    icon: '🏖️',
    accentColor: '#0096B4',
    facilityIds: ['fac-03', 'fac-04', 'fac-05'],
    imageKey: 'resort_beach',
  },
  {
    id: 'zone-dining',
    name: 'Dining & Bars',
    description: '5 restaurants and 6 bars — from beachfront seafood to an Italian trattoria.',
    icon: '🍽️',
    accentColor: '#004AAD',
    facilityIds: [],
    imageKey: 'resort_lobby',
  },
  {
    id: 'zone-wellness',
    name: 'Wellness & Fitness',
    description: 'Planet Spa treatments and a 24-hour gym.',
    icon: '💆',
    accentColor: '#7B68EE',
    facilityIds: ['fac-01', 'fac-02'],
    imageKey: 'resort_lobby',
  },
  {
    id: 'zone-entertainment',
    name: 'Entertainment',
    description: 'Amphitheater, games area, and nightly shows.',
    icon: '🎭',
    accentColor: '#6A0DAD',
    facilityIds: ['fac-08', 'fac-09'],
    imageKey: 'resort_pool',
  },
  {
    id: 'zone-kids',
    name: 'Kids Zone',
    description: 'Kids Club, mini-disco, paddling pool, and the Aqua Park.',
    icon: '🎠',
    accentColor: '#FF8C00',
    facilityIds: ['fac-06', 'fac-07'],
    imageKey: 'resort_pool',
  },
];

// ─── Helper: facilities for a zone ───────────────────────────────────────────

export function getFacilitiesForZone(zone: ResortZone): Facility[] {
  return FACILITIES.filter((f) => zone.facilityIds.includes(f.id));
}

// ─── Helper: pools for a zone ─────────────────────────────────────────────────

export function getPoolsForZone(zone: ResortZone): Pool[] {
  const poolZones: Record<string, string[]> = {
    'zone-pools':  ['pool-01', 'pool-02', 'pool-03', 'pool-04'],
    'zone-kids':   ['pool-05'],
    'zone-beach':  [],
  };
  const ids = poolZones[zone.id] ?? [];
  return POOLS.filter((p) => ids.includes(p.id));
}

// ─── Image resolver (used inside components) ─────────────────────────────────
// Returns a require() result for known local keys, or { uri } for remote URLs.
// Call this at the component level — do not store in data (require must be static).

export const LOCAL_IMAGE_KEYS = ['resort_beach', 'resort_lobby', 'resort_pool'] as const;
export type LocalImageKey = typeof LOCAL_IMAGE_KEYS[number];
