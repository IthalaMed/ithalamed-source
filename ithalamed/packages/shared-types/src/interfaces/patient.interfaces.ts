import {
  Gender,
  BloodType,
  PatientStatus,
  IdType,
  Relationship,
  AllergyType,
  AllergySeverity,
  MedicalAidScheme,
  DependentCode,
  ChronicConditionStatus,
  ChronicConditionSeverity,
  ConsentType,
  DocumentType,
  DocumentCategory,
} from '../enums';
import { Address } from './common. interfaces';

/**
 * Patient Interface
 */
export interface Patient {
  id: string;
  patientNumber: string;
  userId?:  string;
  firstName: string;
  middleName?: string;
  lastName: string;
  fullName: string;
  idNumber?:  string;
  idType?: IdType;
  dateOfBirth:  string;
  age: number;
  gender: Gender;
  bloodType?:  BloodType;
  phoneNumber: string;
  email?:  string;
  address:  Address;
  preferredLanguage: string;
  ethnicity?:  string;
  religion?: string;
  maritalStatus?: string;
  occupation?: string;
  employer?: string;
  profilePhotoUrl?: string;
  status: PatientStatus;
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient Summary (for lists)
 */
export interface PatientSummary {
  id: string;
  patientNumber: string;
  fullName: string;
  dateOfBirth: string;
  age: number;
  gender:  Gender;
  phoneNumber: string;
  profilePhotoUrl?: string;
  status: PatientStatus;
}

/**
 * Patient Allergy Interface
 */
export interface PatientAllergy {
  id: string;
  patientId: string;
  allergen: string;
  allergyType: AllergyType;
  severity: AllergySeverity;
  reaction?:  string;
  onsetDate?:  string;
  notes?: string;
  isActive: boolean;
  recordedBy?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Emergency Contact Interface
 */
export interface EmergencyContact {
  id: string;
  patientId: string;
  firstName: string;
  lastName: string;
  fullName: string;
  relationship: Relationship;
  phoneNumber: string;
  alternativePhone?: string;
  email?: string;
  priority: number;
  isActive:  boolean;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Medical Aid Interface
 */
export interface MedicalAid {
  id: string;
  patientId: string;
  scheme: MedicalAidScheme;
  schemeName: string;
  membershipNumber: string;
  dependentCode: DependentCode;
  planName: string;
  planType?:  string;
  effectiveDate?:  string;
  expiryDate?: string;
  isPrimary: boolean;
  isActive: boolean;
  isVerified: boolean;
  verifiedAt?: string;
  mainMemberName?:  string;
  contactNumber?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Chronic Condition Interface
 */
export interface ChronicCondition {
  id: string;
  patientId: string;
  conditionName: string;
  icd10Code?: string;
  status: ChronicConditionStatus;
  severity?:  ChronicConditionSeverity;
  diagnosisDate?: string;
  notes?: string;
  currentTreatment?: string;
  diagnosedBy?: string;
  resolutionDate?: string;
  isActive: boolean;
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient Consent Interface
 */
export interface PatientConsent {
  id:  string;
  patientId:  string;
  consentType:  ConsentType;
  granted: boolean;
  version?:  string;
  grantedAt:  string;
  revokedAt?: string;
  ipAddress?: string;
  notes?: string;
  createdAt: string;
  updatedAt: string;
}

/**
 * Patient Document Interface
 */
export interface PatientDocument {
  id:  string;
  patientId:  string;
  title: string;
  documentType:  DocumentType;
  category: DocumentCategory;
  description?: string;
  fileUrl:  string;
  mimeType: string;
  fileSize: number;
  originalFileName?:  string;
  documentDate?:  string;
  uploadedBy?: string;
  encounterId?: string;
  isArchived: boolean;
  createdAt: string;
  updatedAt: string;
}
