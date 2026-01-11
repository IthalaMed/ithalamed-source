import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Link, router } from 'expo-router';
import { useForm, Controller } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { Ionicons } from '@expo/vector-icons';

import { loginSchema, LoginFormData } from '@ithalamed/mobile-core';
import { useAuth } from '../../src/hooks/useAuth';
import { useBiometric } from '../../src/hooks/useBiometric';

export default function LoginScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const { login, isLoading, error, biometricEnabled } = useAuth();
  const { isAvailable, authenticate, getBiometricLabel } = useBiometric();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      identifier: '',
      password: '',
      rememberMe: false,
    },
  });

  const onSubmit = async (data: LoginFormData) => {
    try {
      const result = await login(data.identifier, data.password, data.rememberMe);

      if ('mfaRequired' in result && result.mfaRequired) {
        router.push('/(auth)/verify-mfa');
      } else {
        router.replace('/(app)/home');
      }
    } catch (err:  any) {
      Alert.alert('Login Failed', err.message || 'Please check your credentials');
    }
  };

  const handleBiometricLogin = async () => {
    const success = await authenticate(`Login with ${getBiometricLabel()}`);
    if (success) {
      Alert.alert('Info', 'Biometric login implementation pending');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow:  1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="mt-8 mb-8">
            <Text className="text-3xl font-bold text-gray-900">Welcome Back</Text>
            <Text className="text-base text-gray-600 mt-2">
              Sign in to access your health records
            </Text>
          </View>

          <View className="space-y-4">
            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">
                Email or Phone Number
              </Text>
              <Controller
                control={control}
                name="identifier"
                render={({ field:  { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 px-4 border rounded-xl text-base ${
                      errors.identifier ? 'border-red-500' :  'border-gray-300'
                    }`}
                    placeholder="Enter email or phone"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    autoCorrect={false}
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={! isLoading}
                  />
                )}
              />
              {errors.identifier && (
                <Text className="text-red-500 text-sm mt-1">{errors.identifier.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Password</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="password"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 px-4 pr-12 border rounded-xl text-base ${
                        errors. password ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Enter password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
                      autoCorrect={false}
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setShowPassword(!showPassword)}
                >
                  <Ionicons
                    name={showPassword ?  'eye-off' : 'eye'}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
              )}
            </View>

            <View className="items-end">
              <Link href="/(auth)/forgot-password" asChild>
                <TouchableOpacity>
                  <Text className="text-cyan-600 font-medium">Forgot Password? </Text>
                </TouchableOpacity>
              </Link>
            </View>

            <TouchableOpacity
              className={`h-14 rounded-xl items-center justify-center mt-4 ${
                isLoading ? 'bg-cyan-300' : 'bg-cyan-600'
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Signing in...' : 'Sign In'}
              </Text>
            </TouchableOpacity>

            {isAvailable && biometricEnabled && (
              <TouchableOpacity
                className="h-14 rounded-xl items-center justify-center border border-gray-300 flex-row"
                onPress={handleBiometricLogin}
                disabled={isLoading}
              >
                <Ionicons name="finger-print" size={24} color="#0891b2" />
                <Text className="text-cyan-600 font-semibold text-lg ml-2">
                  Login with {getBiometricLabel()}
                </Text>
              </TouchableOpacity>
            )}

            {error && (
              <View className="bg-red-50 p-3 rounded-lg">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}
          </View>

          <View className="flex-row justify-center mt-8 mb-8">
            <Text className="text-gray-600">Don't have an account?  </Text>
            <Link href="/(auth)/register" asChild>
              <TouchableOpacity>
                <Text className="text-cyan-600 font-semibold">Sign Up</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
