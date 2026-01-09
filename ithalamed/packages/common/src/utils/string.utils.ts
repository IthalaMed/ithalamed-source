/**
 * String utility functions for IthalaMed platform
 */

/**
 * Capitalize the first letter of a string
 * @param str - String to capitalize
 * @returns Capitalized string
 */
export function capitalize(str: string): string {
  if (! str) return '';
  return str.charAt(0).toUpperCase() + str.slice(1).toLowerCase();
}

/**
 * Capitalize the first letter of each word
 * @param str - String to title case
 * @returns Title cased string
 */
export function titleCase(str: string): string {
  if (!str) return '';
  return str
    .toLowerCase()
    .split(' ')
    .map(word => word.charAt(0).toUpperCase() + word.slice(1))
    .join(' ');
}

/**
 * Convert string to kebab-case
 * @param str - String to convert
 * @returns Kebab-cased string
 */
export function toKebabCase(str: string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1-$2')
    .replace(/[\s_]+/g, '-')
    .toLowerCase();
}

/**
 * Convert string to snake_case
 * @param str - String to convert
 * @returns Snake-cased string
 */
export function toSnakeCase(str:  string): string {
  return str
    .replace(/([a-z])([A-Z])/g, '$1_$2')
    .replace(/[\s-]+/g, '_')
    .toLowerCase();
}

/**
 * Convert string to camelCase
 * @param str - String to convert
 * @returns Camel-cased string
 */
export function toCamelCase(str: string): string {
  return str
    .replace(/(? :^\w|[A-Z]|\b\w)/g, (letter, index) =>
      index === 0 ?  letter.toLowerCase() : letter.toUpperCase(),
    )
    .replace(/[\s-_]+/g, '');
}

/**
 * Truncate string to specified length
 * @param str - String to truncate
 * @param maxLength - Maximum length
 * @param suffix - Suffix to add when truncated (default: '...')
 * @returns Truncated string
 */
export function truncate(str: string, maxLength: number, suffix = '.. .'): string {
  if (!str || str.length <= maxLength) return str;
  return str.slice(0, maxLength - suffix.length) + suffix;
}

/**
 * Remove extra whitespace from string
 * @param str - String to clean
 * @returns Cleaned string
 */
export function cleanWhitespace(str: string): string {
  return str.replace(/\s+/g, ' ').trim();
}

/**
 * Check if string is empty or only whitespace
 * @param str - String to check
 * @returns True if empty or whitespace
 */
export function isBlank(str: string | null | undefined): boolean {
  return !str || str.trim().length === 0;
}

/**
 * Check if string is not empty
 * @param str - String to check
 * @returns True if not empty
 */
export function isNotBlank(str: string | null | undefined): boolean {
  return !isBlank(str);
}

/**
 * Generate initials from name
 * @param name - Full name
 * @param maxInitials - Maximum number of initials (default: 2)
 * @returns Initials string
 */
export function getInitials(name: string, maxInitials = 2): string {
  if (!name) return '';
  
  const words = name.trim().split(/\s+/);
  const initials = words
    .map(word => word. charAt(0).toUpperCase())
    .slice(0, maxInitials)
    .join('');
  
  return initials;
}

/**
 * Format name as "Last, First Middle"
 * @param firstName - First name
 * @param lastName - Last name
 * @param middleName - Middle name (optional)
 * @returns Formatted name
 */
export function formatNameLastFirst(
  firstName: string,
  lastName: string,
  middleName?: string,
): string {
  const parts = [lastName, firstName];
  if (middleName) {
    parts.push(middleName);
  }
  return `${lastName}, ${firstName}${middleName ? ` ${middleName}` : ''}`;
}

/**
 * Format full name
 * @param firstName - First name
 * @param lastName - Last name
 * @param middleName - Middle name (optional)
 * @returns Full name string
 */
export function formatFullName(
  firstName: string,
  lastName: string,
  middleName?: string,
): string {
  if (middleName) {
    return `${firstName} ${middleName} ${lastName}`;
  }
  return `${firstName} ${lastName}`;
}

/**
 * Mask sensitive string (e.g., phone number, ID)
 * @param str - String to mask
 * @param visibleChars - Number of visible characters at end
 * @param maskChar - Character to use for masking (default: '*')
 * @returns Masked string
 */
export function maskString(str: string, visibleChars = 4, maskChar = '*'): string {
  if (!str || str.length <= visibleChars) return str;
  
  const masked = maskChar.repeat(str.length - visibleChars);
  const visible = str.slice(-visibleChars);
  
  return masked + visible;
}

/**
 * Mask email address
 * @param email - Email to mask
 * @returns Masked email (e.g., "t***@example.com")
 */
export function maskEmail(email:  string): string {
  if (!email || ! email.includes('@')) return email;
  
  const [localPart, domain] = email. split('@');
  const maskedLocal =
    localPart.length > 2
      ? localPart.charAt(0) + '*'. repeat(localPart.length - 1)
      : localPart;
  
  return `${maskedLocal}@${domain}`;
}

/**
 * Mask phone number
 * @param phone - Phone number to mask
 * @returns Masked phone (e. g., "+27******567")
 */
export function maskPhoneNumber(phone: string): string {
  if (!phone || phone.length < 6) return phone;
  
  const prefix = phone.slice(0, 3);
  const suffix = phone.slice(-3);
  const masked = '*'.repeat(phone.length - 6);
  
  return `${prefix}${masked}${suffix}`;
}

/**
 * Remove all non-alphanumeric characters
 * @param str - String to clean
 * @returns Alphanumeric only string
 */
export function alphanumericOnly(str: string): string {
  return str.replace(/[^a-zA-Z0-9]/g, '');
}

/**
 * Remove all non-numeric characters
 * @param str - String to clean
 * @returns Numeric only string
 */
export function numericOnly(str:  string): string {
  return str.replace(/[^0-9]/g, '');
}

/**
 * Generate a random string
 * @param length - Length of string
 * @param charset - Character set to use
 * @returns Random string
 */
export function randomString(
  length: number,
  charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789',
): string {
  let result = '';
  for (let i = 0; i < length; i++) {
    result += charset.charAt(Math.floor(Math.random() * charset.length));
  }
  return result;
}

/**
 * Generate a random alphanumeric code (uppercase)
 * @param length - Length of code
 * @returns Random code
 */
export function generateCode(length = 6): string {
  const charset = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  return randomString(length, charset);
}

/**
 * Slugify a string (URL-safe)
 * @param str - String to slugify
 * @returns URL-safe slug
 */
export function slugify(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .replace(/[^\w\s-]/g, '')
    .replace(/[\s_-]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

/**
 * Escape HTML special characters
 * @param str - String to escape
 * @returns Escaped string
 */
export function escapeHtml(str: string): string {
  const htmlEntities:  Record<string, string> = {
    '&': '&amp;',
    '<': '&lt;',
    '>': '&gt;',
    '"':  '&quot;',
    "'": '&#39;',
  };
  
  return str. replace(/[&<>"']/g, char => htmlEntities[char]);
}

/**
 * Pluralize a word based on count
 * @param count - Number
 * @param singular - Singular form
 * @param plural - Plural form (optional, defaults to singular + 's')
 * @returns Pluralized word with count
 */
export function pluralize(count: number, singular: string, plural?: string): string {
  const word = count === 1 ? singular : (plural || `${singular}s`);
  return `${count} ${word}`;
}

/**
 * Extract numbers from a string
 * @param str - String containing numbers
 * @returns Array of numbers
 */
export function extractNumbers(str: string): number[] {
  const matches = str.match(/\d+/g);
  return matches ? matches.map(Number) : [];
}

/**
 * Check if string contains only letters
 * @param str - String to check
 * @returns True if only letters
 */
export function isAlphabetic(str: string): boolean {
  return /^[a-zA-Z]+$/.test(str);
}

/**
 * Check if string contains only letters and spaces
 * @param str - String to check
 * @returns True if only letters and spaces
 */
export function isAlphabeticWithSpaces(str: string): boolean {
  return /^[a-zA-Z\s]+$/.test(str);
}

/**
 * Normalize string for comparison (lowercase, trim, remove accents)
 * @param str - String to normalize
 * @returns Normalized string
 */
export function normalizeForComparison(str: string): string {
  return str
    .toLowerCase()
    .trim()
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '');
}
