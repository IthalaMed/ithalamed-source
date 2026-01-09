/**
 * Types of users in the IthalaMed platform
 */
export enum UserType {
  /** Patient or healthcare consumer */
  PATIENT = 'patient',
  
  /** Healthcare provider (doctor, nurse, specialist) */
  PROVIDER = 'provider',
  
  /** Pharmacist */
  PHARMACIST = 'pharmacist',
  
  /** Laboratory technician */
  LAB_TECHNICIAN = 'lab_technician',
  
  /** Emergency Medical Services personnel */
  EMS = 'ems',
  
  /** Hospital/Facility administrator */
  FACILITY_ADMIN = 'facility_admin',
  
  /** Insurance/Medical Aid staff */
  INSURANCE_ADMIN = 'insurance_admin',
  
  /** Government/Regulatory official */
  GOVERNMENT = 'government',
  
  /** System administrator */
  SYSTEM_ADMIN = 'system_admin',
}

/**
 * Get display name for user type
 */
export function getUserTypeDisplayName(type: UserType): string {
  const displayNames: Record<UserType, string> = {
    [UserType.PATIENT]:  'Patient',
    [UserType. PROVIDER]: 'Healthcare Provider',
    [UserType.PHARMACIST]: 'Pharmacist',
    [UserType.LAB_TECHNICIAN]: 'Laboratory Technician',
    [UserType.EMS]: 'EMS Personnel',
    [UserType. FACILITY_ADMIN]:  'Facility Administrator',
    [UserType.INSURANCE_ADMIN]: 'Insurance Administrator',
    [UserType. GOVERNMENT]: 'Government Official',
    [UserType.SYSTEM_ADMIN]: 'System Administrator',
  };
  return displayNames[type] || type;
}
