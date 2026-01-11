'use client';

import { useState } from 'react';
import Link from 'next/link';
import { Calendar, Clock, MapPin, User, Plus, ChevronRight } from 'lucide-react';

export default function AppointmentsPage() {
  const [activeTab, setActiveTab] = useState<'upcoming' | 'past'>('upcoming');

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Appointments</h1>
          <p className="text-gray-600">Manage your appointments</p>
        </div>
        <Link
          href="/dashboard/appointments/book"
          className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition"
        >
          <Plus size={20} />
          Book Appointment
        </Link>
      </div>

      {/* Tabs */}
      <div className="flex gap-2 border-b">
        <button
          onClick={() => setActiveTab('upcoming')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'upcoming'
              ?  'text-primary border-b-2 border-primary'
              : 'text-gray-500 hover:text-gray-700'
          }`}
        >
          Upcoming
        </button>
        <button
          onClick={() => setActiveTab('past')}
          className={`px-4 py-2 font-medium transition ${
            activeTab === 'past'
              ? 'text-primary border-b-2 border-primary'
              :  'text-gray-500 hover:text-gray-700'
          }`}
        >
          Past
        </button>
      </div>

      {/* Empty State */}
      <div className="bg-white border rounded-xl p-12 text-center">
        <Calendar className="w-16 h-16 text-gray-300 mx-auto mb-4" />
        <h3 className="text-lg font-medium text-gray-900 mb-2">
          No {activeTab} appointments
        </h3>
        <p className="text-gray-500 mb-6">
          {activeTab === 'upcoming'
            ? "You don't have any upcoming appointments scheduled."
            : "You don't have any past appointments. "}
        </p>
        {activeTab === 'upcoming' && (
          <Link
            href="/dashboard/appointments/book"
            className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover: bg-primary/90 transition"
          >
            <Plus size={20} />
            Book Your First Appointment
          </Link>
        )}
      </div>
    </div>
  );
}
