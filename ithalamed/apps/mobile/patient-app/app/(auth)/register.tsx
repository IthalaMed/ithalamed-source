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

import { registerSchema, RegisterFormData } from '@ithalamed/mobile-core';
import { useAuth } from '../../src/hooks/useAuth';

export default function RegisterScreen() {
  const [showPassword, setShowPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const { register:  registerUser, isLoading, error } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues:  {
      firstName: '',
      lastName: '',
      phoneNumber: '',
      email: '',
      password: '',
      confirmPassword: '',
      termsAccepted: false,
      privacyAccepted: false,
    },
  });

  const onSubmit = async (data: RegisterFormData) => {
    try {
      const result = await registerUser({
        firstName: data.firstName,
        lastName: data.lastName,
        phoneNumber: data.phoneNumber,
        email: data.email || undefined,
        password: data.password,
        termsAccepted: data.termsAccepted,
        privacyAccepted: data.privacyAccepted,
      });

      if (result.requiresPhoneVerification) {
        router.push({
          pathname: '/(auth)/verify-otp',
          params: { identifier: data.phoneNumber, purpose: 'phone_verification' },
        });
      } else {
        router.replace('/(app)/home');
      }
    } catch (err:  any) {
      Alert.alert('Registration Failed', err.message || 'Please try again');
    }
  };

  return (
    <SafeAreaView className="flex-1 bg-white">
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' :  'height'}
        className="flex-1"
      >
        <ScrollView
          contentContainerStyle={{ flexGrow: 1 }}
          keyboardShouldPersistTaps="handled"
          className="px-6"
        >
          <TouchableOpacity className="mt-4" onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#374151" />
          </TouchableOpacity>

          <View className="mt-8 mb-6">
            <Text className="text-3xl font-bold text-gray-900">Create Account</Text>
            <Text className="text-base text-gray-600 mt-2">
              Join IthalaMed to manage your health
            </Text>
          </View>

          <View className="space-y-4">
            <View className="flex-row space-x-3">
              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">First Name</Text>
                <Controller
                  control={control}
                  name="firstName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 px-4 border rounded-xl text-base ${
                        errors.firstName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="First name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                    />
                  )}
                />
                {errors.firstName && (
                  <Text className="text-red-500 text-xs mt-1">{errors.firstName.message}</Text>
                )}
              </View>

              <View className="flex-1">
                <Text className="text-sm font-medium text-gray-700 mb-2">Last Name</Text>
                <Controller
                  control={control}
                  name="lastName"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 px-4 border rounded-xl text-base ${
                        errors.lastName ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Last name"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                    />
                  )}
                />
                {errors. lastName && (
                  <Text className="text-red-500 text-xs mt-1">{errors.lastName.message}</Text>
                )}
              </View>
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Phone Number</Text>
              <Controller
                control={control}
                name="phoneNumber"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className={`h-12 px-4 border rounded-xl text-base ${
                      errors. phoneNumber ? 'border-red-500' : 'border-gray-300'
                    }`}
                    placeholder="+27 XX XXX XXXX"
                    keyboardType="phone-pad"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
              {errors.phoneNumber && (
                <Text className="text-red-500 text-sm mt-1">{errors.phoneNumber.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Email (Optional)</Text>
              <Controller
                control={control}
                name="email"
                render={({ field: { onChange, onBlur, value } }) => (
                  <TextInput
                    className="h-12 px-4 border border-gray-300 rounded-xl text-base"
                    placeholder="email@example.com"
                    keyboardType="email-address"
                    autoCapitalize="none"
                    onBlur={onBlur}
                    onChangeText={onChange}
                    value={value}
                    editable={!isLoading}
                  />
                )}
              />
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
                        errors.password ? 'border-red-500' :  'border-gray-300'
                      }`}
                      placeholder="Create password"
                      secureTextEntry={!showPassword}
                      autoCapitalize="none"
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
                  <Ionicons name={showPassword ? 'eye-off' : 'eye'} size={24} color="#9CA3AF" />
                </TouchableOpacity>
              </View>
              {errors.password && (
                <Text className="text-red-500 text-sm mt-1">{errors.password.message}</Text>
              )}
            </View>

            <View>
              <Text className="text-sm font-medium text-gray-700 mb-2">Confirm Password</Text>
              <View className="relative">
                <Controller
                  control={control}
                  name="confirmPassword"
                  render={({ field: { onChange, onBlur, value } }) => (
                    <TextInput
                      className={`h-12 px-4 pr-12 border rounded-xl text-base ${
                        errors.confirmPassword ? 'border-red-500' : 'border-gray-300'
                      }`}
                      placeholder="Confirm password"
                      secureTextEntry={!showConfirmPassword}
                      autoCapitalize="none"
                      onBlur={onBlur}
                      onChangeText={onChange}
                      value={value}
                      editable={!isLoading}
                    />
                  )}
                />
                <TouchableOpacity
                  className="absolute right-4 top-3"
                  onPress={() => setShowConfirmPassword(! showConfirmPassword)}
                >
                  <Ionicons
                    name={showConfirmPassword ? 'eye-off' :  'eye'}
                    size={24}
                    color="#9CA3AF"
                  />
                </TouchableOpacity>
              </View>
              {errors.confirmPassword && (
                <Text className="text-red-500 text-sm mt-1">{errors.confirmPassword. message}</Text>
              )}
            </View>

            <Controller
              control={control}
              name="termsAccepted"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  className="flex-row items-start"
                  onPress={() => onChange(!value)}
                >
                  <View
                    className={`w-5 h-5 rounded border mr-3 mt-0.5 items-center justify-center ${
                      value ? 'bg-cyan-600 border-cyan-600' : 'border-gray-300'
                    }`}
                  >
                    {value && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text className="flex-1 text-gray-600 text-sm">
                    I accept the{' '}
                    <Text className="text-cyan-600">Terms and Conditions</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.termsAccepted && (
              <Text className="text-red-500 text-sm">{errors.termsAccepted.message}</Text>
            )}

            <Controller
              control={control}
              name="privacyAccepted"
              render={({ field: { onChange, value } }) => (
                <TouchableOpacity
                  className="flex-row items-start"
                  onPress={() => onChange(!value)}
                >
                  <View
                    className={`w-5 h-5 rounded border mr-3 mt-0.5 items-center justify-center ${
                      value ?  'bg-cyan-600 border-cyan-600' : 'border-gray-300'
                    }`}
                  >
                    {value && <Ionicons name="checkmark" size={14} color="white" />}
                  </View>
                  <Text className="flex-1 text-gray-600 text-sm">
                    I accept the <Text className="text-cyan-600">Privacy Policy</Text>
                  </Text>
                </TouchableOpacity>
              )}
            />
            {errors.privacyAccepted && (
              <Text className="text-red-500 text-sm">{errors.privacyAccepted.message}</Text>
            )}

            <TouchableOpacity
              className={`h-14 rounded-xl items-center justify-center mt-4 ${
                isLoading ? 'bg-cyan-300' : 'bg-cyan-600'
              }`}
              onPress={handleSubmit(onSubmit)}
              disabled={isLoading}
            >
              <Text className="text-white font-semibold text-lg">
                {isLoading ? 'Creating Account...' : 'Create Account'}
              </Text>
            </TouchableOpacity>

            {error && (
              <View className="bg-red-50 p-3 rounded-lg">
                <Text className="text-red-600 text-center">{error}</Text>
              </View>
            )}
          </View>

          <View className="flex-row justify-center mt-6 mb-8">
            <Text className="text-gray-600">Already have an account? </Text>
            <Link href="/(auth)/login" asChild>
              <TouchableOpacity>
                <Text className="text-cyan-600 font-semibold">Sign In</Text>
              </TouchableOpacity>
            </Link>
          </View>
        </ScrollView>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
}
