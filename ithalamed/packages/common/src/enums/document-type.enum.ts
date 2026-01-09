/**
 * Types of medical documents
 */
export enum DocumentType {
  /** Identification document */
  ID_DOCUMENT = 'id_document',
  
  /** Medical aid card */
  MEDICAL_AID_CARD = 'medical_aid_card',
  
  /** Lab result */
  LAB_RESULT = 'lab_result',
  
  /** Imaging result (X-ray, MRI, etc.) */
  IMAGING_RESULT = 'imaging_result',
  
  /** Prescription */
  PRESCRIPTION = 'prescription',
  
  /** Referral letter */
  REFERRAL = 'referral',
  
  /** Discharge summary */
  DISCHARGE_SUMMARY = 'discharge_summary',
  
  /** Medical certificate */
  MEDICAL_CERTIFICATE = 'medical_certificate',
  
  /** Consent form */
  CONSENT_FORM = 'consent_form',
  
  /** Clinical notes */
  CLINICAL_NOTES = 'clinical_notes',
  
  /** Other */
  OTHER = 'other',
}
