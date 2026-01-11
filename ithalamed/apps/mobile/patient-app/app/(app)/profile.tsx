import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, Alert } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getInitials } from '@ithalamed/mobile-core';
import { useAuth } from '../../src/hooks/useAuth';
import { usePatient } from '../../src/hooks/usePatient';

export default function ProfileScreen() {
  const { user, logout } = useAuth();
  const { profile } = usePatient();

  const handleLogout = async () => {
    Alert.alert('Logout', 'Are you sure you want to logout?', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Logout',
        style: 'destructive',
        onPress: async () => {
          await logout();
          router.replace('/(auth)/welcome');
        },
      },
    ]);
  };

  const displayName = profile?.fullName || `${user?.firstName} ${user?. lastName}`;

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView className="flex-1">
        <View className="items-center pt-8 pb-6">
          <View className="w-24 h-24 bg-cyan-100 rounded-full items-center justify-center">
            <Text className="text-cyan-600 text-3xl font-bold">{getInitials(displayName)}</Text>
          </View>
          <Text className="text-xl font-bold text-gray-900 mt-4">{displayName}</Text>
          <Text className="text-gray-500">{user?.phoneNumber}</Text>
          {profile?.patientNumber && (
            <Text className="text-cyan-600 text-sm mt-1">{profile.patientNumber}</Text>
          )}
        </View>

        <View className="px-6">
          <Text className="text-gray-500 text-sm font-medium mb-2 ml-2">ACCOUNT</Text>
          <View className="bg-white rounded-2xl overflow-hidden mb-6">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Ionicons name="person-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Personal Information</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Ionicons name="card-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Medical Aid</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4">
              <Ionicons name="people-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Emergency Contacts</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-sm font-medium mb-2 ml-2">SECURITY</Text>
          <View className="bg-white rounded-2xl overflow-hidden mb-6">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Ionicons name="lock-closed-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Change Password</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Ionicons name="keypad-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">PIN Settings</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4">
              <Ionicons name="finger-print" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Biometric Login</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <Text className="text-gray-500 text-sm font-medium mb-2 ml-2">SUPPORT</Text>
          <View className="bg-white rounded-2xl overflow-hidden mb-6">
            <TouchableOpacity className="flex-row items-center p-4 border-b border-gray-100">
              <Ionicons name="help-circle-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Help & Support</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>

            <TouchableOpacity className="flex-row items-center p-4">
              <Ionicons name="document-text-outline" size={22} color="#0891b2" />
              <Text className="flex-1 ml-3 text-gray-900">Privacy Policy</Text>
              <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
            </TouchableOpacity>
          </View>

          <TouchableOpacity
            className="bg-red-50 rounded-2xl p-4 flex-row items-center justify-center mb-8"
            onPress={handleLogout}
          >
            <Ionicons name="log-out-outline" size={22} color="#ef4444" />
            <Text className="text-red-500 font-semibold ml-2">Logout</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
