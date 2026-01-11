/**
 * Allergy Type Enum
 */
export enum AllergyType {
  DRUG = 'drug',
  FOOD = 'food',
  ENVIRONMENTAL = 'environmental',
  INSECT = 'insect',
  LATEX = 'latex',
  OTHER = 'other',
}

/**
 * Allergy Severity Enum
 */
export enum AllergySeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
  LIFE_THREATENING = 'life_threatening',
}

/**
 * Chronic Condition Status Enum
 */
export enum ChronicConditionStatus {
  ACTIVE = 'active',
  CONTROLLED = 'controlled',
  IN_REMISSION = 'in_remission',
  RESOLVED = 'resolved',
}

/**
 * Chronic Condition Severity Enum
 */
export enum ChronicConditionSeverity {
  MILD = 'mild',
  MODERATE = 'moderate',
  SEVERE = 'severe',
}

/**
 * Medical Aid Scheme Enum (South African medical aids)
 */
export enum MedicalAidScheme {
  DISCOVERY = 'discovery',
  MOMENTUM = 'momentum',
  BONITAS = 'bonitas',
  MEDSHIELD = 'medshield',
  GEMS = 'gems',
  FEDHEALTH = 'fedhealth',
  BESTMED = 'bestmed',
  PROFMED = 'profmed',
  MEDIHELP = 'medihelp',
  POLMED = 'polmed',
  BANKMED = 'bankmed',
  SIZWE = 'sizwe',
  SAMWUMED = 'samwumed',
  HOSMED = 'hosmed',
  KEYHEALTH = 'keyhealth',
  LIBERTY = 'liberty',
  OTHER = 'other',
}

/**
 * Dependent Code Enum
 */
export enum DependentCode {
  MAIN_MEMBER = '00',
  SPOUSE = '01',
  CHILD_1 = '02',
  CHILD_2 = '03',
  CHILD_3 = '04',
  CHILD_4 = '05',
  CHILD_5 = '06',
  ADULT_DEPENDENT = '10',
}

/**
 * Consent Type Enum (POPIA/GDPR compliance)
 */
export enum ConsentType {
  TERMS_OF_SERVICE = 'terms_of_service',
  PRIVACY_POLICY = 'privacy_policy',
  DATA_PROCESSING = 'data_processing',
  MARKETING = 'marketing',
  DATA_SHARING = 'data_sharing',
  RESEARCH = 'research',
  TELEMEDICINE = 'telemedicine',
  TREATMENT = 'treatment',
  EMERGENCY_ACCESS = 'emergency_access',
}

/**
 * Document Type Enum
 */
export enum DocumentType {
  LAB_RESULT = 'lab_result',
  IMAGING = 'imaging',
  PRESCRIPTION = 'prescription',
  REFERRAL = 'referral',
  DISCHARGE_SUMMARY = 'discharge_summary',
  MEDICAL_CERTIFICATE = 'medical_certificate',
  CONSENT_FORM = 'consent_form',
  INSURANCE_CLAIM = 'insurance_claim',
  ID_DOCUMENT = 'id_document',
  MEDICAL_AID_CARD = 'medical_aid_card',
  VACCINATION_RECORD = 'vaccination_record',
  OTHER = 'other',
}

/**
 * Document Category Enum
 */
export enum DocumentCategory {
  MEDICAL = 'medical',
  ADMINISTRATIVE = 'administrative',
  FINANCIAL = 'financial',
  LEGAL = 'legal',
  PERSONAL = 'personal',
}
