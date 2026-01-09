/**
 * Regular expression patterns for validation
 */
export const REGEX = {
  /**
   * Email address pattern
   */
  EMAIL: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,

  /**
   * South African phone number (+27 followed by 9 digits)
   */
  SA_PHONE: /^\+27[0-9]{9}$/,

  /**
   * International phone number (E.164 format)
   */
  E164_PHONE: /^\+[1-9]\d{1,14}$/,

  /**
   * South African ID number (13 digits)
   */
  SA_ID_NUMBER: /^\d{13}$/,

  /**
   * HPCSA number (2 letters followed by 6-7 digits)
   */
  HPCSA_NUMBER: /^[A-Z]{2}\d{6,7}$/,

  /**
   * UUID v4
   */
  UUID:  /^[0-9a-f]{8}-[0-9a-f]{4}-4[0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i,

  /**
   * South African postal code (4 digits)
   */
  SA_POSTAL_CODE: /^\d{4}$/,

  /**
   * ICD-10 diagnosis code
   */
  ICD10_CODE: /^[A-Z]\d{2}(\.\d{1,4})?$/,

  /**
   * NAPPI code (6-10 digits)
   */
  NAPPI_CODE: /^\d{6,10}$/,

  /**
   * Password pattern (min 8 chars, upper, lower, number, special)
   */
  STRONG_PASSWORD: /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[!@#$%^&*(),.?":{}|<>]).{8,}$/,

  /**
   * PIN (4-6 digits)
   */
  PIN: /^\d{4,6}$/,

  /**
   * OTP (6 digits)
   */
  OTP: /^\d{6}$/,

  /**
   * Medical aid membership number (alphanumeric, 6-15 chars)
   */
  MEDICAL_AID_NUMBER: /^[A-Za-z0-9]{6,15}$/,

  /**
   * Only letters
   */
  ALPHABETIC: /^[a-zA-Z]+$/,

  /**
   * Letters and spaces (for names)
   */
  NAME:  /^[a-zA-Z\s'-]+$/,

  /**
   * Alphanumeric only
   */
  ALPHANUMERIC: /^[a-zA-Z0-9]+$/,

  /**
   * Slug (lowercase letters, numbers, hyphens)
   */
  SLUG:  /^[a-z0-9]+(?:-[a-z0-9]+)*$/,
} as const;
