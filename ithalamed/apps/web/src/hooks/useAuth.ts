'use client';

import { useState, useEffect, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import {
  authService,
  User,
  LoginRequest,
  RegisterRequest,
  OtpPurpose,
  UserType,
} from '@ithalamed/web-core';

interface AuthState {
  user: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error: string | null;
}

export function useAuth() {
  const router = useRouter();
  const [state, setState] = useState<AuthState>({
    user: null,
    isAuthenticated: false,
    isLoading: true,
    error: null,
  });

  useEffect(() => {
    checkAuthStatus();
  }, []);

  const checkAuthStatus = async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    if (! authService.hasStoredTokens()) {
      setState({ user: null, isAuthenticated: false, isLoading: false, error: null });
      return;
    }

    try {
      const user = await authService.getCurrentUser();
      setState({ user, isAuthenticated: true, isLoading: false, error: null });
    } catch (error) {
      setState({ user: null, isAuthenticated:  false, isLoading: false, error: null });
    }
  };

  const login = useCallback(
    async (identifier: string, password: string, rememberMe?:  boolean) => {
      setState((prev) => ({ ...prev, isLoading: true, error: null }));

      try {
        const request: LoginRequest = { identifier, password, rememberMe };
        const result = await authService.login(request);

        if ('mfaRequired' in result && result.mfaRequired) {
          setState((prev) => ({ ...prev, isLoading: false }));
          return { mfaRequired: true, mfaToken: result.mfaToken };
        }

        if ('user' in result) {
          setState({
            user: result.user,
            isAuthenticated: true,
            isLoading: false,
            error: null,
          });
          return { success: true };
        }
      } catch (error:  any) {
        const message = error.response?.data?.message || error.message || 'Login failed';
        setState((prev) => ({ ...prev, isLoading: false, error:  message }));
        throw new Error(message);
      }
    },
    [],
  );

  const register = useCallback(async (data:  Omit<RegisterRequest, 'userType'>) => {
    setState((prev) => ({ ...prev, isLoading: true, error:  null }));

    try {
      const request: RegisterRequest = {
        ...data,
        userType: UserType.PATIENT,
      };
      const result = await authService.register(request);
      setState((prev) => ({ ...prev, isLoading: false }));
      return result;
    } catch (error:  any) {
      const message = error.response?.data?.message || error.message || 'Registration failed';
      setState((prev) => ({ ...prev, isLoading: false, error: message }));
      throw new Error(message);
    }
  }, []);

  const logout = useCallback(async () => {
    setState((prev) => ({ ...prev, isLoading: true }));

    try {
      await authService.logout();
    } catch {
      // Ignore logout errors
    } finally {
      setState({ user: null, isAuthenticated:  false, isLoading: false, error: null });
      router.push('/auth/login');
    }
  }, [router]);

  const refreshUser = useCallback(async () => {
    try {
      const user = await authService.getCurrentUser();
      setState((prev) => ({ ...prev, user, isAuthenticated: true }));
      return user;
    } catch (error:  any) {
      throw error;
    }
  }, []);

  const clearError = useCallback(() => {
    setState((prev) => ({ ...prev, error: null }));
  }, []);

  return {
    ... state,
    login,
    register,
    logout,
    refreshUser,
    clearError,
    checkAuthStatus,
  };
}
