import { UserType, UserStatus, MfaMethod, OtpPurpose } from '../enums';

/**
 * User Interface
 */
export interface User {
  id: string;
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  status: UserStatus;
  firstName: string;
  lastName: string;
  displayName?:  string;
  profilePhotoUrl?: string;
  emailVerified:  boolean;
  phoneVerified:  boolean;
  mfaEnabled: boolean;
  preferredLanguage: string;
  createdAt: string;
}

/**
 * Auth Tokens Interface
 */
export interface AuthTokens {
  accessToken: string;
  refreshToken: string;
  expiresIn: number;
  tokenType: string;
}

/**
 * Device Info Interface
 */
export interface DeviceInfo {
  deviceId?:  string;
  deviceType?:  string;
  deviceName?: string;
  platform?: string;
  appVersion?: string;
  osVersion?: string;
}

/**
 * JWT Payload Interface
 */
export interface JwtPayload {
  sub: string;
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId?:  string;
  iat?: number;
  exp?: number;
}

/**
 * Authenticated User (from JWT)
 */
export interface AuthenticatedUser {
  id: string;
  email: string | null;
  phoneNumber: string;
  userType: UserType;
  sessionId?: string;
}

// ==================== REQUEST INTERFACES ====================

export interface LoginRequest {
  identifier: string;
  password: string;
  rememberMe?: boolean;
  deviceInfo?: DeviceInfo;
}

export interface LoginWithPinRequest {
  userId: string;
  pin: string;
  deviceInfo?: DeviceInfo;
}

export interface LoginWithBiometricRequest {
  userId: string;
  biometricToken: string;
  deviceInfo?:  DeviceInfo;
}

export interface RegisterRequest {
  firstName:  string;
  lastName: string;
  phoneNumber: string;
  email?:  string;
  password: string;
  userType: UserType;
  preferredLanguage?:  string;
  termsAccepted:  boolean;
  privacyAccepted: boolean;
  deviceInfo?: DeviceInfo;
}

export interface SendOtpRequest {
  identifier: string;
  purpose: OtpPurpose;
  userId?:  string;
}

export interface VerifyOtpRequest {
  identifier: string;
  code: string;
  purpose: OtpPurpose;
}

export interface ForgotPasswordRequest {
  identifier: string;
}

export interface ResetPasswordRequest {
  token: string;
  newPassword:  string;
}

export interface ChangePasswordRequest {
  currentPassword: string;
  newPassword: string;
}

export interface SetPinRequest {
  password: string;
  pin: string;
}

export interface EnableMfaRequest {
  password: string;
  method: MfaMethod;
}

export interface VerifyMfaRequest {
  mfaToken: string;
  code: string;
  isBackupCode?: boolean;
}

export interface DisableMfaRequest {
  password: string;
  code: string;
}

// ==================== RESPONSE INTERFACES ====================

export interface LoginResponse {
  user: User;
  tokens: AuthTokens;
  sessionId?: string;
}

export interface MfaRequiredResponse {
  success: false;
  mfaRequired: true;
  mfaToken:  string;
  mfaMethod: string;
  userId: string;
}

export type LoginResult = LoginResponse | MfaRequiredResponse;

export interface RegisterResponse {
  user: User;
  message: string;
  requiresPhoneVerification: boolean;
  requiresEmailVerification: boolean;
}

export interface MfaSetupResponse {
  secret: string;
  qrCode: string;
  backupCodes: string[];
}
