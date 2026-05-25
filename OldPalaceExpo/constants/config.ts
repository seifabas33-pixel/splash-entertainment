/**
 * Centralised resort configuration.
 *
 * All magic strings that were previously scattered across screens
 * (resort name, location, phone numbers, session rules) live here.
 * Changing the resort name / contact details now requires a single edit.
 */

export const RESORT = {
  /** Full marketing name */
  name:          'Old Palace Resort Sahl Hasheesh',
  shortName:     'Old Palace',
  brandName:     'Splash Entertainment',
  location:      'Sahl Hasheesh Bay, Hurghada, Egypt',
  locationShort: 'Sahl Hasheesh · Egypt',
  checkIn:       '14:00',
  checkOut:      '12:00',
  receptionDial: '0',
  animationDial: '117',
  emergencyDial: '999',
  poolCount:     3,
  roomCount:     292,
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
