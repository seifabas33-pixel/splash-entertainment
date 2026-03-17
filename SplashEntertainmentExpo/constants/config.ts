/**
 * Centralised resort configuration.
 *
 * All magic strings that were previously scattered across screens
 * (resort name, location, phone numbers, session rules) live here.
 * Changing the resort name / contact details now requires a single edit.
 */

export const RESORT = {
  /** Full marketing name */
  name:         'Hilton Marsa Alam Nubian Resort',
  /** Short display name used in space-constrained contexts */
  shortName:    'Hilton Marsa Alam',
  /** App / entertainment brand */
  brandName:    'Splash Entertainment',
  /** Full address line */
  location:     'Abu Dabbab Bay, Marsa Alam, Egypt',
  /** Short location used in the landing screen */
  locationShort: 'Abu Dabbab Bay · Egypt',
  /** Check-in / check-out times (24-h strings) */
  checkIn:      '15:00',
  checkOut:     '12:00',
  /** Internal room-service dial code (prefix for all in-room calls) */
  receptionDial: '0',
  /** Animation office internal extension */
  animationDial: '117',
  /** Emergency contact */
  emergencyDial: '999',
  /** Approximate pool count shown on the map overview */
  poolCount:     5,
  /** Room count shown on the map overview */
  roomCount:     400,
} as const;

/**
 * Auth / session configuration.
 *
 * Keeping these as named constants (rather than bare numbers in code) makes
 * them easy to review and adjust without hunting through screens.
 */
export const AUTH_CONFIG = {
  /** Number of digits in a staff PIN */
  pinLength: 4,
  /**
   * Idle session lifetime in milliseconds.
   * After this period of inactivity the app auto-logs out the staff member.
   * Default: 8 hours — covers a typical double shift.
   */
  sessionDurationMs: 8 * 60 * 60 * 1000,
  /**
   * Maximum consecutive failed PIN attempts before the keypad is
   * temporarily disabled (future feature — currently enforced in UI only).
   */
  maxFailedAttempts: 5,
  /**
   * Lock-out duration in milliseconds after max failed attempts.
   * Default: 30 seconds.
   */
  lockoutDurationMs: 30 * 1000,
} as const;

/**
 * Feature flags.
 *
 * Flip these to enable work-in-progress features without code deletion.
 * In a CI/CD pipeline these would come from environment variables.
 */
export const FEATURES = {
  /** Show real-time weather widget on the guest dashboard */
  liveWeather:     false,
  /** Enable push notifications for activity reminders */
  pushReminders:   false,
  /** Allow staff to submit shift notes from the entertainer dashboard */
  shiftNotes:      false,
  /** QR-code check-in for activities */
  activityQrScan:  false,
} as const;
