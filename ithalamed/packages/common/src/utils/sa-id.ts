/**
 * South African ID Number utilities
 * 
 * SA ID Format:  YYMMDD GSSS CAZ
 * - YYMMDD: Date of birth
 * - G: Gender (0-4 female, 5-9 male)
 * - SSS: Sequence number
 * - C: Citizenship (0 = SA citizen, 1 = permanent resident)
 * - A: Usually 8 (was race indicator, now deprecated)
 * - Z: Check digit (Luhn algorithm)
 */

export interface SAIdInfo {
  isValid: boolean;
  dateOfBirth: Date | null;
  gender: 'male' | 'female' | null;
  isCitizen: boolean | null;
  age: number | null;
}

/**
 * Validate South African ID number using Luhn algorithm
 * @param idNumber - 13-digit SA ID number
 * @returns True if valid
 */
export function validateSAIdNumber(idNumber:  string): boolean {
  // Must be exactly 13 digits
  if (!/^\d{13}$/.test(idNumber)) {
    return false;
  }

  // Validate date portion
  const year = parseInt(idNumber.substring(0, 2), 10);
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);

  // Month must be 01-12
  if (month < 1 || month > 12) {
    return false;
  }

  // Day must be valid for the month
  const fullYear = year >= 0 && year <= new Date().getFullYear() % 100 ? 2000 + year : 1900 + year;
  const daysInMonth = new Date(fullYear, month, 0).getDate();
  if (day < 1 || day > daysInMonth) {
    return false;
  }

  // Luhn algorithm validation
  const digits = idNumber.split('').map(Number);
  const checkDigit = digits.pop()!;

  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) {
        digit -= 9;
      }
    }
    sum += digit;
  }

  const calculatedCheckDigit = (10 - (sum % 10)) % 10;
  return calculatedCheckDigit === checkDigit;
}

/**
 * Extract information from South African ID number
 * @param idNumber - 13-digit SA ID number
 * @returns Extracted information
 */
export function extractSAIdInfo(idNumber: string): SAIdInfo {
  if (!validateSAIdNumber(idNumber)) {
    return {
      isValid: false,
      dateOfBirth: null,
      gender: null,
      isCitizen: null,
      age: null,
    };
  }

  // Extract date of birth
  const yearPart = parseInt(idNumber.substring(0, 2), 10);
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);

  // Determine century (assuming no one older than ~100 years)
  const currentYear = new Date().getFullYear();
  const currentCentury = Math.floor(currentYear / 100) * 100;
  const threshold = currentYear - currentCentury;

  const year = yearPart <= threshold ? currentCentury + yearPart : currentCentury - 100 + yearPart;
  const dateOfBirth = new Date(year, month - 1, day);

  // Extract gender (digit 7:  0-4 = female, 5-9 = male)
  const genderDigit = parseInt(idNumber.substring(6, 7), 10);
  const gender:  'male' | 'female' = genderDigit >= 5 ? 'male' : 'female';

  // Extract citizenship (digit 11: 0 = citizen, 1 = permanent resident)
  const citizenshipDigit = parseInt(idNumber.substring(10, 11), 10);
  const isCitizen = citizenshipDigit === 0;

  // Calculate age
  const today = new Date();
  let age = today.getFullYear() - dateOfBirth.getFullYear();
  const monthDiff = today.getMonth() - dateOfBirth.getMonth();
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dateOfBirth.getDate())) {
    age--;
  }

  return {
    isValid: true,
    dateOfBirth,
    gender,
    isCitizen,
    age,
  };
}

/**
 * Format SA ID number for display (with spaces)
 * @param idNumber - 13-digit SA ID number
 * @returns Formatted ID number (YYMMDD GSSS CAZ)
 */
export function formatSAIdNumber(idNumber: string): string {
  if (idNumber.length !== 13) {
    return idNumber;
  }
  return `${idNumber.substring(0, 6)} ${idNumber.substring(6, 10)} ${idNumber.substring(10, 13)}`;
}

/**
 * Mask SA ID number for privacy
 * @param idNumber - 13-digit SA ID number
 * @returns Masked ID number (showing only last 4 digits)
 */
export function maskSAIdNumber(idNumber: string): string {
  if (idNumber.length !== 13) {
    return idNumber;
  }
  return `*********${idNumber.substring(9)}`;
}

/**
 * Extract date of birth from SA ID number
 * @param idNumber - 13-digit SA ID number
 * @returns Date of birth or null if invalid
 */
export function getDateOfBirthFromSAId(idNumber: string): Date | null {
  const info = extractSAIdInfo(idNumber);
  return info.dateOfBirth;
}

/**
 * Extract gender from SA ID number
 * @param idNumber - 13-digit SA ID number
 * @returns Gender or null if invalid
 */
export function getGenderFromSAId(idNumber: string): 'male' | 'female' | null {
  const info = extractSAIdInfo(idNumber);
  return info.gender;
}

/**
 * Check if SA ID indicates citizenship
 * @param idNumber - 13-digit SA ID number
 * @returns True if citizen, false if permanent resident, null if invalid
 */
export function isSACitizenFromId(idNumber: string): boolean | null {
  const info = extractSAIdInfo(idNumber);
  return info.isCitizen;
}

/**
 * Validate that provided date of birth matches SA ID
 * @param idNumber - 13-digit SA ID number
 * @param dateOfBirth - Date of birth to validate
 * @returns True if date of birth matches ID
 */
export function validateDateOfBirthMatchesId(idNumber: string, dateOfBirth: Date): boolean {
  const idDob = getDateOfBirthFromSAId(idNumber);
  if (!idDob) {
    return false;
  }

  return (
    idDob.getFullYear() === dateOfBirth.getFullYear() &&
    idDob.getMonth() === dateOfBirth.getMonth() &&
    idDob.getDate() === dateOfBirth.getDate()
  );
}

/**
 * Validate that provided gender matches SA ID
 * @param idNumber - 13-digit SA ID number
 * @param gender - Gender to validate ('male' or 'female')
 * @returns True if gender matches ID
 */
export function validateGenderMatchesId(
  idNumber: string,
  gender: 'male' | 'female',
): boolean {
  const idGender = getGenderFromSAId(idNumber);
  return idGender === gender;
}
