'use client';

import { useState, useEffect, useCallback } from 'react';
import {
  patientService,
  Patient,
  PatientAllergy,
  EmergencyContact,
  MedicalAid,
  ChronicCondition,
  AllergySeverity,
} from '@ithalamed/web-core';

interface PatientState {
  profile: Patient | null;
  allergies: PatientAllergy[];
  emergencyContacts: EmergencyContact[];
  medicalAid: MedicalAid[];
  chronicConditions: ChronicCondition[];
  isLoading: boolean;
  error: string | null;
}

export function usePatient() {
  const [state, setState] = useState<PatientState>({
    profile: null,
    allergies: [],
    emergencyContacts: [],
    medicalAid: [],
    chronicConditions: [],
    isLoading:  true,
    error: null,
  });

  useEffect(() => {
    fetchProfile();
  }, []);

  useEffect(() => {
    if (state.profile?. id) {
      fetchAllData(state.profile.id);
    }
  }, [state.profile?.id]);

  const fetchProfile = async () => {
    setState((prev) => ({ ...prev, isLoading: true, error: null }));

    try {
      const profile = await patientService.getMyProfile();
      setState((prev) => ({ ...prev, profile, isLoading: false }));
    } catch (error:  any) {
      setState((prev) => ({
        ...prev,
        isLoading: false,
        error: error.response?.data?.message || error.message,
      }));
    }
  };

  const fetchAllData = async (patientId: string) => {
    try {
      const [allergies, emergencyContacts, medicalAid, chronicConditions] = await Promise.all([
        patientService.getAllergies(patientId),
        patientService.getEmergencyContacts(patientId),
        patientService.getMedicalAid(patientId),
        patientService.getChronicConditions(patientId),
      ]);

      setState((prev) => ({
        ...prev,
        allergies,
        emergencyContacts,
        medicalAid,
        chronicConditions,
      }));
    } catch (error: any) {
      console.error('Error fetching patient data:', error);
    }
  };

  const updateProfile = useCallback(async (data: Partial<Patient>) => {
    try {
      const profile = await patientService.updateMyProfile(data);
      setState((prev) => ({ ...prev, profile }));
      return profile;
    } catch (error: any) {
      throw error;
    }
  }, []);

  const refreshProfile = useCallback(async () => {
    await fetchProfile();
  }, []);

  const refreshAllData = useCallback(async () => {
    if (state.profile?.id) {
      await fetchAllData(state.profile.id);
    }
  }, [state.profile?. id]);

  return {
    ...state,
    hasProfile: !!state.profile,
    severeAllergies: state.allergies.filter(
      (a) =>
        a.severity === AllergySeverity.SEVERE || a.severity === AllergySeverity.LIFE_THREATENING,
    ),
    primaryMedicalAid: state.medicalAid.find((m) => m.isPrimary),
    activeConditions: state.chronicConditions. filter((c) => c.isActive),
    updateProfile,
    refreshProfile,
    refreshAllData,
  };
}
