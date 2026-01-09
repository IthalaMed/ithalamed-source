/**
 * Medical Specialties
 * 
 * Covers 40+ specialties as per ithalamed_overview2.txt requirements. 
 * Used for provider categorization and specialty-specific consultation workflows.
 */
export enum MedicalSpecialty {
  // Primary Care
  GENERAL_PRACTICE = 'general_practice',
  FAMILY_MEDICINE = 'family_medicine',
  INTERNAL_MEDICINE = 'internal_medicine',
  
  // Surgical Specialties
  GENERAL_SURGERY = 'general_surgery',
  CARDIOTHORACIC_SURGERY = 'cardiothoracic_surgery',
  NEUROSURGERY = 'neurosurgery',
  ORTHOPEDIC_SURGERY = 'orthopedic_surgery',
  PLASTIC_SURGERY = 'plastic_surgery',
  VASCULAR_SURGERY = 'vascular_surgery',
  PEDIATRIC_SURGERY = 'pediatric_surgery',
  UROLOGICAL_SURGERY = 'urological_surgery',
  
  // Medical Specialties
  CARDIOLOGY = 'cardiology',
  PULMONOLOGY = 'pulmonology',
  GASTROENTEROLOGY = 'gastroenterology',
  NEPHROLOGY = 'nephrology',
  NEUROLOGY = 'neurology',
  ENDOCRINOLOGY = 'endocrinology',
  RHEUMATOLOGY = 'rheumatology',
  INFECTIOUS_DISEASE = 'infectious_disease',
  HEMATOLOGY = 'hematology',
  ONCOLOGY = 'oncology',
  MEDICAL_ONCOLOGY = 'medical_oncology',
  RADIATION_ONCOLOGY = 'radiation_oncology',
  
  // Women's Health
  OBSTETRICS = 'obstetrics',
  GYNECOLOGY = 'gynecology',
  OBSTETRICS_GYNECOLOGY = 'obstetrics_gynecology',
  REPRODUCTIVE_MEDICINE = 'reproductive_medicine',
  
  // Pediatrics
  PEDIATRICS = 'pediatrics',
  NEONATOLOGY = 'neonatology',
  PEDIATRIC_CARDIOLOGY = 'pediatric_cardiology',
  PEDIATRIC_NEUROLOGY = 'pediatric_neurology',
  
  // Mental Health
  PSYCHIATRY = 'psychiatry',
  CHILD_PSYCHIATRY = 'child_psychiatry',
  PSYCHOLOGY = 'psychology',
  
  // Diagnostic Specialties
  RADIOLOGY = 'radiology',
  PATHOLOGY = 'pathology',
  NUCLEAR_MEDICINE = 'nuclear_medicine',
  
  // Other Specialties
  ANESTHESIOLOGY = 'anesthesiology',
  EMERGENCY_MEDICINE = 'emergency_medicine',
  CRITICAL_CARE = 'critical_care',
  DERMATOLOGY = 'dermatology',
  OPHTHALMOLOGY = 'ophthalmology',
  ENT = 'ent', // Ear, Nose, Throat (Otolaryngology)
  ALLERGY_IMMUNOLOGY = 'allergy_immunology',
  GERIATRICS = 'geriatrics',
  PALLIATIVE_CARE = 'palliative_care',
  PHYSICAL_MEDICINE = 'physical_medicine',
  SPORTS_MEDICINE = 'sports_medicine',
  OCCUPATIONAL_MEDICINE = 'occupational_medicine',
  
  // Allied Health (for multi-disciplinary teams)
  PHYSIOTHERAPY = 'physiotherapy',
  OCCUPATIONAL_THERAPY = 'occupational_therapy',
  DIETETICS = 'dietetics',
  SPEECH_THERAPY = 'speech_therapy',
  CLINICAL_PSYCHOLOGY = 'clinical_psychology',
  SOCIAL_WORK = 'social_work',
  
  // Dental
  DENTISTRY = 'dentistry',
  ORAL_SURGERY = 'oral_surgery',
  ORTHODONTICS = 'orthodontics',
  
  // Other
  OTHER = 'other',
}

/**
 * Specialty categories for grouping
 */
export enum SpecialtyCategory {
  PRIMARY_CARE = 'primary_care',
  SURGICAL = 'surgical',
  MEDICAL = 'medical',
  WOMENS_HEALTH = 'womens_health',
  PEDIATRICS = 'pediatrics',
  MENTAL_HEALTH = 'mental_health',
  DIAGNOSTIC = 'diagnostic',
  EMERGENCY = 'emergency',
  ALLIED_HEALTH = 'allied_health',
  DENTAL = 'dental',
  OTHER = 'other',
}

/**
 * Map specialty to category
 */
export const SPECIALTY_CATEGORY_MAP: Record<MedicalSpecialty, SpecialtyCategory> = {
  [MedicalSpecialty. GENERAL_PRACTICE]: SpecialtyCategory.PRIMARY_CARE,
  [MedicalSpecialty.FAMILY_MEDICINE]: SpecialtyCategory.PRIMARY_CARE,
  [MedicalSpecialty.INTERNAL_MEDICINE]: SpecialtyCategory.PRIMARY_CARE,
  [MedicalSpecialty.GENERAL_SURGERY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty. CARDIOTHORACIC_SURGERY]: SpecialtyCategory. SURGICAL,
  [MedicalSpecialty.NEUROSURGERY]: SpecialtyCategory. SURGICAL,
  [MedicalSpecialty.ORTHOPEDIC_SURGERY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty.PLASTIC_SURGERY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty.VASCULAR_SURGERY]: SpecialtyCategory. SURGICAL,
  [MedicalSpecialty.PEDIATRIC_SURGERY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty.UROLOGICAL_SURGERY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty. CARDIOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. PULMONOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. GASTROENTEROLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. NEPHROLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. NEUROLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.ENDOCRINOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. RHEUMATOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. INFECTIOUS_DISEASE]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.HEMATOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.ONCOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. MEDICAL_ONCOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty. RADIATION_ONCOLOGY]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.OBSTETRICS]: SpecialtyCategory.WOMENS_HEALTH,
  [MedicalSpecialty. GYNECOLOGY]: SpecialtyCategory.WOMENS_HEALTH,
  [MedicalSpecialty.OBSTETRICS_GYNECOLOGY]:  SpecialtyCategory.WOMENS_HEALTH,
  [MedicalSpecialty. REPRODUCTIVE_MEDICINE]: SpecialtyCategory.WOMENS_HEALTH,
  [MedicalSpecialty.PEDIATRICS]:  SpecialtyCategory.PEDIATRICS,
  [MedicalSpecialty.NEONATOLOGY]: SpecialtyCategory. PEDIATRICS,
  [MedicalSpecialty.PEDIATRIC_CARDIOLOGY]: SpecialtyCategory.PEDIATRICS,
  [MedicalSpecialty.PEDIATRIC_NEUROLOGY]: SpecialtyCategory. PEDIATRICS,
  [MedicalSpecialty.PSYCHIATRY]: SpecialtyCategory. MENTAL_HEALTH,
  [MedicalSpecialty. CHILD_PSYCHIATRY]: SpecialtyCategory.MENTAL_HEALTH,
  [MedicalSpecialty.PSYCHOLOGY]:  SpecialtyCategory.MENTAL_HEALTH,
  [MedicalSpecialty.RADIOLOGY]: SpecialtyCategory. DIAGNOSTIC,
  [MedicalSpecialty.PATHOLOGY]: SpecialtyCategory. DIAGNOSTIC,
  [MedicalSpecialty.NUCLEAR_MEDICINE]: SpecialtyCategory. DIAGNOSTIC,
  [MedicalSpecialty.ANESTHESIOLOGY]: SpecialtyCategory.SURGICAL,
  [MedicalSpecialty.EMERGENCY_MEDICINE]: SpecialtyCategory. EMERGENCY,
  [MedicalSpecialty.CRITICAL_CARE]: SpecialtyCategory. EMERGENCY,
  [MedicalSpecialty.DERMATOLOGY]: SpecialtyCategory. MEDICAL,
  [MedicalSpecialty.OPHTHALMOLOGY]: SpecialtyCategory. MEDICAL,
  [MedicalSpecialty.ENT]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.ALLERGY_IMMUNOLOGY]: SpecialtyCategory. MEDICAL,
  [MedicalSpecialty.GERIATRICS]:  SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.PALLIATIVE_CARE]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.PHYSICAL_MEDICINE]: SpecialtyCategory.ALLIED_HEALTH,
  [MedicalSpecialty.SPORTS_MEDICINE]: SpecialtyCategory.MEDICAL,
  [MedicalSpecialty.OCCUPATIONAL_MEDICINE]: SpecialtyCategory. MEDICAL,
  [MedicalSpecialty.PHYSIOTHERAPY]: SpecialtyCategory. ALLIED_HEALTH,
  [MedicalSpecialty. OCCUPATIONAL_THERAPY]: SpecialtyCategory.ALLIED_HEALTH,
  [MedicalSpecialty.DIETETICS]: SpecialtyCategory.ALLIED_HEALTH,
  [MedicalSpecialty.SPEECH_THERAPY]: SpecialtyCategory.ALLIED_HEALTH,
  [MedicalSpecialty.CLINICAL_PSYCHOLOGY]: SpecialtyCategory.MENTAL_HEALTH,
  [MedicalSpecialty.SOCIAL_WORK]: SpecialtyCategory.ALLIED_HEALTH,
  [MedicalSpecialty.DENTISTRY]: SpecialtyCategory.DENTAL,
  [MedicalSpecialty. ORAL_SURGERY]: SpecialtyCategory.DENTAL,
  [MedicalSpecialty.ORTHODONTICS]: SpecialtyCategory.DENTAL,
  [MedicalSpecialty.OTHER]: SpecialtyCategory.OTHER,
};
