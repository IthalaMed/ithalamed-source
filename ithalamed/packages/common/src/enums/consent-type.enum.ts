/**
 * Types of patient consent
 */
export enum ConsentType {
  /** General terms and conditions */
  TERMS_AND_CONDITIONS = 'terms_and_conditions',
  
  /** Privacy policy */
  PRIVACY_POLICY = 'privacy_policy',
  
  /** Data processing consent (POPIA/GDPR) */
  DATA_PROCESSING = 'data_processing',
  
  /** Sharing data with providers */
  PROVIDER_SHARING = 'provider_sharing',
  
  /** Sharing data with insurance */
  INSURANCE_SHARING = 'insurance_sharing',
  
  /** Marketing communications */
  MARKETING = 'marketing',
  
  /** Research participation */
  RESEARCH = 'research',
  
  /** Telemedicine consent */
  TELEMEDICINE = 'telemedicine',
  
  /** Emergency data access */
  EMERGENCY_ACCESS = 'emergency_access',
}
