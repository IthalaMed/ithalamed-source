/**
 * Phone Number Validator and Formatter
 * 
 * Supports South African and other African phone formats
 */

export interface PhoneValidationResult {
  isValid: boolean;
  normalized?:  string;
  countryCode?: string;
  nationalNumber?: string;
  errorMessage?: string;
}

/**
 * Country phone configurations
 */
const PHONE_CONFIGS:  Record<string, { code: string; length: number; pattern: RegExp }> = {
  ZA: { code: '+27', length: 9, pattern: /^[6-8]\d{8}$/ }, // South Africa
  NG: { code: '+234', length: 10, pattern: /^[7-9]\d{9}$/ }, // Nigeria
  KE: { code: '+254', length: 9, pattern: /^[7]\d{8}$/ }, // Kenya
  GH: { code: '+233', length: 9, pattern: /^[2-5]\d{8}$/ }, // Ghana
  UG: { code: '+256', length: 9, pattern: /^[7]\d{8}$/ }, // Uganda
  TZ: { code: '+255', length: 9, pattern: /^[6-7]\d{8}$/ }, // Tanzania
  ZW: { code: '+263', length: 9, pattern: /^[7]\d{8}$/ }, // Zimbabwe
  ZM: { code: '+260', length: 9, pattern: /^[9]\d{8}$/ }, // Zambia
};

/**
 * Validate phone number
 */
export function validatePhoneNumber(
  phoneNumber: string,
  countryCode:  string = 'ZA',
): PhoneValidationResult {
  // Remove all non-digit characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  const config = PHONE_CONFIGS[countryCode. toUpperCase()];
  if (!config) {
    return {
      isValid: false,
      errorMessage: `Unsupported country code: ${countryCode}`,
    };
  }

  // Handle different input formats
  if (cleaned.startsWith(config.code)) {
    // Already has country code (+27...)
    cleaned = cleaned.substring(config.code.length);
  } else if (cleaned.startsWith(config.code. substring(1))) {
    // Has country code without + (27...)
    cleaned = cleaned.substring(config.code.length - 1);
  } else if (cleaned.startsWith('0')) {
    // Local format (0...)
    cleaned = cleaned.substring(1);
  }

  // Validate national number
  if (! config.pattern.test(cleaned)) {
    return {
      isValid: false,
      errorMessage:  `Invalid ${countryCode} phone number format`,
    };
  }

  // Return normalized E.164 format
  const normalized = `${config.code}${cleaned}`;

  return {
    isValid: true,
    normalized,
    countryCode:  config.code,
    nationalNumber: cleaned,
  };
}

/**
 * Format phone number for display
 */
export function formatPhoneNumber(phoneNumber: string, countryCode: string = 'ZA'): string {
  const result = validatePhoneNumber(phoneNumber, countryCode);
  if (!result.isValid || ! result.nationalNumber) {
    return phoneNumber;
  }

  // Format based on country
  switch (countryCode. toUpperCase()) {
    case 'ZA':
      // +27 82 123 4567
      return `${result.countryCode} ${result.nationalNumber. substring(0, 2)} ${result.nationalNumber.substring(2, 5)} ${result.nationalNumber.substring(5)}`;
    default:
      return result.normalized || phoneNumber;
  }
}

/**
 * Mask phone number for display
 */
export function maskPhoneNumber(phoneNumber: string): string {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');
  if (cleaned.length < 8) return phoneNumber;
  return `${cleaned.substring(0, cleaned.length - 4)}****`;
}
