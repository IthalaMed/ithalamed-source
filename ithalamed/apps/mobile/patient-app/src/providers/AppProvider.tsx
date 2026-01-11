import React, { useEffect, useState } from 'react';
import { Provider } from 'react-redux';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import * as SplashScreen from 'expo-splash-screen';

import { store } from '../lib/store';
import { initializeApp } from '../lib/init';
import { useAppDispatch, checkAuthStatus } from '@ithalamed/mobile-core';

SplashScreen.preventAutoHideAsync();

interface AppProviderProps {
  children: React.ReactNode;
}

function AppInitializer({ children }: { children: React.ReactNode }) {
  const dispatch = useAppDispatch();
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        await dispatch(checkAuthStatus());
      } catch (error) {
        console.error('[AppInitializer] Error:', error);
      } finally {
        setIsReady(true);
        await SplashScreen.hideAsync();
      }
    }
    prepare();
  }, [dispatch]);

  if (!isReady) {
    return null;
  }

  return <>{children}</>;
}

export function AppProvider({ children }: AppProviderProps) {
  useEffect(() => {
    initializeApp();
  }, []);

  return (
    <GestureHandlerRootView style={{ flex: 1 }}>
      <Provider store={store}>
        <AppInitializer>{children}</AppInitializer>
      </Provider>
    </GestureHandlerRootView>
  );
}
