import { createSlice, createAsyncThunk, PayloadAction } from '@reduxjs/toolkit';

// Import from shared-types
import {
  Patient,
  PatientAllergy,
  EmergencyContact,
  MedicalAid,
  ChronicCondition,
} from '@ithalamed/shared-types';

import { getPatientService } from '../../services/api/patient.service';

interface PatientState {
  profile: Patient | null;
  allergies: PatientAllergy[];
  emergencyContacts: EmergencyContact[];
  medicalAid: MedicalAid[];
  chronicConditions: ChronicCondition[];
  isLoading: boolean;
  error: string | null;
}

const initialState: PatientState = {
  profile: null,
  allergies: [],
  emergencyContacts: [],
  medicalAid: [],
  chronicConditions: [],
  isLoading: false,
  error:  null,
};

export const fetchMyProfile = createAsyncThunk(
  'patient/fetchMyProfile',
  async (_, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.getMyProfile();
    } catch (error:  any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch profile');
    }
  },
);

export const updateMyProfile = createAsyncThunk(
  'patient/updateMyProfile',
  async (data:  Partial<Patient>, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.updateMyProfile(data);
    } catch (error: any) {
      return rejectWithValue(error.response?. data?.message || error.message || 'Failed to update profile');
    }
  },
);

export const fetchAllergies = createAsyncThunk(
  'patient/fetchAllergies',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.getAllergies(patientId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch allergies');
    }
  },
);

export const fetchEmergencyContacts = createAsyncThunk(
  'patient/fetchEmergencyContacts',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.getEmergencyContacts(patientId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch emergency contacts',
      );
    }
  },
);

export const fetchMedicalAid = createAsyncThunk(
  'patient/fetchMedicalAid',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.getMedicalAid(patientId);
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.message || error.message || 'Failed to fetch medical aid');
    }
  },
);

export const fetchChronicConditions = createAsyncThunk(
  'patient/fetchChronicConditions',
  async (patientId: string, { rejectWithValue }) => {
    try {
      const patientService = getPatientService();
      return await patientService.getChronicConditions(patientId);
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || error.message || 'Failed to fetch chronic conditions',
      );
    }
  },
);

export const fetchAllPatientData = createAsyncThunk(
  'patient/fetchAllData',
  async (patientId: string, { dispatch }) => {
    await Promise.all([
      dispatch(fetchAllergies(patientId)),
      dispatch(fetchEmergencyContacts(patientId)),
      dispatch(fetchMedicalAid(patientId)),
      dispatch(fetchChronicConditions(patientId)),
    ]);
  },
);

const patientSlice = createSlice({
  name: 'patient',
  initialState,
  reducers: {
    clearPatientData: (state) => {
      state.profile = null;
      state.allergies = [];
      state.emergencyContacts = [];
      state.medicalAid = [];
      state.chronicConditions = [];
      state.error = null;
    },
    clearError: (state) => {
      state.error = null;
    },
    setProfile: (state, action:  PayloadAction<Patient>) => {
      state.profile = action.payload;
    },
    addAllergy: (state, action: PayloadAction<PatientAllergy>) => {
      state.allergies. push(action.payload);
    },
    updateAllergy: (state, action:  PayloadAction<PatientAllergy>) => {
      const index = state.allergies.findIndex((a) => a.id === action. payload.id);
      if (index !== -1) {
        state.allergies[index] = action.payload;
      }
    },
    removeAllergy: (state, action:  PayloadAction<string>) => {
      state.allergies = state.allergies.filter((a) => a.id !== action.payload);
    },
    addEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      state.emergencyContacts.push(action.payload);
    },
    updateEmergencyContact: (state, action: PayloadAction<EmergencyContact>) => {
      const index = state.emergencyContacts.findIndex((c) => c.id === action. payload.id);
      if (index !== -1) {
        state.emergencyContacts[index] = action.payload;
      }
    },
    removeEmergencyContact: (state, action: PayloadAction<string>) => {
      state.emergencyContacts = state.emergencyContacts.filter((c) => c.id !== action.payload);
    },
  },
  extraReducers: (builder) => {
    builder
      .addCase(fetchMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchMyProfile.fulfilled, (state, action) => {
        state. isLoading = false;
        state.profile = action.payload;
      })
      .addCase(fetchMyProfile.rejected, (state, action) => {
        state. isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(updateMyProfile.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateMyProfile.fulfilled, (state, action) => {
        state.isLoading = false;
        state.profile = action.payload;
      })
      .addCase(updateMyProfile.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      .addCase(fetchAllergies.fulfilled, (state, action) => {
        state.allergies = action.payload;
      })
      .addCase(fetchEmergencyContacts.fulfilled, (state, action) => {
        state. emergencyContacts = action.payload;
      })
      .addCase(fetchMedicalAid.fulfilled, (state, action) => {
        state.medicalAid = action.payload;
      })
      .addCase(fetchChronicConditions.fulfilled, (state, action) => {
        state.chronicConditions = action.payload;
      });
  },
});

export const {
  clearPatientData,
  clearError,
  setProfile,
  addAllergy,
  updateAllergy,
  removeAllergy,
  addEmergencyContact,
  updateEmergencyContact,
  removeEmergencyContact,
} = patientSlice.actions;

export default patientSlice.reducer;
