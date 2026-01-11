'use client';

import { useState } from 'react';
import { User, Mail, Phone, MapPin, Calendar, Shield, Edit2, Camera } from 'lucide-react';

import { useAuth } from '@/hooks/useAuth';
import { usePatient } from '@/hooks/usePatient';
import { formatDate, getInitials, formatPhoneNumber } from '@ithalamed/web-core';

export default function ProfilePage() {
  const { user } = useAuth();
  const { profile, isLoading } = usePatient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  const displayName = profile?.fullName || `${user?.firstName} ${user?.lastName}`;

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Profile</h1>
        <p className="text-gray-600">Manage your personal information</p>
      </div>

      {/* Profile Header */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex flex-col sm:flex-row items-center gap-6">
          <div className="relative">
            <div className="w-24 h-24 bg-primary/10 rounded-full flex items-center justify-center">
              <span className="text-primary text-3xl font-bold">{getInitials(displayName)}</span>
            </div>
            <button className="absolute bottom-0 right-0 p-2 bg-primary text-white rounded-full hover:bg-primary/90 transition">
              <Camera size={16} />
            </button>
          </div>
          <div className="text-center sm:text-left">
            <h2 className="text-xl font-bold text-gray-900">{displayName}</h2>
            {profile?.patientNumber && (
              <p className="text-primary font-medium">{profile.patientNumber}</p>
            )}
            <p className="text-gray-500">{user?.phoneNumber}</p>
          </div>
          <div className="sm:ml-auto">
            <button className="flex items-center gap-2 px-4 py-2 border border-gray-300 rounded-lg hover:bg-gray-50 transition">
              <Edit2 size={16} />
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Personal Information */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Personal Information</h3>
        <div className="grid md:grid-cols-2 gap-6">
          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <User className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Full Name</p>
              <p className="font-medium text-gray-900">{displayName}</p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Calendar className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Date of Birth</p>
              <p className="font-medium text-gray-900">
                {profile?.dateOfBirth ? formatDate(profile.dateOfBirth) : '-'}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Phone className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Phone Number</p>
              <p className="font-medium text-gray-900">
                {formatPhoneNumber(user?.phoneNumber || '')}
              </p>
            </div>
          </div>

          <div className="flex items-start gap-3">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <Mail className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Email Address</p>
              <p className="font-medium text-gray-900">{user?.email || '-'}</p>
            </div>
          </div>

          <div className="flex items-start gap-3 md:col-span-2">
            <div className="w-10 h-10 bg-gray-100 rounded-full flex items-center justify-center flex-shrink-0">
              <MapPin className="w-5 h-5 text-gray-500" />
            </div>
            <div>
              <p className="text-sm text-gray-500">Address</p>
              <p className="font-medium text-gray-900">
                {profile?.address
                  ? `${profile.address. street}, ${profile.address.suburb}, ${profile.address.city}, ${profile.address.province} ${profile.address.postalCode}`
                  : '-'}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Security Settings */}
      <div className="bg-white border rounded-xl p-6">
        <h3 className="font-semibold text-gray-900 mb-4">Security Settings</h3>
        <div className="space-y-4">
          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Change Password</p>
                <p className="text-sm text-gray-500">Update your account password</p>
              </div>
            </div>
            <button className="text-primary hover:text-primary/80 font-medium">Change</button>
          </div>

          <div className="flex items-center justify-between py-3 border-b">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Two-Factor Authentication</p>
                <p className="text-sm text-gray-500">
                  {user?.mfaEnabled ? 'Enabled' : 'Add an extra layer of security'}
                </p>
              </div>
            </div>
            <button className="text-primary hover:text-primary/80 font-medium">
              {user?.mfaEnabled ? 'Manage' : 'Enable'}
            </button>
          </div>

          <div className="flex items-center justify-between py-3">
            <div className="flex items-center gap-3">
              <Shield className="w-5 h-5 text-gray-500" />
              <div>
                <p className="font-medium text-gray-900">Active Sessions</p>
                <p className="text-sm text-gray-500">Manage your logged-in devices</p>
              </div>
            </div>
            <button className="text-primary hover: text-primary/80 font-medium">View</button>
          </div>
        </div>
      </div>
    </div>
  );
}
