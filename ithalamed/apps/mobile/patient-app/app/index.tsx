import { Redirect } from 'expo-router';
import { View, ActivityIndicator } from 'react-native';

import { useAppSelector } from '@ithalamed/mobile-core';

export default function Index() {
  const { isAuthenticated, isLoading } = useAppSelector((state) => state.auth);

  if (isLoading) {
    return (
      <View className="flex-1 items-center justify-center bg-white">
        <ActivityIndicator size="large" color="#0891b2" />
      </View>
    );
  }

  if (isAuthenticated) {
    return <Redirect href="/(app)/home" />;
  }

  return <Redirect href="/(auth)/welcome" />;
}
