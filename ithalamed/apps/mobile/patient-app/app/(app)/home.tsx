import React from 'react';
import { View, Text, ScrollView, TouchableOpacity, RefreshControl } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { Ionicons } from '@expo/vector-icons';

import { getInitials, AllergySeverity } from '@ithalamed/mobile-core';
import { useAuth } from '../../src/hooks/useAuth';
import { usePatient } from '../../src/hooks/usePatient';

export default function HomeScreen() {
  const { user } = useAuth();
  const {
    profile,
    severeAllergies,
    primaryMedicalAid,
    activeConditions,
    isLoading,
    refreshAllData,
  } = usePatient();

  const [refreshing, setRefreshing] = React.useState(false);

  const onRefresh = async () => {
    setRefreshing(true);
    await refreshAllData();
    setRefreshing(false);
  };

  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <ScrollView
        className="flex-1"
        refreshControl={<RefreshControl refreshing={refreshing} onRefresh={onRefresh} />}
      >
        {/* Header */}
        <View className="bg-cyan-600 px-6 pt-4 pb-8 rounded-b-3xl">
          <View className="flex-row items-center justify-between mb-6">
            <View className="flex-row items-center">
              <View className="w-12 h-12 bg-white/20 rounded-full items-center justify-center">
                <Text className="text-white text-lg font-bold">
                  {getInitials(profile?.fullName || user?.firstName + ' ' + user?.lastName || '')}
                </Text>
              </View>
              <View className="ml-3">
                <Text className="text-white/80 text-sm">Welcome back,</Text>
                <Text className="text-white font-bold text-lg">
                  {profile?.firstName || user?.firstName}
                </Text>
              </View>
            </View>
            <TouchableOpacity className="w-10 h-10 bg-white/20 rounded-full items-center justify-center">
              <Ionicons name="notifications-outline" size={24} color="white" />
            </TouchableOpacity>
          </View>

          {profile?.patientNumber && (
            <View className="bg-white/10 rounded-xl p-4">
              <Text className="text-white/80 text-xs">Patient Number</Text>
              <Text className="text-white font-bold text-lg">{profile. patientNumber}</Text>
            </View>
          )}
        </View>

        <View className="px-6 -mt-4">
          {/* Quick Actions */}
          <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
            <Text className="text-gray-900 font-semibold text-base mb-4">Quick Actions</Text>
            <View className="flex-row flex-wrap justify-between">
              <TouchableOpacity
                className="w-[48%] bg-cyan-50 rounded-xl p-4 mb-3"
                onPress={() => router.push('/(app)/appointments')}
              >
                <View className="w-10 h-10 bg-cyan-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="calendar-outline" size={20} color="#0891b2" />
                </View>
                <Text className="text-gray-900 font-medium">Book Appointment</Text>
              </TouchableOpacity>

              <TouchableOpacity
                className="w-[48%] bg-indigo-50 rounded-xl p-4 mb-3"
                onPress={() => router.push('/(app)/records')}
              >
                <View className="w-10 h-10 bg-indigo-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="document-outline" size={20} color="#6366f1" />
                </View>
                <Text className="text-gray-900 font-medium">My Documents</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] bg-green-50 rounded-xl p-4">
                <View className="w-10 h-10 bg-green-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="medical-outline" size={20} color="#10b981" />
                </View>
                <Text className="text-gray-900 font-medium">Medications</Text>
              </TouchableOpacity>

              <TouchableOpacity className="w-[48%] bg-amber-50 rounded-xl p-4">
                <View className="w-10 h-10 bg-amber-100 rounded-full items-center justify-center mb-2">
                  <Ionicons name="call-outline" size={20} color="#f59e0b" />
                </View>
                <Text className="text-gray-900 font-medium">Emergency</Text>
              </TouchableOpacity>
            </View>
          </View>

          {/* Allergy Alert */}
          {severeAllergies. length > 0 && (
            <View className="bg-red-50 rounded-2xl p-4 mb-6 border border-red-200">
              <View className="flex-row items-center mb-3">
                <Ionicons name="warning" size={20} color="#ef4444" />
                <Text className="text-red-700 font-semibold text-base ml-2">Allergy Alert</Text>
              </View>
              {severeAllergies.slice(0, 3).map((allergy) => (
                <View key={allergy.id} className="flex-row items-center py-2 border-t border-red-200">
                  <View className="flex-1">
                    <Text className="text-red-700 font-medium">{allergy.allergen}</Text>
                    <Text className="text-red-600 text-sm">
                      {allergy.severity === AllergySeverity. LIFE_THREATENING
                        ? 'Life Threatening'
                        : 'Severe'}
                    </Text>
                  </View>
                </View>
              ))}
            </View>
          )}

          {/* Medical Aid */}
          {primaryMedicalAid && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <View className="flex-row items-center justify-between mb-3">
                <Text className="text-gray-900 font-semibold text-base">Medical Aid</Text>
                {primaryMedicalAid.isVerified && (
                  <View className="flex-row items-center bg-green-50 px-2 py-1 rounded-full">
                    <Ionicons name="checkmark-circle" size={14} color="#10b981" />
                    <Text className="text-green-600 text-xs ml-1">Verified</Text>
                  </View>
                )}
              </View>
              <View className="bg-gray-50 rounded-xl p-3">
                <Text className="text-gray-900 font-medium">{primaryMedicalAid. schemeName}</Text>
                <Text className="text-gray-600 text-sm">{primaryMedicalAid. planName}</Text>
                <Text className="text-gray-500 text-sm mt-1">
                  Member:  {primaryMedicalAid. membershipNumber}
                </Text>
              </View>
            </View>
          )}

          {/* Active Conditions */}
          {activeConditions.length > 0 && (
            <View className="bg-white rounded-2xl p-4 shadow-sm mb-6">
              <Text className="text-gray-900 font-semibold text-base mb-3">Health Conditions</Text>
              {activeConditions.slice(0, 3).map((condition) => (
                <View
                  key={condition.id}
                  className="flex-row items-center py-2 border-b border-gray-100"
                >
                  <View className="w-8 h-8 bg-cyan-50 rounded-full items-center justify-center">
                    <Ionicons name="heart" size={16} color="#0891b2" />
                  </View>
                  <View className="flex-1 ml-3">
                    <Text className="text-gray-900 font-medium">{condition. conditionName}</Text>
                    <Text className="text-gray-500 text-sm capitalize">{condition.status}</Text>
                  </View>
                </View>
              ))}
            </View>
          )}
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
