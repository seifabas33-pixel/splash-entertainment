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
    name: 'Main Pool',
    areaM2: 1800,
    description:
      'The large heated outdoor freshwater main pool — the heart of daytime resort life. Aqua gym, pool games, and animation activities run here throughout the day.',
    features: ['Animation activities', 'Swim-up bar', 'Loungers', 'Sun umbrellas', 'Heated'],
    ageGroup: 'All',
    depthNote: '160 cm maximum depth',
  },
  {
    id: 'pool-02',
    name: 'Jacuzzi Pool',
    areaM2: 350,
    description:
      'Relaxing heated pool with jacuzzi jets — the perfect spot to unwind after a day at the beach or exploring the reef.',
    features: ['Jacuzzi jets', 'Heated', 'Loungers', 'Peaceful zone'],
    ageGroup: 'Adults',
    depthNote: null,
  },
  {
    id: 'pool-03',
    name: "Children's Pool",
    areaM2: 120,
    description:
      'Dedicated shallow pool for younger guests, located right next to the Kids Club for easy supervision and fun.',
    features: ['Shallow entry', 'Kids-safe', 'Adjacent to Kids Club', 'Shaded seating'],
    ageGroup: 'Kids',
    depthNote: '0.6 m maximum depth',
  },
];

// ─── Facilities ───────────────────────────────────────────────────────────────

export const FACILITIES: Facility[] = [
  {
    id: 'fac-01',
    name: 'Horrus Spa',
    description:
      'Full-service spa with body massages, facials, body wraps, hot stone therapy, Turkish hammam, steam bath, sauna, and Jacuzzi treatments. Beachside massages also available.',
    location: 'Spa Wing',
    openHours: '9:00 AM – 9:00 PM',
    priceNote: 'From ~€35 per treatment',
    icon: '💆',
    zoneId: 'zone-wellness',
  },
  {
    id: 'fac-02',
    name: 'Fitness Center',
    description:
      'Fully equipped gym with cardio machines, free weights, and resistance equipment. Daily fitness classes available.',
    location: 'Wellness Wing',
    openHours: '7:00 AM – 10:00 PM',
    priceNote: 'Complimentary for all guests',
    icon: '🏋️',
    zoneId: 'zone-wellness',
  },
  {
    id: 'fac-03',
    name: 'Private Beach',
    description:
      'Approx. 200 m of private sandy beach on Sahl Hasheesh Bay — gentle sandy entry, lifeguard on duty, sun loungers and parasols included.',
    location: 'Sahl Hasheesh Bay',
    openHours: 'Sunrise – Sunset',
    priceNote: 'Complimentary — loungers & parasols included',
    icon: '🏖️',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-04',
    name: 'House Reef Snorkelling',
    description:
      'A coral reef sits just 20–30 m from the shoreline. Snorkel directly from the beach to see colourful reef fish, rays, and corals in crystal-clear Red Sea water.',
    location: 'Beach',
    openHours: 'Sunrise – Sunset',
    priceNote: 'Equipment rental available from the beach team',
    icon: '🤿',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-05',
    name: 'PADI Dive Center',
    description:
      'Professional PADI-certified dive centre with beginner to advanced courses, daily boat dives to Giftun Island and Abu Nuhas wrecks, and full equipment rental.',
    location: 'Beachfront',
    openHours: '8:00 AM – 5:00 PM',
    priceNote: 'From ~€50 per dive. Full courses available.',
    icon: '🌊',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-06',
    name: 'Water Sports Center',
    description:
      'Windsurfing, sailing, kayaking, paddleboarding, banana boat rides, glass-bottom boat trips, and paragliding — all available at or near the beach.',
    location: 'Beach',
    openHours: '9:00 AM – 5:30 PM',
    priceNote: 'Prices vary by activity',
    icon: '🏄',
    zoneId: 'zone-beach',
  },
  {
    id: 'fac-07',
    name: 'Kids Club',
    description:
      'Supervised daytime activities for children: arts & crafts, mini-disco, storytelling, pool games, foam parties, and themed days.',
    location: 'Kids Zone',
    openHours: '9:00 AM – 6:00 PM',
    priceNote: 'Complimentary',
    icon: '🎠',
    zoneId: 'zone-kids',
  },
  {
    id: 'fac-08',
    name: 'Games Area',
    description:
      'Table tennis, beach volleyball, darts, pool table, and more. Daily tournaments organised by the animation team.',
    location: 'Recreation Area',
    openHours: '10:00 AM – 10:00 PM',
    priceNote: 'Complimentary',
    icon: '🏓',
    zoneId: 'zone-entertainment',
  },
  {
    id: 'fac-09',
    name: 'La Bonita',
    description:
      "The resort's underground nightclub and entertainment venue — nightly animation team shows followed by DJ disco. The heart of Old Palace evening life.",
    location: 'Off the Lobby',
    openHours: 'Shows from 8:30 PM',
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
    description: '3 freshwater outdoor pools — main, jacuzzi & kids — the centre of daytime resort life.',
    icon: '🏊',
    accentColor: '#00B4D8',
    facilityIds: [],
    imageKey: 'resort_pool',
  },
  {
    id: 'zone-beach',
    name: 'Beach & Water Sports',
    description: '200 m private sandy beach on Sahl Hasheesh Bay with snorkelling, diving & watersports.',
    icon: '🏖️',
    accentColor: '#0096B4',
    facilityIds: ['fac-03', 'fac-04', 'fac-05', 'fac-06'],
    imageKey: 'resort_beach',
  },
  {
    id: 'zone-dining',
    name: 'Dining & Bars',
    description: '4 restaurants and 5 bars — from Brazilian steakhouse to candlelit fine dining.',
    icon: '🍽️',
    accentColor: '#004AAD',
    facilityIds: [],
    imageKey: 'resort_lobby',
  },
  {
    id: 'zone-wellness',
    name: 'Wellness & Fitness',
    description: 'Horrus Spa with hammam & treatments, plus a fully-equipped fitness center.',
    icon: '💆',
    accentColor: '#7B68EE',
    facilityIds: ['fac-01', 'fac-02'],
    imageKey: 'resort_lobby',
  },
  {
    id: 'zone-entertainment',
    name: 'Entertainment',
    description: 'La Bonita nightclub, games area, and nightly animation shows.',
    icon: '🎭',
    accentColor: '#6A0DAD',
    facilityIds: ['fac-08', 'fac-09'],
    imageKey: 'resort_pool',
  },
  {
    id: 'zone-kids',
    name: 'Kids Zone',
    description: "Kids Club, children's pool, mini-disco, and supervised daily activities.",
    icon: '🎠',
    accentColor: '#FF8C00',
    facilityIds: ['fac-07'],
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
    'zone-pools': ['pool-01', 'pool-02'],
    'zone-kids':  ['pool-03'],
    'zone-beach': [],
  };
  const ids = poolZones[zone.id] ?? [];
  return POOLS.filter((p) => ids.includes(p.id));
}

// ─── Image resolver (used inside components) ─────────────────────────────────
// Returns a require() result for known local keys, or { uri } for remote URLs.
// Call this at the component level — do not store in data (require must be static).

export const LOCAL_IMAGE_KEYS = ['resort_beach', 'resort_lobby', 'resort_pool'] as const;
export type LocalImageKey = typeof LOCAL_IMAGE_KEYS[number];
