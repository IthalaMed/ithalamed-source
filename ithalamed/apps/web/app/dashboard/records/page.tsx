'use client';

import Link from 'next/link';
import {
  FileText,
  AlertCircle,
  Heart,
  Pill,
  Users,
  CreditCard,
  ChevronRight,
} from 'lucide-react';

import { usePatient } from '@/hooks/usePatient';

export default function RecordsPage() {
  const { allergies, chronicConditions, emergencyContacts, medicalAid } = usePatient();

  const recordCategories = [
    {
      name: 'Documents',
      description: 'Lab results, prescriptions, and more',
      href: '/dashboard/records/documents',
      icon: FileText,
      color: 'bg-primary/10 text-primary',
      count: null,
    },
    {
      name: 'Allergies',
      description: 'Your known allergies',
      href: '/dashboard/records/allergies',
      icon:  AlertCircle,
      color:  'bg-red-100 text-red-600',
      count: allergies. length,
    },
    {
      name: 'Chronic Conditions',
      description: 'Ongoing health conditions',
      href: '/dashboard/records/conditions',
      icon: Heart,
      color: 'bg-purple-100 text-purple-600',
      count: chronicConditions.length,
    },
    {
      name: 'Medications',
      description: 'Current medications',
      href: '/dashboard/records/medications',
      icon: Pill,
      color: 'bg-green-100 text-green-600',
      count: null,
    },
    {
      name: 'Emergency Contacts',
      description: 'People to contact in emergencies',
      href: '/dashboard/records/emergency-contacts',
      icon: Users,
      color: 'bg-amber-100 text-amber-600',
      count: emergencyContacts.length,
    },
    {
      name: 'Medical Aid',
      description: 'Your medical aid information',
      href: '/dashboard/records/medical-aid',
      icon: CreditCard,
      color: 'bg-blue-100 text-blue-600',
      count: medicalAid.length,
    },
  ];

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-2xl font-bold text-gray-900">Health Records</h1>
        <p className="text-gray-600">View and manage your medical history</p>
      </div>

      <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4">
        {recordCategories. map((category) => (
          <Link
            key={category. name}
            href={category. href}
            className="bg-white border rounded-xl p-4 hover:shadow-md transition group"
          >
            <div className="flex items-start justify-between">
              <div
                className={`w-12 h-12 rounded-full flex items-center justify-center ${category.color}`}
              >
                <category.icon className="w-6 h-6" />
              </div>
              {category.count !== null && category.count > 0 && (
                <span className="text-sm font-medium text-gray-500 bg-gray-100 px-2 py-1 rounded-full">
                  {category. count}
                </span>
              )}
            </div>
            <h3 className="font-semibold text-gray-900 mt-4 group-hover:text-primary transition">
              {category.name}
            </h3>
            <p className="text-sm text-gray-500 mt-1">{category.description}</p>
            <div className="flex items-center text-primary text-sm font-medium mt-3">
              View details
              <ChevronRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition" />
            </div>
          </Link>
        ))}
      </div>
    </div>
  );
}
