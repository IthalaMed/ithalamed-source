/**
 * Phone number utility functions for IthalaMed platform
 */

/**
 * Country phone codes for African countries
 */
export const AFRICAN_COUNTRY_CODES:  Record<string, string> = {
  ZA: '+27', // South Africa
  NG: '+234', // Nigeria
  KE: '+254', // Kenya
  GH: '+233', // Ghana
  UG: '+256', // Uganda
  TZ: '+255', // Tanzania
  ZW: '+263', // Zimbabwe
  ZM: '+260', // Zambia
  BW: '+267', // Botswana
  NA: '+264', // Namibia
  MZ: '+258', // Mozambique
  ET: '+251', // Ethiopia
  EG: '+20', // Egypt
  MA: '+212', // Morocco
};

/**
 * Format phone number to E.164 format
 * @param phoneNumber - Phone number to format
 * @param countryCode - Country code (default: 'ZA' for South Africa)
 * @returns Formatted phone number or null if invalid
 */
export function formatToE164(phoneNumber: string, countryCode = 'ZA'): string | null {
  // Remove all non-numeric characters except +
  let cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // If already in E.164 format
  if (cleaned.startsWith('+')) {
    return cleaned;
  }

  // Get country prefix
  const countryPrefix = AFRICAN_COUNTRY_CODES[countryCode];
  if (!countryPrefix) {
    return null;
  }

  // Remove leading zero if present
  if (cleaned.startsWith('0')) {
    cleaned = cleaned.substring(1);
  }

  // Add country prefix
  return `${countryPrefix}${cleaned}`;
}

/**
 * Format phone number for display
 * @param phoneNumber - Phone number in E.164 format
 * @returns Formatted display string
 */
export function formatPhoneForDisplay(phoneNumber: string): string {
  if (!phoneNumber) return '';

  // South African format: +27 XX XXX XXXX
  if (phoneNumber.startsWith('+27')) {
    const local = phoneNumber.substring(3);
    if (local.length === 9) {
      return `+27 ${local. substring(0, 2)} ${local.substring(2, 5)} ${local.substring(5)}`;
    }
  }

  // Nigerian format: +234 XXX XXX XXXX
  if (phoneNumber.startsWith('+234')) {
    const local = phoneNumber.substring(4);
    if (local.length === 10) {
      return `+234 ${local.substring(0, 3)} ${local.substring(3, 6)} ${local.substring(6)}`;
    }
  }

  // Kenyan format: +254 XXX XXX XXX
  if (phoneNumber. startsWith('+254')) {
    const local = phoneNumber.substring(4);
    if (local.length === 9) {
      return `+254 ${local.substring(0, 3)} ${local.substring(3, 6)} ${local.substring(6)}`;
    }
  }

  // Default:  just add spaces every 3 digits after country code
  return phoneNumber;
}

/**
 * Extract country code from phone number
 * @param phoneNumber - Phone number in E.164 format
 * @returns Country code (ISO 3166-1 alpha-2) or null
 */
export function extractCountryCode(phoneNumber: string): string | null {
  for (const [code, prefix] of Object.entries(AFRICAN_COUNTRY_CODES)) {
    if (phoneNumber.startsWith(prefix)) {
      return code;
    }
  }
  return null;
}

/**
 * Extract local number (without country code)
 * @param phoneNumber - Phone number in E. 164 format
 * @returns Local number
 */
export function extractLocalNumber(phoneNumber: string): string {
  for (const prefix of Object.values(AFRICAN_COUNTRY_CODES)) {
    if (phoneNumber.startsWith(prefix)) {
      return phoneNumber. substring(prefix.length);
    }
  }
  // If no country code found, return as-is without +
  return phoneNumber. replace(/^\+/, '');
}

/**
 * Validate South African phone number
 * @param phoneNumber - Phone number to validate
 * @returns True if valid SA phone number
 */
export function isValidSAPhone(phoneNumber:  string): boolean {
  // Remove non-digits except +
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // E.164 format: +27 followed by 9 digits
  if (/^\+27\d{9}$/.test(cleaned)) {
    return true;
  }

  // Local format: 0 followed by 9 digits
  if (/^0\d{9}$/. test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Validate Nigerian phone number
 * @param phoneNumber - Phone number to validate
 * @returns True if valid Nigerian phone number
 */
export function isValidNigerianPhone(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // E.164 format: +234 followed by 10 digits
  if (/^\+234\d{10}$/. test(cleaned)) {
    return true;
  }

  // Local format: 0 followed by 10 digits
  if (/^0\d{10}$/.test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Validate Kenyan phone number
 * @param phoneNumber - Phone number to validate
 * @returns True if valid Kenyan phone number
 */
export function isValidKenyanPhone(phoneNumber: string): boolean {
  const cleaned = phoneNumber.replace(/[^\d+]/g, '');

  // E.164 format: +254 followed by 9 digits
  if (/^\+254\d{9}$/.test(cleaned)) {
    return true;
  }

  // Local format: 0 followed by 9 digits
  if (/^0\d{9}$/. test(cleaned)) {
    return true;
  }

  return false;
}

/**
 * Get mobile network from SA phone number
 * @param phoneNumber - SA phone number
 * @returns Network name or null
 */
export function getSAMobileNetwork(phoneNumber: string): string | null {
  const e164 = formatToE164(phoneNumber, 'ZA');
  if (!e164 || !e164.startsWith('+27')) {
    return null;
  }

  const prefix = e164.substring(3, 5);

  // Vodacom prefixes
  if (['71', '72', '73', '76', '79', '81', '82']. includes(prefix)) {
    return 'Vodacom';
  }

  // MTN prefixes
  if (['60', '61', '62', '63', '64', '65', '66', '67', '68', '69', '70', '78', '83', '84']. includes(prefix)) {
    return 'MTN';
  }

  // Cell C prefixes
  if (['74', '75', '84']. includes(prefix)) {
    return 'Cell C';
  }

  // Telkom prefixes
  if (['81']. includes(prefix)) {
    return 'Telkom';
  }

  return null;
}

/**
 * Normalize phone number for storage
 * @param phoneNumber - Phone number in any format
 * @param countryCode - Default country code
 * @returns Normalized E.164 format or null
 */
export function normalizePhoneNumber(phoneNumber: string, countryCode = 'ZA'): string | null {
  if (!phoneNumber) {
    return null;
  }

  const formatted = formatToE164(phoneNumber, countryCode);
  if (!formatted) {
    return null;
  }

  // Validate the formatted number has correct length
  const countryPrefix = AFRICAN_COUNTRY_CODES[countryCode];
  if (!countryPrefix) {
    return null;
  }

  // SA numbers should be +27 + 9 digits = 12 characters total
  if (countryCode === 'ZA' && formatted.length !== 12) {
    return null;
  }

  // Nigerian numbers should be +234 + 10 digits = 14 characters total
  if (countryCode === 'NG' && formatted.length !== 14) {
    return null;
  }

  // Kenyan numbers should be +254 + 9 digits = 13 characters total
  if (countryCode === 'KE' && formatted.length !== 13) {
    return null;
  }

  return formatted;
}
