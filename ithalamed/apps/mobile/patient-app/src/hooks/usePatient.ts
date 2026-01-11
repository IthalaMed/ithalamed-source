import { useCallback, useEffect } from 'react';
import {
  useAppDispatch,
  useAppSelector,
  fetchMyProfile,
  updateMyProfile,
  fetchAllergies,
  fetchEmergencyContacts,
  fetchMedicalAid,
  fetchChronicConditions,
  fetchAllPatientData,
  clearPatientData,
  Patient,
  AllergySeverity,
} from '@ithalamed/mobile-core';

export function usePatient() {
  const dispatch = useAppDispatch();
  const patient = useAppSelector((state) => state.patient);
  const { isAuthenticated } = useAppSelector((state) => state.auth);

  useEffect(() => {
    if (isAuthenticated && ! patient.profile) {
      dispatch(fetchMyProfile());
    }
  }, [isAuthenticated, patient.profile, dispatch]);

  useEffect(() => {
    if (patient.profile?. id) {
      dispatch(fetchAllPatientData(patient.profile.id));
    }
  }, [patient.profile?. id, dispatch]);

  const refreshProfile = useCallback(async () => {
    return dispatch(fetchMyProfile()).unwrap();
  }, [dispatch]);

  const updateProfile = useCallback(
    async (data: Partial<Patient>) => {
      return dispatch(updateMyProfile(data)).unwrap();
    },
    [dispatch],
  );

  const refreshAllergies = useCallback(async () => {
    if (patient.profile?.id) {
      return dispatch(fetchAllergies(patient.profile.id)).unwrap();
    }
  }, [dispatch, patient.profile?.id]);

  const refreshEmergencyContacts = useCallback(async () => {
    if (patient.profile?. id) {
      return dispatch(fetchEmergencyContacts(patient.profile.id)).unwrap();
    }
  }, [dispatch, patient.profile?.id]);

  const refreshMedicalAid = useCallback(async () => {
    if (patient.profile?. id) {
      return dispatch(fetchMedicalAid(patient.profile.id)).unwrap();
    }
  }, [dispatch, patient.profile?.id]);

  const refreshChronicConditions = useCallback(async () => {
    if (patient.profile?. id) {
      return dispatch(fetchChronicConditions(patient.profile.id)).unwrap();
    }
  }, [dispatch, patient.profile?.id]);

  const refreshAllData = useCallback(async () => {
    if (patient.profile?. id) {
      return dispatch(fetchAllPatientData(patient. profile.id));
    }
  }, [dispatch, patient.profile?.id]);

  const clearData = useCallback(() => {
    dispatch(clearPatientData());
  }, [dispatch]);

  return {
    profile: patient.profile,
    allergies: patient.allergies,
    emergencyContacts: patient. emergencyContacts,
    medicalAid: patient.medicalAid,
    chronicConditions: patient.chronicConditions,
    isLoading: patient.isLoading,
    error: patient.error,
    hasProfile: !!patient.profile,
    severeAllergies: patient.allergies.filter(
      (a) => a.severity === AllergySeverity. SEVERE || a.severity === AllergySeverity.LIFE_THREATENING,
    ),
    primaryMedicalAid: patient.medicalAid. find((m) => m.isPrimary),
    activeConditions: patient.chronicConditions. filter((c) => c.isActive),
    refreshProfile,
    updateProfile,
    refreshAllergies,
    refreshEmergencyContacts,
    refreshMedicalAid,
    refreshChronicConditions,
    refreshAllData,
    clearData,
  };
}
