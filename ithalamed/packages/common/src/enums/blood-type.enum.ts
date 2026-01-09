/**
 * Blood type classifications
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
 * Blood type compatibility for transfusion
 */
export const BLOOD_TYPE_COMPATIBILITY:  Record<BloodType, BloodType[]> = {
  [BloodType. A_POSITIVE]:  [BloodType. A_POSITIVE, BloodType. A_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType. A_NEGATIVE]:  [BloodType. A_NEGATIVE, BloodType. O_NEGATIVE],
  [BloodType.B_POSITIVE]: [BloodType.B_POSITIVE, BloodType. B_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType. B_NEGATIVE]:  [BloodType. B_NEGATIVE, BloodType.O_NEGATIVE],
  [BloodType.AB_POSITIVE]: [BloodType.A_POSITIVE, BloodType.A_NEGATIVE, BloodType.B_POSITIVE, BloodType.B_NEGATIVE, BloodType.AB_POSITIVE, BloodType.AB_NEGATIVE, BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType. AB_NEGATIVE]:  [BloodType. A_NEGATIVE, BloodType.B_NEGATIVE, BloodType.AB_NEGATIVE, BloodType. O_NEGATIVE],
  [BloodType.O_POSITIVE]: [BloodType.O_POSITIVE, BloodType.O_NEGATIVE],
  [BloodType.O_NEGATIVE]: [BloodType.O_NEGATIVE],
};

/**
 * Check if blood types are compatible for transfusion
 */
export function areBloodTypesCompatible(recipient: BloodType, donor: BloodType): boolean {
  return BLOOD_TYPE_COMPATIBILITY[recipient]?. includes(donor) ?? false;
}
