import { getApiClient } from './client';
import { ENDPOINTS } from '../../config/api. config';
import { STORAGE_KEYS } from '../../config/storage.keys';

// Import types from shared-types (NOT duplicated here)
import {
  LoginRequest,
  LoginWithPinRequest,
  LoginWithBiometricRequest,
  RegisterRequest,
  VerifyOtpRequest,
  ForgotPasswordRequest,
  ResetPasswordRequest,
  ChangePasswordRequest,
  SetPinRequest,
  EnableMfaRequest,
  VerifyMfaRequest,
  DisableMfaRequest,
  LoginResult,
  LoginResponse,
  RegisterResponse,
  MfaSetupResponse,
  MessageResponse,
  User,
  DeviceInfo,
  OtpPurpose,
} from '@ithalamed/shared-types';

export interface DeviceInfoProvider {
  getDeviceInfo(): Promise<DeviceInfo>;
}

export interface TokenStorageProvider {
  getItem(key: string): Promise<string | null>;
  setItem(key: string, value: string): Promise<void>;
  deleteItem(key: string): Promise<void>;
}

export interface AuthServiceConfig {
  deviceInfoProvider: DeviceInfoProvider;
  tokenStorage: TokenStorageProvider;
}

export class AuthService {
  private deviceInfoProvider: DeviceInfoProvider;
  private tokenStorage:  TokenStorageProvider;

  constructor(config: AuthServiceConfig) {
    this.deviceInfoProvider = config.deviceInfoProvider;
    this.tokenStorage = config.tokenStorage;
  }

  async login(request: LoginRequest): Promise<LoginResult> {
    const deviceInfo = await this.deviceInfoProvider.getDeviceInfo();
    const apiClient = getApiClient();

    const response = await apiClient.post<LoginResult>(ENDPOINTS.auth.login, {
      ...request,
      deviceInfo,
    });

    if ('tokens' in response) {
      await this.storeAuthData(response);
    }

    return response;
  }

  async loginWithPin(request: LoginWithPinRequest): Promise<LoginResponse> {
    const deviceInfo = await this.deviceInfoProvider.getDeviceInfo();
    const apiClient = getApiClient();

    const response = await apiClient.post<LoginResponse>(ENDPOINTS.auth.loginWithPin, {
      ...request,
      deviceInfo,
    });

    await this.storeAuthData(response);
    return response;
  }

  async loginWithBiometric(request: LoginWithBiometricRequest): Promise<LoginResponse> {
    const deviceInfo = await this.deviceInfoProvider.getDeviceInfo();
    const apiClient = getApiClient();

    const response = await apiClient.post<LoginResponse>(ENDPOINTS.auth.loginWithBiometric, {
      ...request,
      deviceInfo,
    });

    await this.storeAuthData(response);
    return response;
  }

  async register(request: RegisterRequest): Promise<RegisterResponse> {
    const deviceInfo = await this. deviceInfoProvider.getDeviceInfo();
    const apiClient = getApiClient();

    return apiClient.post<RegisterResponse>(ENDPOINTS.auth.register, {
      ...request,
      deviceInfo,
    });
  }

  async logout(): Promise<void> {
    try {
      const apiClient = getApiClient();
      await apiClient.post(ENDPOINTS.auth.logout);
    } catch (error) {
      console.warn('[AuthService] Logout API call failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async logoutAll(): Promise<void> {
    try {
      const apiClient = getApiClient();
      await apiClient.post(ENDPOINTS.auth.logoutAll);
    } catch (error) {
      console.warn('[AuthService] Logout all API call failed:', error);
    } finally {
      await this.clearAuthData();
    }
  }

  async getCurrentUser(): Promise<User> {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ data: User } | User>(ENDPOINTS.auth.me);
    return 'data' in response ? response. data : response;
  }

  async sendOtp(identifier: string, purpose: OtpPurpose): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.sendOtp, { identifier, purpose });
  }

  async verifyOtp(request: VerifyOtpRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.verifyOtp, request);
  }

  async resendOtp(identifier: string, purpose: OtpPurpose): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.resendOtp, { identifier, purpose });
  }

  async forgotPassword(request: ForgotPasswordRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.forgotPassword, request);
  }

  async resetPassword(request: ResetPasswordRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.resetPassword, request);
  }

  async changePassword(request: ChangePasswordRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth. changePassword, request);
  }

  async setPin(request:  SetPinRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    const response = await apiClient.post<MessageResponse>(ENDPOINTS.auth. setPin, request);
    await this.tokenStorage.setItem(STORAGE_KEYS.PIN_ENABLED, 'true');
    return response;
  }

  async enableMfa(request: EnableMfaRequest): Promise<MfaSetupResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MfaSetupResponse>(ENDPOINTS.auth.enableMfa, request);
  }

  async verifyMfaSetup(code: string): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.verifyMfaSetup, { code });
  }

  async verifyMfa(request: VerifyMfaRequest): Promise<LoginResponse> {
    const apiClient = getApiClient();
    const response = await apiClient.post<LoginResponse>(ENDPOINTS.auth. verifyMfa, request);
    await this.storeAuthData(response);
    return response;
  }

  async disableMfa(request: DisableMfaRequest): Promise<MessageResponse> {
    const apiClient = getApiClient();
    return apiClient.post<MessageResponse>(ENDPOINTS.auth.disableMfa, request);
  }

  async hasStoredTokens(): Promise<boolean> {
    const token = await this.tokenStorage.getItem(STORAGE_KEYS. ACCESS_TOKEN);
    return !!token;
  }

  async getStoredUserId(): Promise<string | null> {
    return this.tokenStorage.getItem(STORAGE_KEYS.USER_ID);
  }

  async isPinEnabled(): Promise<boolean> {
    const enabled = await this.tokenStorage.getItem(STORAGE_KEYS. PIN_ENABLED);
    return enabled === 'true';
  }

  async isBiometricEnabled(): Promise<boolean> {
    const enabled = await this.tokenStorage.getItem(STORAGE_KEYS. BIOMETRIC_ENABLED);
    return enabled === 'true';
  }

  async enableBiometric(biometricKey: string): Promise<void> {
    await this. tokenStorage.setItem(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
    await this.tokenStorage.setItem(STORAGE_KEYS. BIOMETRIC_KEY, biometricKey);
  }

  async disableBiometric(): Promise<void> {
    await this. tokenStorage.setItem(STORAGE_KEYS. BIOMETRIC_ENABLED, 'false');
    await this.tokenStorage.deleteItem(STORAGE_KEYS.BIOMETRIC_KEY);
  }

  private async storeAuthData(response:  LoginResponse): Promise<void> {
    await this.tokenStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, response.tokens.accessToken);
    await this.tokenStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN, response.tokens.refreshToken);
    await this.tokenStorage.setItem(STORAGE_KEYS.USER_ID, response. user.id);
    if (response.sessionId) {
      await this. tokenStorage.setItem(STORAGE_KEYS.SESSION_ID, response.sessionId);
    }
  }

  private async clearAuthData(): Promise<void> {
    await this.tokenStorage. deleteItem(STORAGE_KEYS.ACCESS_TOKEN);
    await this.tokenStorage.deleteItem(STORAGE_KEYS.REFRESH_TOKEN);
    await this.tokenStorage.deleteItem(STORAGE_KEYS.USER_ID);
    await this.tokenStorage. deleteItem(STORAGE_KEYS.SESSION_ID);
  }
}

let authServiceInstance: AuthService | null = null;

export function initializeAuthService(config: AuthServiceConfig): AuthService {
  authServiceInstance = new AuthService(config);
  return authServiceInstance;
}

export function getAuthService(): AuthService {
  if (!authServiceInstance) {
    throw new Error('Auth Service not initialized. Call initializeAuthService() first.');
  }
  return authServiceInstance;
}
