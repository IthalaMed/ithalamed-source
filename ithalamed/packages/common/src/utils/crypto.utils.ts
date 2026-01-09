/**
 * Cryptographic utility functions for IthalaMed platform
 * Note: For server-side use only (requires Node.js crypto module)
 */

import * as crypto from 'crypto';

/**
 * Generate a cryptographically secure random string
 * @param length - Length of the string in bytes (output will be hex, so 2x chars)
 * @returns Random hex string
 */
export function generateSecureToken(length = 32): string {
  return crypto.randomBytes(length).toString('hex');
}

/**
 * Generate a random numeric OTP
 * @param length - Length of OTP (default: 6)
 * @returns Numeric OTP string
 */
export function generateOtp(length = 6): string {
  const max = Math.pow(10, length);
  const min = Math.pow(10, length - 1);
  const otp = crypto.randomInt(min, max);
  return otp.toString();
}

/**
 * Generate a UUID v4
 * @returns UUID string
 */
export function generateUuid(): string {
  return crypto. randomUUID();
}

/**
 * Hash a string using SHA-256
 * @param data - Data to hash
 * @returns Hashed string (hex)
 */
export function hashSha256(data: string): string {
  return crypto.createHash('sha256').update(data).digest('hex');
}

/**
 * Hash a string using SHA-512
 * @param data - Data to hash
 * @returns Hashed string (hex)
 */
export function hashSha512(data: string): string {
  return crypto.createHash('sha512').update(data).digest('hex');
}

/**
 * Create HMAC signature
 * @param data - Data to sign
 * @param secret - Secret key
 * @param algorithm - Hash algorithm (default: sha256)
 * @returns HMAC signature (hex)
 */
export function createHmac(
  data: string,
  secret: string,
  algorithm:  'sha256' | 'sha512' = 'sha256',
): string {
  return crypto.createHmac(algorithm, secret).update(data).digest('hex');
}

/**
 * Verify HMAC signature
 * @param data - Original data
 * @param signature - Signature to verify
 * @param secret - Secret key
 * @param algorithm - Hash algorithm (default: sha256)
 * @returns True if signature is valid
 */
export function verifyHmac(
  data: string,
  signature: string,
  secret: string,
  algorithm: 'sha256' | 'sha512' = 'sha256',
): boolean {
  const expectedSignature = createHmac(data, secret, algorithm);
  return crypto.timingSafeEqual(
    Buffer.from(signature, 'hex'),
    Buffer.from(expectedSignature, 'hex'),
  );
}

/**
 * Generate a random alphanumeric string
 * @param length - Length of string
 * @returns Random alphanumeric string
 */
export function generateRandomString(length: number): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars. length];
  }
  return result;
}

/**
 * Generate a random alphanumeric code (uppercase only)
 * @param length - Length of code
 * @returns Random uppercase alphanumeric code
 */
export function generateCode(length = 6): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789';
  let result = '';
  const randomBytes = crypto.randomBytes(length);
  for (let i = 0; i < length; i++) {
    result += chars[randomBytes[i] % chars.length];
  }
  return result;
}

/**
 * Generate a patient/appointment reference number
 * @param prefix - Prefix (e.g., 'PT', 'APT', 'RX')
 * @param length - Length of numeric part
 * @returns Reference number (e.g., 'PT2024000001')
 */
export function generateReferenceNumber(prefix: string, length = 6): string {
  const year = new Date().getFullYear();
  const randomPart = generateCode(length);
  return `${prefix}${year}${randomPart}`;
}

/**
 * Constant-time string comparison (prevents timing attacks)
 * @param a - First string
 * @param b - Second string
 * @returns True if strings are equal
 */
export function secureCompare(a: string, b:  string): boolean {
  if (a.length !== b.length) {
    return false;
  }
  return crypto.timingSafeEqual(Buffer.from(a), Buffer.from(b));
}
