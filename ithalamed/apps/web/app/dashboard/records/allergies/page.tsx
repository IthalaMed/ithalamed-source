'use client';

import { useState } from 'react';
import { AlertCircle, Plus, Edit2, Trash2 } from 'lucide-react';

import { usePatient } from '@/hooks/usePatient';
import { AllergySeverity, AllergyType } from '@ithalamed/web-core';

const severityColors:  Record<AllergySeverity, string> = {
  [AllergySeverity.MILD]: 'bg-yellow-100 text-yellow-700',
  [AllergySeverity.MODERATE]: 'bg-orange-100 text-orange-700',
  [AllergySeverity.SEVERE]: 'bg-red-100 text-red-700',
  [AllergySeverity.LIFE_THREATENING]: 'bg-red-200 text-red-800',
};

const severityLabels: Record<AllergySeverity, string> = {
  [AllergySeverity.MILD]: 'Mild',
  [AllergySeverity.MODERATE]: 'Moderate',
  [AllergySeverity.SEVERE]: 'Severe',
  [AllergySeverity.LIFE_THREATENING]: 'Life Threatening',
};

export default function AllergiesPage() {
  const { allergies, isLoading } = usePatient();

  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-bold text-gray-900">Allergies</h1>
          <p className="text-gray-600">Manage your known allergies</p>
        </div>
        <button className="flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
          <Plus size={20} />
          Add Allergy
        </button>
      </div>

      {allergies.length === 0 ?  (
        <div className="bg-white border rounded-xl p-12 text-center">
          <AlertCircle className="w-16 h-16 text-gray-300 mx-auto mb-4" />
          <h3 className="text-lg font-medium text-gray-900 mb-2">No allergies recorded</h3>
          <p className="text-gray-500 mb-6">
            Add your allergies to keep your healthcare providers informed.
          </p>
          <button className="inline-flex items-center gap-2 px-6 py-3 bg-primary text-white rounded-lg hover:bg-primary/90 transition">
            <Plus size={20} />
            Add Your First Allergy
          </button>
        </div>
      ) : (
        <div className="bg-white border rounded-xl overflow-hidden">
          <table className="w-full">
            <thead className="bg-gray-50 border-b">
              <tr>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Allergen
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">Type</th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Severity
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Reaction
                </th>
                <th className="text-left px-6 py-3 text-sm font-medium text-gray-500">
                  Status
                </th>
                <th className="text-right px-6 py-3 text-sm font-medium text-gray-500">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-100">
              {allergies.map((allergy) => (
                <tr key={allergy.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4">
                    <span className="font-medium text-gray-900">{allergy.allergen}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600 capitalize">
                      {allergy.allergyType. replace('_', ' ')}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        severityColors[allergy.severity]
                      }`}
                    >
                      {severityLabels[allergy.severity]}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-gray-600">{allergy.reaction || '-'}</span>
                  </td>
                  <td className="px-6 py-4">
                    <span
                      className={`inline-block px-2 py-1 rounded-full text-xs font-medium ${
                        allergy. isActive
                          ? 'bg-green-100 text-green-700'
                          : 'bg-gray-100 text-gray-600'
                      }`}
                    >
                      {allergy.isActive ? 'Active' : 'Inactive'}
                    </span>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex items-center justify-end gap-2">
                      <button className="p-2 text-gray-400 hover:text-primary transition">
                        <Edit2 size={16} />
                      </button>
                      <button className="p-2 text-gray-400 hover:text-red-500 transition">
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
