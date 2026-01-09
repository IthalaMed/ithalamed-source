/**
 * Validation utility functions for IthalaMed platform
 */

/**
 * Validate email format
 * @param email - Email to validate
 * @returns True if valid email format
 */
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  return emailRegex.test(email);
}

/**
 * Validate phone number (international format)
 * @param phone - Phone number to validate
 * @returns True if valid phone format
 */
export function isValidPhoneNumber(phone: string): boolean {
  // E.164 format:  + followed by 1-15 digits
  const phoneRegex = /^\+[1-9]\d{1,14}$/;
  return phoneRegex.test(phone);
}

/**
 * Validate South African phone number
 * @param phone - Phone number to validate
 * @returns True if valid SA phone format
 */
export function isValidSAPhoneNumber(phone: string): boolean {
  // SA phone:  +27 followed by 9 digits
  const saPhoneRegex = /^\+27[0-9]{9}$/;
  return saPhoneRegex.test(phone);
}

/**
 * Validate South African ID number format
 * @param idNumber - ID number to validate format
 * @returns True if valid format (13 digits)
 */
export function isValidSAIdFormat(idNumber: string): boolean {
  return /^\d{13}$/.test(idNumber);
}

/**
 * Validate password strength
 * @param password - Password to validate
 * @returns Object with validation result and message
 */
export function validatePasswordStrength(password: string): {
  isValid: boolean;
  score: number;
  message: string;
  requirements: {
    minLength: boolean;
    hasUppercase: boolean;
    hasLowercase: boolean;
    hasNumber: boolean;
    hasSpecialChar: boolean;
  };
} {
  const requirements = {
    minLength: password. length >= 8,
    hasUppercase: /[A-Z]/.test(password),
    hasLowercase: /[a-z]/.test(password),
    hasNumber: /[0-9]/.test(password),
    hasSpecialChar:  /[!@#$%^&*(),.?":{}|<>]/.test(password),
  };

  const score = Object.values(requirements).filter(Boolean).length;

  let message = '';
  if (! requirements.minLength) {
    message = 'Password must be at least 8 characters';
  } else if (!requirements. hasUppercase) {
    message = 'Password must contain an uppercase letter';
  } else if (!requirements.hasLowercase) {
    message = 'Password must contain a lowercase letter';
  } else if (!requirements.hasNumber) {
    message = 'Password must contain a number';
  } else if (!requirements.hasSpecialChar) {
    message = 'Password must contain a special character';
  } else {
    message = 'Password meets all requirements';
  }

  return {
    isValid: score >= 4, // Require at least 4 of 5 requirements
    score,
    message,
    requirements,
  };
}

/**
 * Validate PIN format
 * @param pin - PIN to validate
 * @param length - Expected length (default: 4-6)
 * @returns True if valid PIN format
 */
export function isValidPin(pin: string, minLength = 4, maxLength = 6): boolean {
  const pinRegex = new RegExp(`^\\d{${minLength},${maxLength}}$`);
  return pinRegex.test(pin);
}

/**
 * Validate date of birth (must be in the past, reasonable age)
 * @param dateOfBirth - Date of birth to validate
 * @param maxAge - Maximum allowed age (default: 150)
 * @returns True if valid date of birth
 */
export function isValidDateOfBirth(dateOfBirth: Date, maxAge = 150): boolean {
  const today = new Date();
  const minDate = new Date();
  minDate.setFullYear(today.getFullYear() - maxAge);

  const dob = new Date(dateOfBirth);
  return dob < today && dob > minDate;
}

/**
 * Validate URL format
 * @param url - URL to validate
 * @returns True if valid URL format
 */
export function isValidUrl(url: string): boolean {
  try {
    new URL(url);
    return true;
  } catch {
    return false;
  }
}

/**
 * Validate UUID format
 * @param uuid - UUID to validate
 * @returns True if valid UUID format
 */
export function isValidUuid(uuid: string): boolean {
  const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[1-5][0-9a-f]{3}-[89ab][0-9a-f]{3}-[0-9a-f]{12}$/i;
  return uuidRegex.test(uuid);
}

/**
 * Validate South African postal code
 * @param postalCode - Postal code to validate
 * @returns True if valid SA postal code (4 digits)
 */
export function isValidSAPostalCode(postalCode: string): boolean {
  return /^\d{4}$/.test(postalCode);
}

/**
 * Validate HPCSA number format (Health Professions Council of SA)
 * @param hpcsaNumber - HPCSA number to validate
 * @returns True if valid format
 */
export function isValidHPCSANumber(hpcsaNumber: string): boolean {
  // Format: MP followed by 6-7 digits (for medical practitioners)
  // Other formats exist for different professions
  const hpcsaRegex = /^[A-Z]{2}\d{6,7}$/;
  return hpcsaRegex.test(hpcsaNumber);
}

/**
 * Validate medical aid membership number
 * @param membershipNumber - Membership number to validate
 * @returns True if valid format (alphanumeric, 6-15 characters)
 */
export function isValidMedicalAidNumber(membershipNumber: string): boolean {
  return /^[A-Za-z0-9]{6,15}$/.test(membershipNumber);
}

/**
 * Validate OTP format
 * @param otp - OTP to validate
 * @param length - Expected length (default: 6)
 * @returns True if valid OTP format
 */
export function isValidOtp(otp: string, length = 6): boolean {
  const otpRegex = new RegExp(`^\\d{${length}}$`);
  return otpRegex. test(otp);
}

/**
 * Validate ICD-10 code format
 * @param code - ICD-10 code to validate
 * @returns True if valid format
 */
export function isValidIcd10Code(code: string): boolean {
  // ICD-10 format: Letter followed by 2-7 characters (digits and optional decimal)
  const icd10Regex = /^[A-Z]\d{2}(\.\d{1,4})?$/;
  return icd10Regex.test(code. toUpperCase());
}

/**
 * Validate NAPPI code (South African medication code)
 * @param nappiCode - NAPPI code to validate
 * @returns True if valid format (numeric, 6-10 digits)
 */
export function isValidNappiCode(nappiCode: string): boolean {
  return /^\d{6,10}$/.test(nappiCode);
}

/**
 * Sanitize input string (remove potentially dangerous characters)
 * @param input - Input to sanitize
 * @returns Sanitized string
 */
export function sanitizeInput(input: string): string {
  return input
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/[<>"'&]/g, '') // Remove special characters
    .trim();
}

/**
 * Validate array has minimum items
 * @param arr - Array to validate
 * @param minItems - Minimum required items
 * @returns True if array has minimum items
 */
export function hasMinItems<T>(arr: T[], minItems: number): boolean {
  return Array.isArray(arr) && arr.length >= minItems;
}

/**
 * Validate value is within range
 * @param value - Value to check
 * @param min - Minimum value
 * @param max - Maximum value
 * @returns True if within range
 */
export function isInRange(value: number, min:  number, max: number): boolean {
  return value >= min && value <= max;
}

/**
 * Validate file extension
 * @param filename - Filename to validate
 * @param allowedExtensions - Array of allowed extensions
 * @returns True if extension is allowed
 */
export function isValidFileExtension(
  filename: string,
  allowedExtensions: string[],
): boolean {
  const extension = filename.split('.').pop()?.toLowerCase();
  return extension ? allowedExtensions.includes(extension) : false;
}

/**
 * Common allowed file extensions for medical documents
 */
export const ALLOWED_DOCUMENT_EXTENSIONS = ['pdf', 'jpg', 'jpeg', 'png', 'doc', 'docx'];

/**
 * Common allowed file extensions for medical images (DICOM, etc.)
 */
export const ALLOWED_IMAGE_EXTENSIONS = ['jpg', 'jpeg', 'png', 'dcm', 'dicom'];
