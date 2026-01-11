import React from 'react';
import { View, Text, ScrollView, TouchableOpacity } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

export default function RecordsScreen() {
  return (
    <SafeAreaView className="flex-1 bg-gray-50">
      <View className="px-6 pt-4">
        <Text className="text-2xl font-bold text-gray-900">Health Records</Text>
        <Text className="text-gray-600 mt-1">View your medical history</Text>
      </View>

      <ScrollView className="flex-1 px-6 mt-6">
        <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center mb-3">
          <View className="w-10 h-10 bg-cyan-50 rounded-full items-center justify-center">
            <Ionicons name="document-text" size={20} color="#0891b2" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-medium">Documents</Text>
            <Text className="text-gray-500 text-sm">Lab results, prescriptions, etc.</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center mb-3">
          <View className="w-10 h-10 bg-red-50 rounded-full items-center justify-center">
            <Ionicons name="alert-circle" size={20} color="#ef4444" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-medium">Allergies</Text>
            <Text className="text-gray-500 text-sm">Manage your allergies</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center mb-3">
          <View className="w-10 h-10 bg-purple-50 rounded-full items-center justify-center">
            <Ionicons name="heart" size={20} color="#8b5cf6" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-medium">Chronic Conditions</Text>
            <Text className="text-gray-500 text-sm">Track health conditions</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>

        <TouchableOpacity className="bg-white rounded-xl p-4 flex-row items-center mb-3">
          <View className="w-10 h-10 bg-green-50 rounded-full items-center justify-center">
            <Ionicons name="medical" size={20} color="#10b981" />
          </View>
          <View className="flex-1 ml-3">
            <Text className="text-gray-900 font-medium">Medications</Text>
            <Text className="text-gray-500 text-sm">Current medications</Text>
          </View>
          <Ionicons name="chevron-forward" size={20} color="#9CA3AF" />
        </TouchableOpacity>
      </ScrollView>
    </SafeAreaView>
  );
}
