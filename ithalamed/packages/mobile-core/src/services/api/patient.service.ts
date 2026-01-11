import { getApiClient } from './client';
import { ENDPOINTS } from '../../config/api. config';

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

export class PatientService {
  async getMyProfile(): Promise<Patient> {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ data: Patient } | Patient>(ENDPOINTS.patients.me);
    return 'data' in response ? response. data : response;
  }

  async updateMyProfile(data:  Partial<Patient>): Promise<Patient> {
    const apiClient = getApiClient();
    const response = await apiClient.patch<{ data: Patient } | Patient>(ENDPOINTS.patients.me, data);
    return 'data' in response ? response.data : response;
  }

  async getPatientById(id: string): Promise<Patient> {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ data: Patient } | Patient>(ENDPOINTS. patients.byId(id));
    return 'data' in response ? response. data : response;
  }

  async getPatientByNumber(patientNumber: string): Promise<Patient> {
    const apiClient = getApiClient();
    const response = await apiClient.get<{ data: Patient } | Patient>(
      ENDPOINTS.patients.byNumber(patientNumber),
    );
    return 'data' in response ? response.data : response;
  }

  async getAllergies(patientId: string, activeOnly = false): Promise<PatientAllergy[]> {
    const apiClient = getApiClient();
    return apiClient.get<PatientAllergy[]>(ENDPOINTS.patients.allergies(patientId), { activeOnly });
  }

  async createAllergy(
    patientId: string,
    data: Omit<PatientAllergy, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>,
  ): Promise<PatientAllergy> {
    const apiClient = getApiClient();
    return apiClient.post<PatientAllergy>(ENDPOINTS.patients.allergies(patientId), data);
  }

  async updateAllergy(
    patientId: string,
    allergyId: string,
    data: Partial<PatientAllergy>,
  ): Promise<PatientAllergy> {
    const apiClient = getApiClient();
    return apiClient.patch<PatientAllergy>(ENDPOINTS.patients.allergyById(patientId, allergyId), data);
  }

  async deleteAllergy(patientId:  string, allergyId: string): Promise<void> {
    const apiClient = getApiClient();
    await apiClient.delete(ENDPOINTS.patients.allergyById(patientId, allergyId));
  }

  async getEmergencyContacts(patientId: string, activeOnly = false): Promise<EmergencyContact[]> {
    const apiClient = getApiClient();
    return apiClient.get<EmergencyContact[]>(ENDPOINTS.patients.emergencyContacts(patientId), { activeOnly });
  }

  async createEmergencyContact(
    patientId: string,
    data:  Omit<EmergencyContact, 'id' | 'patientId' | 'fullName' | 'createdAt' | 'updatedAt'>,
  ): Promise<EmergencyContact> {
    const apiClient = getApiClient();
    return apiClient.post<EmergencyContact>(ENDPOINTS.patients.emergencyContacts(patientId), data);
  }

  async updateEmergencyContact(
    patientId: string,
    contactId: string,
    data:  Partial<EmergencyContact>,
  ): Promise<EmergencyContact> {
    const apiClient = getApiClient();
    return apiClient.patch<EmergencyContact>(
      ENDPOINTS. patients.emergencyContactById(patientId, contactId),
      data,
    );
  }

  async deleteEmergencyContact(patientId: string, contactId: string): Promise<void> {
    const apiClient = getApiClient();
    await apiClient.delete(ENDPOINTS.patients. emergencyContactById(patientId, contactId));
  }

  async getMedicalAid(patientId: string, activeOnly = false): Promise<MedicalAid[]> {
    const apiClient = getApiClient();
    return apiClient.get<MedicalAid[]>(ENDPOINTS.patients.medicalAid(patientId), { activeOnly });
  }

  async getPrimaryMedicalAid(patientId: string): Promise<MedicalAid | null> {
    const apiClient = getApiClient();
    try {
      return await apiClient.get<MedicalAid>(`${ENDPOINTS.patients.medicalAid(patientId)}/primary`);
    } catch {
      return null;
    }
  }

  async createMedicalAid(
    patientId: string,
    data: Omit<MedicalAid, 'id' | 'patientId' | 'schemeName' | 'isVerified' | 'verifiedAt' | 'createdAt' | 'updatedAt'>,
  ): Promise<MedicalAid> {
    const apiClient = getApiClient();
    return apiClient.post<MedicalAid>(ENDPOINTS.patients.medicalAid(patientId), data);
  }

  async updateMedicalAid(
    patientId: string,
    medicalAidId: string,
    data: Partial<MedicalAid>,
  ): Promise<MedicalAid> {
    const apiClient = getApiClient();
    return apiClient.patch<MedicalAid>(ENDPOINTS.patients.medicalAidById(patientId, medicalAidId), data);
  }

  async deleteMedicalAid(patientId: string, medicalAidId: string): Promise<void> {
    const apiClient = getApiClient();
    await apiClient.delete(ENDPOINTS.patients.medicalAidById(patientId, medicalAidId));
  }

  async getChronicConditions(patientId: string, activeOnly = false): Promise<ChronicCondition[]> {
    const apiClient = getApiClient();
    return apiClient.get<ChronicCondition[]>(ENDPOINTS.patients.chronicConditions(patientId), { activeOnly });
  }

  async createChronicCondition(
    patientId: string,
    data: Omit<ChronicCondition, 'id' | 'patientId' | 'createdAt' | 'updatedAt'>,
  ): Promise<ChronicCondition> {
    const apiClient = getApiClient();
    return apiClient.post<ChronicCondition>(ENDPOINTS.patients. chronicConditions(patientId), data);
  }

  async updateChronicCondition(
    patientId: string,
    conditionId: string,
    data: Partial<ChronicCondition>,
  ): Promise<ChronicCondition> {
    const apiClient = getApiClient();
    return apiClient.patch<ChronicCondition>(
      ENDPOINTS.patients. chronicConditionById(patientId, conditionId),
      data,
    );
  }

  async deleteChronicCondition(patientId: string, conditionId: string): Promise<void> {
    const apiClient = getApiClient();
    await apiClient.delete(ENDPOINTS.patients.chronicConditionById(patientId, conditionId));
  }

  async getConsents(patientId:  string): Promise<PatientConsent[]> {
    const apiClient = getApiClient();
    return apiClient.get<PatientConsent[]>(ENDPOINTS.patients. consents(patientId));
  }

  async grantConsent(patientId: string, consentType: ConsentType, version?:  string): Promise<PatientConsent> {
    const apiClient = getApiClient();
    return apiClient.post<PatientConsent>(ENDPOINTS.patients.consents(patientId), {
      consentType,
      granted:  true,
      version,
    });
  }

  async revokeConsent(patientId: string, consentType: ConsentType): Promise<PatientConsent | null> {
    const apiClient = getApiClient();
    return apiClient.post<PatientConsent | null>(
      `${ENDPOINTS.patients.consents(patientId)}/revoke/${consentType}`,
    );
  }

  async getDocuments(
    patientId: string,
    params?:  {
      documentType?: DocumentType;
      category?: DocumentCategory;
      searchTerm?: string;
      page?: number;
      limit?: number;
    },
  ): Promise<PaginatedResponse<PatientDocument>> {
    const apiClient = getApiClient();
    return apiClient.get<PaginatedResponse<PatientDocument>>(
      ENDPOINTS. patients.documents(patientId),
      params,
    );
  }

  async getDocumentById(patientId: string, documentId: string): Promise<PatientDocument> {
    const apiClient = getApiClient();
    return apiClient.get<PatientDocument>(ENDPOINTS.patients. documentById(patientId, documentId));
  }

  async uploadDocument(
    patientId:  string,
    data: {
      title: string;
      documentType: DocumentType;
      category: DocumentCategory;
      description?:  string;
      fileUrl: string;
      mimeType: string;
      fileSize: number;
      originalFileName?: string;
      documentDate?: string;
    },
  ): Promise<PatientDocument> {
    const apiClient = getApiClient();
    return apiClient.post<PatientDocument>(ENDPOINTS.patients.documents(patientId), data);
  }

  async deleteDocument(patientId: string, documentId: string): Promise<void> {
    const apiClient = getApiClient();
    await apiClient.delete(ENDPOINTS.patients.documentById(patientId, documentId));
  }
}

let patientServiceInstance:  PatientService | null = null;

export function getPatientService(): PatientService {
  if (!patientServiceInstance) {
    patientServiceInstance = new PatientService();
  }
  return patientServiceInstance;
}
