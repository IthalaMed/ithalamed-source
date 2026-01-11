'use client';

import { Calendar, FileText, AlertCircle, Heart, CreditCard, Phone } from 'lucide-react';
import Link from 'next/link';

import { useAuth } from '@/hooks/useAuth';
import { usePatient } from '@/hooks/usePatient';
import { formatDate, AllergySeverity } from '@ithalamed/web-core';

export default function DashboardPage() {
  const { user } = useAuth();
  const {
    profile,
    severeAllergies,
    primaryMedicalAid,
    activeConditions,
    isLoading,
  } = usePatient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Welcome Header */}
      <div className="bg-gradient-to-r from-primary to-cyan-700 rounded-2xl p-6 text-white">
        <h1 className="text-2xl font-bold">
          Welcome back, {profile?.firstName || user?.firstName}!
        </h1>
        <p className="mt-1 text-white/80">Here's an overview of your health profile</p>
        {profile?.patientNumber && (
          <div className="mt-4 inline-block bg-white/10 rounded-lg px-4 py-2">
            <p className="text-sm text-white/80">Patient Number</p>
            <p className="font-semibold">{profile.patientNumber}</p>
          </div>
        )}
      </div>

      {/* Quick Actions */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        <Link
          href="/dashboard/appointments/book"
          className="bg-white rounded-xl p-4 border hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center mb-3">
            <Calendar className="w-5 h-5 text-primary" />
          </div>
          <h3 className="font-medium text-gray-900">Book Appointment</h3>
          <p className="text-sm text-gray-500">Schedule a visit</p>
        </Link>

        <Link
          href="/dashboard/records"
          className="bg-white rounded-xl p-4 border hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-indigo-100 rounded-full flex items-center justify-center mb-3">
            <FileText className="w-5 h-5 text-indigo-600" />
          </div>
          <h3 className="font-medium text-gray-900">My Documents</h3>
          <p className="text-sm text-gray-500">View records</p>
        </Link>

        <Link
          href="/dashboard/records/medications"
          className="bg-white rounded-xl p-4 border hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-green-100 rounded-full flex items-center justify-center mb-3">
            <Heart className="w-5 h-5 text-green-600" />
          </div>
          <h3 className="font-medium text-gray-900">Medications</h3>
          <p className="text-sm text-gray-500">Current meds</p>
        </Link>

        <Link
          href="/emergency"
          className="bg-white rounded-xl p-4 border hover:shadow-md transition"
        >
          <div className="w-10 h-10 bg-amber-100 rounded-full flex items-center justify-center mb-3">
            <Phone className="w-5 h-5 text-amber-600" />
          </div>
          <h3 className="font-medium text-gray-900">Emergency</h3>
          <p className="text-sm text-gray-500">Get help now</p>
        </Link>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Allergy Alert */}
        {severeAllergies.length > 0 && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <AlertCircle className="w-5 h-5 text-red-500" />
              <h3 className="font-semibold text-red-700">Allergy Alert</h3>
            </div>
            <div className="space-y-2">
              {severeAllergies.slice(0, 3).map((allergy) => (
                <div
                  key={allergy.id}
                  className="flex justify-between items-center py-2 border-t border-red-200"
                >
                  <span className="font-medium text-red-700">{allergy.allergen}</span>
                  <span className="text-sm text-red-600">
                    {allergy.severity === AllergySeverity. LIFE_THREATENING
                      ? 'Life Threatening'
                      : 'Severe'}
                  </span>
                </div>
              ))}
            </div>
            {severeAllergies.length > 3 && (
              <Link
                href="/dashboard/records/allergies"
                className="block text-center text-red-600 text-sm mt-3 hover:underline"
              >
                View all ({severeAllergies.length})
              </Link>
            )}
          </div>
        )}

        {/* Medical Aid */}
        {primaryMedicalAid && (
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2">
                <CreditCard className="w-5 h-5 text-primary" />
                <h3 className="font-semibold text-gray-900">Medical Aid</h3>
              </div>
              {primaryMedicalAid.isVerified && (
                <span className="text-xs bg-green-100 text-green-600 px-2 py-1 rounded-full">
                  Verified
                </span>
              )}
            </div>
            <div className="bg-gray-50 rounded-lg p-3">
              <p className="font-medium text-gray-900">{primaryMedicalAid. schemeName}</p>
              <p className="text-sm text-gray-600">{primaryMedicalAid.planName}</p>
              <p className="text-sm text-gray-500 mt-1">
                Member:  {primaryMedicalAid. membershipNumber}
              </p>
            </div>
          </div>
        )}

        {/* Health Conditions */}
        {activeConditions.length > 0 && (
          <div className="bg-white border rounded-xl p-4">
            <div className="flex items-center gap-2 mb-3">
              <Heart className="w-5 h-5 text-primary" />
              <h3 className="font-semibold text-gray-900">Health Conditions</h3>
            </div>
            <div className="space-y-2">
              {activeConditions.slice(0, 3).map((condition) => (
                <div
                  key={condition.id}
                  className="flex items-center gap-3 py-2 border-b border-gray-100 last:border-0"
                >
                  <div className="w-8 h-8 bg-primary/10 rounded-full flex items-center justify-center">
                    <Heart className="w-4 h-4 text-primary" />
                  </div>
                  <div>
                    <p className="font-medium text-gray-900">{condition.conditionName}</p>
                    <p className="text-sm text-gray-500 capitalize">{condition.status}</p>
                  </div>
                </div>
              ))}
            </div>
            {activeConditions.length > 3 && (
              <Link
                href="/dashboard/records/conditions"
                className="block text-center text-primary text-sm mt-3 hover:underline"
              >
                View all ({activeConditions.length})
              </Link>
            )}
          </div>
        )}
      </div>

      {/* Upcoming Appointments Placeholder */}
      <div className="bg-white border rounded-xl p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="font-semibold text-gray-900">Upcoming Appointments</h3>
          <Link href="/dashboard/appointments" className="text-sm text-primary hover:underline">
            View all
          </Link>
        </div>
        <div className="text-center py-8">
          <Calendar className="w-12 h-12 text-gray-300 mx-auto mb-3" />
          <p className="text-gray-500">No upcoming appointments</p>
          <Link
            href="/dashboard/appointments/book"
            className="inline-block mt-4 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
          >
            Book Appointment
          </Link>
        </div>
      </div>
    </div>
  );
}
