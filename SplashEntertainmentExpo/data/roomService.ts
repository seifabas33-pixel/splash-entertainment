// ─── Types ────────────────────────────────────────────────────────────────────

export type ServiceCategoryId =
  | 'housekeeping'
  | 'fnb'
  | 'maintenance'
  | 'concierge';

export interface ServiceItem {
  id: string;
  label: string;
  description: string | null;
  requiresQuantity: boolean;
  requiresNote: boolean;
  estimatedMinutes: number;
}

export interface ServiceCategory {
  id: ServiceCategoryId;
  label: string;
  icon: string;
  description: string;
  items: ServiceItem[];
}

// ─── Service categories and items ────────────────────────────────────────────

export const SERVICE_CATEGORIES: ServiceCategory[] = [
  {
    id: 'housekeeping',
    label: 'Housekeeping',
    icon: '🛏️',
    description: 'Room cleaning and linen requests',
    items: [
      {
        id: 'hk-01',
        label: 'Extra Towels',
        description: 'Bath or beach towels',
        requiresQuantity: true,
        requiresNote: false,
        estimatedMinutes: 20,
      },
      {
        id: 'hk-02',
        label: 'Pillow Change',
        description: 'Soft, medium, or firm pillows',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 20,
      },
      {
        id: 'hk-03',
        label: 'Extra Blanket',
        description: null,
        requiresQuantity: true,
        requiresNote: false,
        estimatedMinutes: 20,
      },
      {
        id: 'hk-04',
        label: 'Turndown Service',
        description: 'Evening room preparation',
        requiresQuantity: false,
        requiresNote: false,
        estimatedMinutes: 30,
      },
      {
        id: 'hk-05',
        label: 'Full Room Clean',
        description: 'Complete room clean with fresh linen',
        requiresQuantity: false,
        requiresNote: false,
        estimatedMinutes: 45,
      },
    ],
  },
  {
    id: 'fnb',
    label: 'Food & Beverage',
    icon: '🍽️',
    description: 'In-room dining and beverages',
    items: [
      {
        id: 'fnb-01',
        label: 'In-Room Dining Menu',
        description: 'Request the full menu card',
        requiresQuantity: false,
        requiresNote: false,
        estimatedMinutes: 5,
      },
      {
        id: 'fnb-02',
        label: 'Coffee / Tea',
        description: 'Hot beverage delivery',
        requiresQuantity: true,
        requiresNote: true,
        estimatedMinutes: 15,
      },
      {
        id: 'fnb-03',
        label: 'Bottle of Water',
        description: 'Still or sparkling',
        requiresQuantity: true,
        requiresNote: true,
        estimatedMinutes: 15,
      },
      {
        id: 'fnb-04',
        label: 'Soft Drinks',
        description: 'Selection of canned sodas',
        requiresQuantity: true,
        requiresNote: true,
        estimatedMinutes: 15,
      },
      {
        id: 'fnb-05',
        label: 'Fresh Fruit Plate',
        description: 'Seasonal fresh fruit selection',
        requiresQuantity: false,
        requiresNote: false,
        estimatedMinutes: 25,
      },
    ],
  },
  {
    id: 'maintenance',
    label: 'Maintenance',
    icon: '🔧',
    description: 'Technical issues in your room',
    items: [
      {
        id: 'mx-01',
        label: 'Air Conditioning',
        description: 'Temperature or airflow issue',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 30,
      },
      {
        id: 'mx-02',
        label: 'Lighting Issue',
        description: 'Bulb out or switch not working',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 30,
      },
      {
        id: 'mx-03',
        label: 'Safe Not Opening',
        description: 'In-room safe assistance',
        requiresQuantity: false,
        requiresNote: false,
        estimatedMinutes: 20,
      },
      {
        id: 'mx-04',
        label: 'Plumbing',
        description: 'Shower, sink, or drain issue',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 45,
      },
      {
        id: 'mx-05',
        label: 'Internet / TV',
        description: 'Wi-Fi or TV connection issue',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 20,
      },
    ],
  },
  {
    id: 'concierge',
    label: 'Concierge',
    icon: '🔑',
    description: 'Reservations, transport & services',
    items: [
      {
        id: 'co-01',
        label: 'Restaurant Reservation',
        description: 'Book Amasis, Noba, or Souk Café',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 10,
      },
      {
        id: 'co-02',
        label: 'Excursion Booking',
        description: 'Snorkelling, diving, or desert tours',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 30,
      },
      {
        id: 'co-03',
        label: 'Taxi / Transfer',
        description: 'Airport or city transfer',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 30,
      },
      {
        id: 'co-04',
        label: 'Wake-up Call',
        description: 'Set a morning alarm call',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 5,
      },
      {
        id: 'co-05',
        label: 'Laundry',
        description: 'Pick-up and same-day return service',
        requiresQuantity: false,
        requiresNote: true,
        estimatedMinutes: 60,
      },
    ],
  },
];
