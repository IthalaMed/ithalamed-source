import * as SecureStore from 'expo-secure-store';
import * as Device from 'expo-device';
import Constants from 'expo-constants';

import {
  initializeApiClient,
  initializeAuthService,
  createApiConfig,
  TokenStorage,
  DeviceInfoProvider,
  DeviceInfo,
  Environment,
} from '@ithalamed/mobile-core';

const secureTokenStorage:  TokenStorage = {
  async getItem(key: string): Promise<string | null> {
    try {
      return await SecureStore.getItemAsync(key);
    } catch (error) {
      console.error(`[SecureStore] Error getting ${key}:`, error);
      return null;
    }
  },
  async setItem(key: string, value: string): Promise<void> {
    try {
      await SecureStore.setItemAsync(key, value);
    } catch (error) {
      console.error(`[SecureStore] Error setting ${key}: `, error);
    }
  },
  async deleteItem(key: string): Promise<void> {
    try {
      await SecureStore.deleteItemAsync(key);
    } catch (error) {
      console.error(`[SecureStore] Error deleting ${key}:`, error);
    }
  },
};

const expoDeviceInfoProvider:  DeviceInfoProvider = {
  async getDeviceInfo(): Promise<DeviceInfo> {
    return {
      deviceId: Constants.installationId || undefined,
      deviceType: Device.deviceType?. toString() || 'unknown',
      deviceName: Device.deviceName || 'Unknown Device',
      platform: Device.osName?. toLowerCase() || 'unknown',
      appVersion: Constants.expoConfig?.version || '1.0.0',
      osVersion: Device.osVersion || 'unknown',
    };
  },
};

export function initializeApp(): void {
  const env:  Environment = (Constants.expoConfig?.extra?.env as Environment) || 'development';

  console.log(`[PatientApp] Initializing with environment: ${env}`);

  const apiConfig = createApiConfig(env);

  initializeApiClient({
    apiConfig,
    tokenStorage: secureTokenStorage,
    callbacks: {
      onTokenRefreshed: () => {
        console.log('[PatientApp] Tokens refreshed');
      },
      onTokenRefreshFailed: () => {
        console.log('[PatientApp] Token refresh failed');
      },
      onUnauthorized: () => {
        console.log('[PatientApp] Unauthorized - redirecting to login');
      },
    },
  });

  initializeAuthService({
    deviceInfoProvider: expoDeviceInfoProvider,
    tokenStorage: secureTokenStorage,
  });

  console.log('[PatientApp] Initialization complete');
}

export { secureTokenStorage };
