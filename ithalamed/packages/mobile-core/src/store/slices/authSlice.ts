import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Import from shared-types
import {
  User,
  LoginRequest,
  RegisterRequest,
  LoginResult,
  MfaRequiredResponse,
  LoginResponse,
  OtpPurpose,
  UserType,
} from '@ithalamed/shared-types';

import { getAuthService } from '../../services/api/auth.service';

interface AuthState {
  user:  User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  error:  string | null;
  mfaRequired: boolean;
  mfaToken:  string | null;
  mfaMethod: string | null;
  requiresPhoneVerification: boolean;
  requiresEmailVerification: boolean;
  pendingUserId: string | null;
  pinEnabled: boolean;
  biometricEnabled: boolean;
}

const initialState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: false,
  error: null,
  mfaRequired: false,
  mfaToken: null,
  mfaMethod: null,
  requiresPhoneVerification: false,
  requiresEmailVerification: false,
  pendingUserId: null,
  pinEnabled: false,
  biometricEnabled: false,
};

export const login = createAsyncThunk(
  'auth/login',
  async (request: LoginRequest, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      return await authService.login(request);
    } catch (error:  any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Login failed');
    }
  },
);

export const loginWithPin = createAsyncThunk(
  'auth/loginWithPin',
  async ({ userId, pin }: { userId: string; pin: string }, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      return await authService.loginWithPin({ userId, pin });
    } catch (error: any) {
      return rejectWithValue(error. response?.data?.message || error. message || 'PIN login failed');
    }
  },
);

export const loginWithBiometric = createAsyncThunk(
  'auth/loginWithBiometric',
  async (
    { userId, biometricToken }: { userId: string; biometricToken: string },
    { rejectWithValue },
  ) => {
    try {
      const authService = getAuthService();
      return await authService. loginWithBiometric({ userId, biometricToken });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Biometric login failed');
    }
  },
);

export const register = createAsyncThunk(
  'auth/register',
  async (request: RegisterRequest, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      return await authService.register(request);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Registration failed');
    }
  },
);

export const verifyOtp = createAsyncThunk(
  'auth/verifyOtp',
  async (
    { identifier, code, purpose }: { identifier: string; code: string; purpose: OtpPurpose },
    { rejectWithValue },
  ) => {
    try {
      const authService = getAuthService();
      await authService.verifyOtp({ identifier, code, purpose });
      return { identifier, purpose };
    } catch (error:  any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Verification failed');
    }
  },
);

export const verifyMfa = createAsyncThunk(
  'auth/verifyMfa',
  async (
    { mfaToken, code, isBackupCode }: { mfaToken: string; code: string; isBackupCode?:  boolean },
    { rejectWithValue },
  ) => {
    try {
      const authService = getAuthService();
      return await authService.verifyMfa({ mfaToken, code, isBackupCode });
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'MFA verification failed');
    }
  },
);

export const fetchCurrentUser = createAsyncThunk(
  'auth/fetchCurrentUser',
  async (_, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      return await authService.getCurrentUser();
    } catch (error: any) {
      return rejectWithValue(error.response?. data?.message || error.message || 'Failed to fetch user');
    }
  },
);

export const logoutUser = createAsyncThunk('auth/logout', async () => {
  try {
    const authService = getAuthService();
    await authService.logout();
  } catch (error: any) {
    console.warn('Logout API call failed:', error);
  }
});

export const checkAuthStatus = createAsyncThunk(
  'auth/checkStatus',
  async (_, { rejectWithValue }) => {
    try {
      const authService = getAuthService();
      const hasTokens = await authService.hasStoredTokens();
      const pinEnabled = await authService.isPinEnabled();
      const biometricEnabled = await authService.isBiometricEnabled();
      const userId = await authService.getStoredUserId();
      return { hasTokens, pinEnabled, biometricEnabled, userId };
    } catch (error: any) {
      return rejectWithValue(error.message);
    }
  },
);

const authSlice = createSlice({
  name: 'auth',
  initialState,
  reducers: {
    setUser: (state, action: PayloadAction<User>) => {
      state.user = action.payload;
      state. isAuthenticated = true;
    },
    setTokens: (
      state,
      action: PayloadAction<{ accessToken: string; refreshToken: string; expiresIn: number }>,
    ) => {
      // Tokens stored in secure storage
    },
    clearError: (state) => {
      state.error = null;
    },
    clearMfaState: (state) => {
      state.mfaRequired = false;
      state.mfaToken = null;
      state.mfaMethod = null;
    },
    clearVerificationState: (state) => {
      state.requiresPhoneVerification = false;
      state.requiresEmailVerification = false;
      state.pendingUserId = null;
    },
    setPinEnabled: (state, action:  PayloadAction<boolean>) => {
      state.pinEnabled = action.payload;
    },
    setBiometricEnabled: (state, action: PayloadAction<boolean>) => {
      state.biometricEnabled = action.payload;
    },
    logout: (state) => {
      state.user = null;
      state.isAuthenticated = false;
      state.mfaRequired = false;
      state.mfaToken = null;
      state.mfaMethod = null;
      state. requiresPhoneVerification = false;
      state.requiresEmailVerification = false;
      state.pendingUserId = null;
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state. isLoading = false;
        if ('mfaRequired' in action.payload && action.payload.mfaRequired) {
          const mfaResponse = action.payload as MfaRequiredResponse;
          state. mfaRequired = true;
          state.mfaToken = mfaResponse.mfaToken;
          state. mfaMethod = mfaResponse.mfaMethod;
        } else {
          const loginResponse = action.payload as LoginResponse;
          state.user = loginResponse.user;
          state. isAuthenticated = true;
          state.mfaRequired = false;
          state.mfaToken = null;
          state.mfaMethod = null;
        }
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithPin.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithPin.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithPin.rejected, (state, action) => {
        state. isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(loginWithBiometric.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(loginWithBiometric.fulfilled, (state, action) => {
        state.isLoading = false;
        state. user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(loginWithBiometric.rejected, (state, action) => {
        state.isLoading = false;
        state. error = action.payload as string;
      })
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state. error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.requiresPhoneVerification = action.payload.requiresPhoneVerification;
        state.requiresEmailVerification = action.payload. requiresEmailVerification;
        state.pendingUserId = action.payload.user.id;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state. error = action.payload as string;
      })
      .addCase(verifyOtp.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyOtp.fulfilled, (state, action) => {
        state.isLoading = false;
        if (action.payload.purpose === OtpPurpose.PHONE_VERIFICATION) {
          state.requiresPhoneVerification = false;
        } else if (action.payload.purpose === OtpPurpose.EMAIL_VERIFICATION) {
          state.requiresEmailVerification = false;
        }
      })
      .addCase(verifyOtp.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(verifyMfa.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(verifyMfa. fulfilled, (state, action) => {
        state.isLoading = false;
        state.mfaRequired = false;
        state.mfaToken = null;
        state.mfaMethod = null;
        state.user = action.payload.user;
        state.isAuthenticated = true;
      })
      .addCase(verifyMfa.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchCurrentUser.pending, (state) => {
        state.isLoading = true;
      })
      .addCase(fetchCurrentUser.fulfilled, (state, action) => {
        state. isLoading = false;
        state.user = action.payload;
        state.isAuthenticated = true;
      })
      .addCase(fetchCurrentUser.rejected, (state) => {
        state.isLoading = false;
        state.isAuthenticated = false;
        state.user = null;
      })
      .addCase(logoutUser.fulfilled, (state) => {
        state.isLoading = false;
        state.user = null;
        state.isAuthenticated = false;
        state.mfaRequired = false;
        state.mfaToken = null;
        state.mfaMethod = null;
      })
      .addCase(checkAuthStatus.fulfilled, (state, action) => {
        state.pinEnabled = action.payload.pinEnabled;
        state.biometricEnabled = action.payload.biometricEnabled;
      });
  },
});

export const {
  setUser,
  setTokens,
  clearError,
  clearMfaState,
  clearVerificationState,
  setPinEnabled,
  setBiometricEnabled,
  logout,
} = authSlice. actions;

export default authSlice.reducer;
