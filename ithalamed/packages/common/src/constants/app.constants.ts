/**
 * Application-wide constants
 */

/**
 * Default pagination settings
 */
export const PAGINATION = {
  DEFAULT_PAGE: 1,
  DEFAULT_LIMIT: 20,
  MAX_LIMIT:  100,
} as const;

/**
 * OTP settings
 */
export const OTP = {
  LENGTH: 6,
  EXPIRY_MINUTES: 10,
  MAX_ATTEMPTS:  5,
  COOLDOWN_SECONDS: 60,
} as const;

/**
 * JWT settings (defaults, can be overridden by environment)
 */
export const JWT = {
  ACCESS_TOKEN_EXPIRY:  '15m',
  REFRESH_TOKEN_EXPIRY: '7d',
  MFA_TOKEN_EXPIRY: '5m',
} as const;

/**
 * Password policy
 */
export const PASSWORD_POLICY = {
  MIN_LENGTH: 8,
  MAX_LENGTH: 128,
  REQUIRE_UPPERCASE: true,
  REQUIRE_LOWERCASE: true,
  REQUIRE_NUMBER: true,
  REQUIRE_SPECIAL_CHAR: true,
} as const;

/**
 * PIN policy
 */
export const PIN_POLICY = {
  MIN_LENGTH: 4,
  MAX_LENGTH: 6,
} as const;

/**
 * Account security
 */
export const ACCOUNT_SECURITY = {
  MAX_LOGIN_ATTEMPTS: 5,
  LOCKOUT_DURATION_MINUTES: 30,
  SESSION_TIMEOUT_MINUTES: 60,
  MAX_ACTIVE_SESSIONS: 5,
} as const;

/**
 * File upload limits
 */
export const FILE_UPLOAD = {
  MAX_SIZE_MB: 10,
  MAX_SIZE_BYTES: 10 * 1024 * 1024,
  ALLOWED_IMAGE_TYPES: ['image/jpeg', 'image/png', 'image/webp'],
  ALLOWED_DOCUMENT_TYPES: ['application/pdf', 'image/jpeg', 'image/png'],
  ALLOWED_EXTENSIONS: ['jpg', 'jpeg', 'png', 'pdf', 'webp'],
} as const;

/**
 * Appointment settings
 */
export const APPOINTMENT = {
  MIN_DURATION_MINUTES: 15,
  MAX_DURATION_MINUTES:  120,
  DEFAULT_DURATION_MINUTES: 30,
  BUFFER_MINUTES: 5,
  MAX_ADVANCE_BOOKING_DAYS: 90,
  MIN_CANCELLATION_HOURS: 24,
} as const;

/**
 * Prescription settings
 */
export const PRESCRIPTION = {
  DEFAULT_EXPIRY_MONTHS: 6,
  MAX_REFILLS: 5,
} as const;

/**
 * Rate limiting
 */
export const RATE_LIMIT = {
  WINDOW_MS: 60 * 1000, // 1 minute
  MAX_REQUESTS: 100,
  AUTH_MAX_REQUESTS: 10,
  OTP_MAX_REQUESTS: 3,
} as const;
