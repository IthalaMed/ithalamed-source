/**
 * Gender options
 */
export enum Gender {
  MALE = 'male',
  FEMALE = 'female',
  OTHER = 'other',
  PREFER_NOT_TO_SAY = 'prefer_not_to_say',
}

/**
 * Get display name for gender
 */
export function getGenderDisplayName(gender: Gender): string {
  const displayNames: Record<Gender, string> = {
    [Gender. MALE]: 'Male',
    [Gender.FEMALE]:  'Female',
    [Gender.OTHER]: 'Other',
    [Gender. PREFER_NOT_TO_SAY]:  'Prefer not to say',
  };
  return displayNames[gender] || gender;
}
