/**
 * Gender Enum
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

/**
 * Blood Type Enum
 */
export enum BloodType {
  A_POSITIVE = 'A+',
  A_NEGATIVE = 'A-',
  B_POSITIVE = 'B+',
  B_NEGATIVE = 'B-',
  AB_POSITIVE = 'AB+',
  AB_NEGATIVE = 'AB-',
  O_POSITIVE = 'O+',
  O_NEGATIVE = 'O-',
}

/**
 * Patient Status Enum
 */
export enum PatientStatus {
  ACTIVE = 'active',
  INACTIVE = 'inactive',
  DECEASED = 'deceased',
}

/**
 * ID Type Enum (South African context)
 */
export enum IdType {
  SA_ID = 'sa_id',
  PASSPORT = 'passport',
  ASYLUM_PERMIT = 'asylum_permit',
  REFUGEE_ID = 'refugee_id',
  OTHER = 'other',
}

/**
 * Relationship Enum (for emergency contacts)
 */
export enum Relationship {
  SPOUSE = 'spouse',
  PARENT = 'parent',
  CHILD = 'child',
  SIBLING = 'sibling',
  GRANDPARENT = 'grandparent',
  GRANDCHILD = 'grandchild',
  AUNT_UNCLE = 'aunt_uncle',
  COUSIN = 'cousin',
  FRIEND = 'friend',
  COLLEAGUE = 'colleague',
  NEIGHBOR = 'neighbor',
  CAREGIVER = 'caregiver',
  OTHER = 'other',
}
