import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function AppointmentsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Appointments</Text>
        <Text className="text-gray-600 mt-1">Manage your appointments</Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-6">
        <View className="bg-white rounded-2xl p-6 items-center justify-center h-64">
          <Ionicons name="calendar-outline" size={48} color="#9CA3AF" />
          <Text className="text-gray-500 mt-4 text-center">No upcoming appointments</Text>
          <TouchableOpacity className="bg-cyan-600 px-6 py-3 rounded-xl mt-4">
            <Text className="text-white font-semibold">Book Appointment</Text>
          </TouchableOpacity>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}
