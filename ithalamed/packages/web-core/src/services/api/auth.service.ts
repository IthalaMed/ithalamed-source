import { api, tokenStorage, STORAGE_KEYS } from './client';
import { ENDPOINTS } from '../../config/api.config';

// Import types from shared-types
import {
  LoginRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  EnableMfaRequest,
  VerifyMfaRequest,
  DisableMfaRequest,
  LoginResult,
  LoginResponse,
  RegisterResponse,
  MfaSetupResponse,
  MessageResponse,
  User,
  OtpPurpose,
} from '@ithalamed/shared-types';

export const authService = {
  async login(request: LoginRequest): Promise<LoginResult> {
    const response = await api.post<LoginResult>(ENDPOINTS.auth.login, request);

    if ('tokens' in response) {
      this.storeAuthData(response);
    }

    return response;
  },

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    return api.post<RegisterResponse>(ENDPOINTS.auth.register, request);
  },

  async logout(): Promise<void> {
    try {
      await api.post(ENDPOINTS.auth.logout);
    } catch (error) {
      console.warn('Logout API call failed:', error);
    } finally {
      this.clearAuthData();
    }
  },

  async logoutAll(): Promise<void> {
    try {
      await api. post(ENDPOINTS.auth.logoutAll);
    } catch (error) {
      console.warn('Logout all API call failed:', error);
    } finally {
      this.clearAuthData();
    }
  },

  async getCurrentUser(): Promise<User> {
    const response = await api.get<{ data: User } | User>(ENDPOINTS.auth.me);
    return 'data' in response ? response. data : response;
  },

  async sendOtp(identifier: string, purpose: OtpPurpose): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.sendOtp, { identifier, purpose });
  },

  async verifyOtp(request: VerifyOtpRequest): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.verifyOtp, request);
  },

  async resendOtp(identifier: string, purpose: OtpPurpose): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.resendOtp, { identifier, purpose });
  },

  async forgotPassword(request: ForgotPasswordRequest): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.forgotPassword, request);
  },

  async resetPassword(request:  ResetPasswordRequest): Promise<MessageResponse> {
    return api. post<MessageResponse>(ENDPOINTS. auth.resetPassword, request);
  },

  async changePassword(request: ChangePasswordRequest): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.changePassword, request);
  },

  async enableMfa(request: EnableMfaRequest): Promise<MfaSetupResponse> {
    return api.post<MfaSetupResponse>(ENDPOINTS. auth.enableMfa, request);
  },

  async verifyMfaSetup(code: string): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth. verifyMfaSetup, { code });
  },

  async verifyMfa(request:  VerifyMfaRequest): Promise<LoginResponse> {
    const response = await api.post<LoginResponse>(ENDPOINTS.auth.verifyMfa, request);
    this.storeAuthData(response);
    return response;
  },

  async disableMfa(request: DisableMfaRequest): Promise<MessageResponse> {
    return api.post<MessageResponse>(ENDPOINTS.auth.disableMfa, request);
  },

  storeAuthData(response: LoginResponse): void {
    tokenStorage. setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
    tokenStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
    tokenStorage.setItem(STORAGE_KEYS.USER_ID, response.user.id);
  },

  clearAuthData(): void {
    tokenStorage.deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
    tokenStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
    tokenStorage.deleteItem(STORAGE_KEYS.USER_ID);
  },

  hasStoredTokens(): boolean {
    return !!tokenStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
  },

  getStoredUserId(): string | null {
    return tokenStorage.getItem(STORAGE_KEYS.USER_ID);
  },
};
