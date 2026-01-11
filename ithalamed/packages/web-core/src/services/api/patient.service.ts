import { api } from './client';
import { ENDPOINTS } from '../../config/api.config';

// Import types from shared-types
import {
  Patient,
  PatientAllergy,
  EmergencyContact,
  MedicalAid,
  ChronicCondition,
  PatientConsent,
  PatientDocument,
  PaginatedResponse,
  ConsentType,
  DocumentType,
  DocumentCategory,
} from '@ithalamed/shared-types';

export const patientService = {
  // Profile
  async getMyProfile(): Promise<Patient> {
    const response = await api.get<{ data: Patient } | Patient>(ENDPOINTS.patients. me);
    return 'data' in response ? response.data :  response;
  },

  async updateMyProfile(data: Partial<Patient>): Promise<Patient> {
    const response = await api.patch<{ data: Patient } | Patient>(ENDPOINTS.patients.me, data);
    return 'data' in response ? response.data : response;
  },

  async getPatientById(id: string): Promise<Patient> {
    const response = await api.get<{ data: Patient } | Patient>(ENDPOINTS.patients.byId(id));
    return 'data' in response ? response.data : response;
  },

  async searchPatients(params: {
    query?: string;
    page?: number;
    limit?: number;
  }): Promise<PaginatedResponse<Patient>> {
    return api.get<PaginatedResponse<Patient>>(ENDPOINTS.patients.search, params);
  },

  // Allergies
  async getAllergies(patientId: string, activeOnly = false): Promise<PatientAllergy[]> {
    return api.get<PatientAllergy[]>(ENDPOINTS.patients.allergies(patientId), { activeOnly });
  },

  async createAllergy(patientId: string, data:  Partial<PatientAllergy>): Promise<PatientAllergy> {
    return api.post<PatientAllergy>(ENDPOINTS.patients.allergies(patientId), data);
  },

  async updateAllergy(
    patientId: string,
    allergyId: string,
    data: Partial<PatientAllergy>,
  ): Promise<PatientAllergy> {
    return api.patch<PatientAllergy>(ENDPOINTS.patients.allergyById(patientId, allergyId), data);
  },

  async deleteAllergy(patientId: string, allergyId: string): Promise<void> {
    await api.delete(ENDPOINTS.patients.allergyById(patientId, allergyId));
  },

  // Emergency Contacts
  async getEmergencyContacts(patientId: string, activeOnly = false): Promise<EmergencyContact[]> {
    return api.get<EmergencyContact[]>(ENDPOINTS.patients. emergencyContacts(patientId), {
      activeOnly,
    });
  },

  async createEmergencyContact(
    patientId: string,
    data:  Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    return api.post<EmergencyContact>(ENDPOINTS.patients.emergencyContacts(patientId), data);
  },

  async updateEmergencyContact(
    patientId: string,
    contactId: string,
    data:  Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    return api.patch<EmergencyContact>(
      ENDPOINTS.patients.emergencyContactById(patientId, contactId),
      data,
    );
  },

  async deleteEmergencyContact(patientId: string, contactId:  string): Promise<void> {
    await api.delete(ENDPOINTS.patients.emergencyContactById(patientId, contactId));
  },

  // Medical Aid
  async getMedicalAid(patientId: string, activeOnly = false): Promise<MedicalAid[]> {
    return api.get<MedicalAid[]>(ENDPOINTS.patients.medicalAid(patientId), { activeOnly });
  },

  async createMedicalAid(patientId: string, data:  Partial<MedicalAid>): Promise<MedicalAid> {
    return api.post<MedicalAid>(ENDPOINTS.patients.medicalAid(patientId), data);
  },

  async updateMedicalAid(
    patientId: string,
    medicalAidId: string,
    data: Partial<MedicalAid>,
  ): Promise<MedicalAid> {
    return api.patch<MedicalAid>(
      ENDPOINTS.patients.medicalAidById(patientId, medicalAidId),
      data,
    );
  },

  async deleteMedicalAid(patientId: string, medicalAidId: string): Promise<void> {
    await api.delete(ENDPOINTS.patients. medicalAidById(patientId, medicalAidId));
  },

  // Chronic Conditions
  async getChronicConditions(patientId:  string, activeOnly = false): Promise<ChronicCondition[]> {
    return api.get<ChronicCondition[]>(ENDPOINTS.patients.chronicConditions(patientId), {
      activeOnly,
    });
  },

  async createChronicCondition(
    patientId:  string,
    data: Partial<ChronicCondition>,
  ): Promise<ChronicCondition> {
    return api.post<ChronicCondition>(ENDPOINTS.patients.chronicConditions(patientId), data);
  },

  async updateChronicCondition(
    patientId: string,
    conditionId: string,
    data: Partial<ChronicCondition>,
  ): Promise<ChronicCondition> {
    return api.patch<ChronicCondition>(
      ENDPOINTS.patients.chronicConditionById(patientId, conditionId),
      data,
    );
  },

  async deleteChronicCondition(patientId:  string, conditionId: string): Promise<void> {
    await api.delete(ENDPOINTS.patients.chronicConditionById(patientId, conditionId));
  },

  // Consents
  async getConsents(patientId: string): Promise<PatientConsent[]> {
    return api.get<PatientConsent[]>(ENDPOINTS.patients.consents(patientId));
  },

  async grantConsent(
    patientId: string,
    consentType: ConsentType,
    version?:  string,
  ): Promise<PatientConsent> {
    return api.post<PatientConsent>(ENDPOINTS.patients.consents(patientId), {
      consentType,
      granted: true,
      version,
    });
  },

  async revokeConsent(patientId: string, consentType: ConsentType): Promise<PatientConsent | null> {
    return api. post<PatientConsent | null>(
      `${ENDPOINTS.patients.consents(patientId)}/revoke/${consentType}`,
    );
  },

  // Documents
  async getDocuments(
    patientId: string,
    params?: {
      documentType?: DocumentType;
      category?: DocumentCategory;
      searchTerm?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedResponse<PatientDocument>> {
    return api.get<PaginatedResponse<PatientDocument>>(
      ENDPOINTS.patients.documents(patientId),
      params,
    );
  },

  async uploadDocument(
    patientId:  string,
    data: {
      title: string;
      documentType: DocumentType;
      category: DocumentCategory;
      description?:  string;
      fileUrl:  string;
      mimeType: string;
      fileSize: number;
      originalFileName?:  string;
      documentDate?: string;
    },
  ): Promise<PatientDocument> {
    return api.post<PatientDocument>(ENDPOINTS.patients.documents(patientId), data);
  },

  async deleteDocument(patientId: string, documentId:  string): Promise<void> {
    await api.delete(ENDPOINTS.patients.documentById(patientId, documentId));
  },
};
