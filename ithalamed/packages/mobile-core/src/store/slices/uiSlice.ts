import { createSlice, PayloadAction } from '@reduxjs/toolkit';

type ThemeMode = 'light' | 'dark' | 'system';

interface Toast {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  message:  string;
  duration?:  number;
}

interface UiState {
  theme: ThemeMode;
  language: string;
  isOnline: boolean;
  isAppReady: boolean;
  showSplash: boolean;
  toasts: Toast[];
}

const initialState: UiState = {
  theme: 'system',
  language: 'en',
  isOnline:  true,
  isAppReady: false,
  showSplash: true,
  toasts: [],
};

const uiSlice = createSlice({
  name:  'ui',
  initialState,
  reducers: {
    setTheme: (state, action: PayloadAction<ThemeMode>) => {
      state.theme = action.payload;
    },
    setLanguage: (state, action: PayloadAction<string>) => {
      state.language = action.payload;
    },
    setOnlineStatus: (state, action: PayloadAction<boolean>) => {
      state.isOnline = action.payload;
    },
    setAppReady: (state, action: PayloadAction<boolean>) => {
      state.isAppReady = action.payload;
    },
    hideSplash: (state) => {
      state.showSplash = false;
    },
    addToast: (state, action: PayloadAction<Omit<Toast, 'id'>>) => {
      const id = Date.now().toString();
      state.toasts.push({ ... action.payload, id });
    },
    removeToast: (state, action: PayloadAction<string>) => {
      state.toasts = state.toasts. filter((t) => t.id !== action. payload);
    },
    clearToasts: (state) => {
      state.toasts = [];
    },
  },
});

export const {
  setTheme,
  setLanguage,
  setOnlineStatus,
  setAppReady,
  hideSplash,
  addToast,
  removeToast,
  clearToasts,
} = uiSlice.actions;

export default uiSlice.reducer;
