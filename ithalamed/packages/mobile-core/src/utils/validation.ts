import { z } from 'zod';

const SA_PHONE_REGEX = /^(\+27|0)[6-8][0-9]{8}$/;
const E164_PHONE_REGEX = /^\+[1-9]\d{1,14}$/;
const SA_ID_REGEX = /^\d{13}$/;

export function validateSAID(idNumber: string): boolean {
  if (!SA_ID_REGEX.test(idNumber)) return false;
  const digits = idNumber.split('').map(Number);
  const checkDigit = digits. pop()!;
  let sum = 0;
  for (let i = 0; i < digits.length; i++) {
    let digit = digits[i];
    if (i % 2 === 1) {
      digit *= 2;
      if (digit > 9) digit -= 9;
    }
    sum += digit;
  }
  return (10 - (sum % 10)) % 10 === checkDigit;
}

export function extractDOBFromSAID(idNumber: string): Date | null {
  if (!SA_ID_REGEX. test(idNumber)) return null;
  const yearPrefix = parseInt(idNumber.substring(0, 2), 10);
  const month = parseInt(idNumber.substring(2, 4), 10);
  const day = parseInt(idNumber.substring(4, 6), 10);
  const currentYear = new Date().getFullYear() % 100;
  const year = yearPrefix > currentYear ? 1900 + yearPrefix : 2000 + yearPrefix;
  return new Date(year, month - 1, day);
}

export function extractGenderFromSAID(idNumber: string): 'male' | 'female' | null {
  if (!SA_ID_REGEX.test(idNumber)) return null;
  const genderDigit = parseInt(idNumber.substring(6, 10), 10);
  return genderDigit >= 5000 ? 'male' : 'female';
}

export const phoneSchema = z
  .string()
  .min(10, 'Phone number is required')
  .refine((val) => SA_PHONE_REGEX.test(val) || E164_PHONE_REGEX.test(val), 'Please enter a valid phone number');

export const emailSchema = z. string().email('Please enter a valid email address');

export const passwordSchema = z
  .string()
  .min(8, 'Password must be at least 8 characters')
  .regex(/[A-Z]/, 'Password must contain at least one uppercase letter')
  .regex(/[a-z]/, 'Password must contain at least one lowercase letter')
  .regex(/[0-9]/, 'Password must contain at least one number')
  .regex(/[^A-Za-z0-9]/, 'Password must contain at least one special character');

export const pinSchema = z
  .string()
  .length(4, 'PIN must be 4 digits')
  .regex(/^\d+$/, 'PIN must contain only numbers');

export const otpSchema = z
  .string()
  .length(6, 'OTP must be 6 digits')
  .regex(/^\d+$/, 'OTP must contain only numbers');

export const saIdSchema = z
  .string()
  .length(13, 'ID number must be 13 digits')
  .regex(/^\d+$/, 'ID number must contain only numbers')
  .refine(validateSAID, 'Invalid South African ID number');

export const loginSchema = z. object({
  identifier: z.string().min(1, 'Email or phone number is required'),
  password: z.string().min(1, 'Password is required'),
  rememberMe: z.boolean().optional(),
});

export const registerSchema = z
  .object({
    firstName: z.string().min(2, 'First name must be at least 2 characters').max(100, 'First name is too long'),
    lastName: z.string().min(2, 'Last name must be at least 2 characters').max(100, 'Last name is too long'),
    phoneNumber: phoneSchema,
    email: emailSchema. optional().or(z.literal('')),
    password: passwordSchema,
    confirmPassword: z.string(),
    termsAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the terms and conditions',
    }),
    privacyAccepted: z.boolean().refine((val) => val === true, {
      message: 'You must accept the privacy policy',
    }),
  })
  .refine((data) => data.password === data. confirmPassword, {
    message:  'Passwords do not match',
    path: ['confirmPassword'],
  });

export const forgotPasswordSchema = z. object({
  identifier: z. string().min(1, 'Email or phone number is required'),
});

export const resetPasswordSchema = z
  .object({
    token: z.string().min(1, 'Reset token is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const changePasswordSchema = z
  .object({
    currentPassword: z.string().min(1, 'Current password is required'),
    newPassword: passwordSchema,
    confirmPassword: z.string(),
  })
  .refine((data) => data.newPassword === data.confirmPassword, {
    message: 'Passwords do not match',
    path: ['confirmPassword'],
  });

export const otpVerificationSchema = z. object({
  code: otpSchema,
});

export const setPinSchema = z
  .object({
    password: z.string().min(1, 'Password is required'),
    pin: pinSchema,
    confirmPin: z.string(),
  })
  .refine((data) => data.pin === data.confirmPin, {
    message: 'PINs do not match',
    path: ['confirmPin'],
  });

export type LoginFormData = z.infer<typeof loginSchema>;
export type RegisterFormData = z.infer<typeof registerSchema>;
export type ForgotPasswordFormData = z.infer<typeof forgotPasswordSchema>;
export type ResetPasswordFormData = z.infer<typeof resetPasswordSchema>;
export type ChangePasswordFormData = z.infer<typeof changePasswordSchema>;
export type OtpVerificationFormData = z.infer<typeof otpVerificationSchema>;
export type SetPinFormData = z.infer<typeof setPinSchema>;
