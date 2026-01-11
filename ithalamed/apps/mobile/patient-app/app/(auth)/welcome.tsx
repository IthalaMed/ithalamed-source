import React from 'react';
import { View, Text, TouchableOpacity, Image } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { router } from 'expo-router';
import { LinearGradient } from 'expo-linear-gradient';

export default function WelcomeScreen() {
  return (
    <LinearGradient colors={['#0891b2', '#0e7490']} className="flex-1">
      <SafeAreaView className="flex-1 px-6">
        <View className="flex-1 justify-center items-center">
          <View className="w-24 h-24 bg-white/20 rounded-full items-center justify-center mb-8">
            <Text className="text-white text-4xl font-bold">IM</Text>
          </View>
          
          <Text className="text-white text-4xl font-bold text-center mb-4">
            IthalaMed
          </Text>
          
          <Text className="text-white/80 text-lg text-center mb-8">
            Your Health, Connected
          </Text>
          
          <Text className="text-white/60 text-center text-base px-8">
            Access your medical records, book appointments, and connect with healthcare providers - all in one place. 
          </Text>
        </View>

        <View className="pb-8">
          <TouchableOpacity
            className="bg-white h-14 rounded-xl items-center justify-center mb-4"
            onPress={() => router.push('/(auth)/login')}
          >
            <Text className="text-primary-600 font-semibold text-lg">Sign In</Text>
          </TouchableOpacity>

          <TouchableOpacity
            className="border-2 border-white h-14 rounded-xl items-center justify-center"
            onPress={() => router.push('/(auth)/register')}
          >
            <Text className="text-white font-semibold text-lg">Create Account</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    </LinearGradient>
  );
}
