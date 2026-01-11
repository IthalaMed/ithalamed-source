import { useState, useEffect, useCallback } from 'react';
import * as LocalAuthentication from 'expo-local-authentication';
import * as SecureStore from 'expo-secure-store';
import { STORAGE_KEYS } from '@ithalamed/mobile-core';

type BiometricType = 'fingerprint' | 'facial' | 'iris' | 'none';

interface BiometricState {
  isAvailable: boolean;
  biometricType: BiometricType;
  isEnrolled: boolean;
  isEnabled: boolean;
}

export function useBiometric() {
  const [state, setState] = useState<BiometricState>({
    isAvailable: false,
    biometricType: 'none',
    isEnrolled: false,
    isEnabled: false,
  });
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    checkBiometricStatus();
  }, []);

  const checkBiometricStatus = async () => {
    try {
      setIsLoading(true);

      const hasHardware = await LocalAuthentication.hasHardwareAsync();
      const isEnrolled = await LocalAuthentication.isEnrolledAsync();
      const supportedTypes = await LocalAuthentication.supportedAuthenticationTypesAsync();

      let biometricType: BiometricType = 'none';
      if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FACIAL_RECOGNITION)) {
        biometricType = 'facial';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType.FINGERPRINT)) {
        biometricType = 'fingerprint';
      } else if (supportedTypes.includes(LocalAuthentication.AuthenticationType. IRIS)) {
        biometricType = 'iris';
      }

      const enabledStr = await SecureStore.getItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED);
      const isEnabled = enabledStr === 'true';

      setState({
        isAvailable: hasHardware && isEnrolled,
        biometricType,
        isEnrolled,
        isEnabled,
      });
    } catch (error) {
      console.error('[useBiometric] Error checking status:', error);
    } finally {
      setIsLoading(false);
    }
  };

  const authenticate = useCallback(
    async (promptMessage = 'Authenticate to continue'): Promise<boolean> => {
      if (!state.isAvailable) {
        return false;
      }

      try {
        const result = await LocalAuthentication.authenticateAsync({
          promptMessage,
          fallbackLabel: 'Use PIN',
          disableDeviceFallback: false,
          cancelLabel: 'Cancel',
        });

        return result.success;
      } catch (error) {
        console.error('[useBiometric] Authentication error:', error);
        return false;
      }
    },
    [state.isAvailable],
  );

  const enable = useCallback(async (): Promise<boolean> => {
    if (!state.isAvailable) {
      return false;
    }

    const authenticated = await authenticate('Authenticate to enable biometric login');

    if (authenticated) {
      await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'true');
      setState((prev) => ({ ...prev, isEnabled: true }));
      return true;
    }

    return false;
  }, [state.isAvailable, authenticate]);

  const disable = useCallback(async (): Promise<void> => {
    await SecureStore.setItemAsync(STORAGE_KEYS.BIOMETRIC_ENABLED, 'false');
    await SecureStore.deleteItemAsync(STORAGE_KEYS.BIOMETRIC_KEY);
    setState((prev) => ({ ...prev, isEnabled: false }));
  }, []);

  const getBiometricLabel = useCallback((): string => {
    switch (state.biometricType) {
      case 'facial': 
        return 'Face ID';
      case 'fingerprint':
        return 'Fingerprint';
      case 'iris':
        return 'Iris';
      default:
        return 'Biometric';
    }
  }, [state.biometricType]);

  return {
    ... state,
    isLoading,
    authenticate,
    enable,
    disable,
    getBiometricLabel,
    refresh: checkBiometricStatus,
  };
}
