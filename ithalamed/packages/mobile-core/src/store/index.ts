import { configureStore, combineReducers } from '@reduxjs/toolkit';
import { TypedUseSelectorHook, useDispatch, useSelector } from 'react-redux';

import authReducer from './slices/authSlice';
import patientReducer from './slices/patientSlice';
import uiReducer from './slices/uiSlice';

export const rootReducer = combineReducers({
  auth: authReducer,
  patient: patientReducer,
  ui: uiReducer,
});

export type RootState = ReturnType<typeof rootReducer>;

export function createStore(preloadedState?:  Partial<RootState>) {
  return configureStore({
    reducer: rootReducer,
    preloadedState,
    middleware: (getDefaultMiddleware) =>
      getDefaultMiddleware({
        serializableCheck: {
          ignoredActions: ['auth/setUser', 'patient/setProfile'],
          ignoredPaths: ['auth. user', 'patient.profile'],
        },
      }),
  });
}

export type AppStore = ReturnType<typeof createStore>;
export type AppDispatch = AppStore['dispatch'];

export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;

export * from './slices';
