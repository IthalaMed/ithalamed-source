/**
 * Password Validator
 * 
 * Implements password policy requirements from ithalamed_overview.txt: 
 * - Minimum 8 characters
 * - Maximum 128 characters
 * - At least one uppercase letter
 * - At least one lowercase letter
 * - At least one number
 * - At least one special character
 */

export interface PasswordPolicy {
  minLength: number;
  maxLength: number;
  requireUppercase: boolean;
  requireLowercase: boolean;
  requireNumber: boolean;
  requireSpecialChar: boolean;
  specialChars?: string;
}

export interface PasswordValidationResult {
  isValid:  boolean;
  errors:  string[];
  strength:  'weak' | 'fair' | 'good' | 'strong' | 'very_strong';
  score: number;
}

/**
 * Default password policy
 */
export const DEFAULT_PASSWORD_POLICY:  PasswordPolicy = {
  minLength: 8,
  maxLength: 128,
  requireUppercase: true,
  requireLowercase: true,
  requireNumber: true,
  requireSpecialChar: true,
  specialChars: '!@#$%^&*()_+-=[]{}|;:,.<>?',
};

/**
 * Validate password against policy
 */
export function validatePassword(
  password: string,
  policy: PasswordPolicy = DEFAULT_PASSWORD_POLICY,
): PasswordValidationResult {
  const errors: string[] = [];
  let score = 0;

  // Length check
  if (password.length < policy.minLength) {
    errors.push(`Password must be at least ${policy.minLength} characters long`);
  } else {
    score += 1;
  }

  if (password.length > policy.maxLength) {
    errors.push(`Password must not exceed ${policy.maxLength} characters`);
  }

  // Uppercase check
  if (policy.requireUppercase && !/[A-Z]/.test(password)) {
    errors.push('Password must contain at least one uppercase letter');
  } else if (/[A-Z]/.test(password)) {
    score += 1;
  }

  // Lowercase check
  if (policy.requireLowercase && !/[a-z]/.test(password)) {
    errors.push('Password must contain at least one lowercase letter');
  } else if (/[a-z]/. test(password)) {
    score += 1;
  }

  // Number check
  if (policy.requireNumber && !/\d/.test(password)) {
    errors.push('Password must contain at least one number');
  } else if (/\d/.test(password)) {
    score += 1;
  }

  // Special character check
  const specialChars = policy.specialChars || DEFAULT_PASSWORD_POLICY.specialChars! ;
  const specialCharRegex = new RegExp(`[${specialChars. replace(/[-[\]{}()*+?.,\\^$|#\s]/g, '\\$&')}]`);
  
  if (policy.requireSpecialChar && !specialCharRegex.test(password)) {
    errors.push('Password must contain at least one special character');
  } else if (specialCharRegex.test(password)) {
    score += 1;
  }

  // Additional strength factors
  if (password.length >= 12) score += 1;
  if (password.length >= 16) score += 1;
  if (/[A-Z].*[A-Z]/.test(password)) score += 0.5; // Multiple uppercase
  if (/\d.*\d.*\d/.test(password)) score += 0.5; // Multiple numbers

  // Determine strength
  let strength:  PasswordValidationResult['strength'];
  if (score < 3) strength = 'weak';
  else if (score < 4) strength = 'fair';
  else if (score < 5) strength = 'good';
  else if (score < 6) strength = 'strong';
  else strength = 'very_strong';

  return {
    isValid:  errors.length === 0,
    errors,
    strength,
    score:  Math.min(Math.round(score), 7),
  };
}

/**
 * Check if password contains common patterns
 */
export function checkCommonPatterns(password: string): string[] {
  const warnings: string[] = [];

  // Check for sequential characters
  if (/(? : abc|bcd|cde|def|efg|fgh|ghi|hij|ijk|jkl|klm|lmn|mno|nop|opq|pqr|qrs|rst|stu|tuv|uvw|vwx|wxy|xyz)/i.test(password)) {
    warnings.push('Password contains sequential letters');
  }

  // Check for sequential numbers
  if (/(?: 012|123|234|345|456|567|678|789|890)/. test(password)) {
    warnings.push('Password contains sequential numbers');
  }

  // Check for repeated characters
  if (/(. )\1{2,}/.test(password)) {
    warnings.push('Password contains repeated characters');
  }

  // Check for keyboard patterns
  const keyboardPatterns = ['qwerty', 'asdfgh', 'zxcvbn', 'qazwsx', '! @#$%^'];
  for (const pattern of keyboardPatterns) {
    if (password. toLowerCase().includes(pattern)) {
      warnings.push('Password contains keyboard pattern');
      break;
    }
  }

  return warnings;
}
