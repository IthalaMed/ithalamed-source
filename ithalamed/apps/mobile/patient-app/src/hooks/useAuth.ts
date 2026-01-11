import { useCallback } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  login,
  loginWithPin,
  loginWithBiometric,
  register,
  verifyOtp,
  verifyMfa,
  logoutUser,
  fetchCurrentUser,
  clearError,
  clearMfaState,
  LoginRequest,
  RegisterRequest,
  OtpPurpose,
  UserType,
} from '@ithalamed/mobile-core';

export function useAuth() {
  const dispatch = useAppDispatch();
  const auth = useAppSelector((state) => state.auth);

  const handleLogin = useCallback(
    async (identifier: string, password: string, rememberMe?:  boolean) => {
      const request: LoginRequest = { identifier, password, rememberMe };
      return dispatch(login(request)).unwrap();
    },
    [dispatch],
  );

  const handleLoginWithPin = useCallback(
    async (userId: string, pin: string) => {
      return dispatch(loginWithPin({ userId, pin })).unwrap();
    },
    [dispatch],
  );

  const handleLoginWithBiometric = useCallback(
    async (userId: string, biometricToken: string) => {
      return dispatch(loginWithBiometric({ userId, biometricToken })).unwrap();
    },
    [dispatch],
  );

  const handleRegister = useCallback(
    async (data:  Omit<RegisterRequest, 'userType'>) => {
      const request: RegisterRequest = {
        ...data,
        userType: UserType. PATIENT,
      };
      return dispatch(register(request)).unwrap();
    },
    [dispatch],
  );

  const handleVerifyOtp = useCallback(
    async (identifier: string, code: string, purpose: OtpPurpose) => {
      return dispatch(verifyOtp({ identifier, code, purpose })).unwrap();
    },
    [dispatch],
  );

  const handleVerifyMfa = useCallback(
    async (mfaToken: string, code: string, isBackupCode?:  boolean) => {
      return dispatch(verifyMfa({ mfaToken, code, isBackupCode })).unwrap();
    },
    [dispatch],
  );

  const handleLogout = useCallback(async () => {
    return dispatch(logoutUser()).unwrap();
  }, [dispatch]);

  const refreshUser = useCallback(async () => {
    return dispatch(fetchCurrentUser()).unwrap();
  }, [dispatch]);

  const handleClearError = useCallback(() => {
    dispatch(clearError());
  }, [dispatch]);

  const handleClearMfaState = useCallback(() => {
    dispatch(clearMfaState());
  }, [dispatch]);

  return {
    user: auth.user,
    isAuthenticated: auth.isAuthenticated,
    isLoading: auth.isLoading,
    error: auth.error,
    mfaRequired: auth.mfaRequired,
    mfaToken: auth.mfaToken,
    mfaMethod: auth.mfaMethod,
    requiresPhoneVerification: auth.requiresPhoneVerification,
    requiresEmailVerification: auth.requiresEmailVerification,
    pendingUserId: auth.pendingUserId,
    pinEnabled: auth.pinEnabled,
    biometricEnabled: auth.biometricEnabled,
    login: handleLogin,
    loginWithPin: handleLoginWithPin,
    loginWithBiometric: handleLoginWithBiometric,
    register: handleRegister,
    verifyOtp: handleVerifyOtp,
    verifyMfa: handleVerifyMfa,
    logout: handleLogout,
    refreshUser,
    clearError:  handleClearError,
    clearMfaState: handleClearMfaState,
  };
}
