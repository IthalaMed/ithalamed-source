/**
 * Patient vital signs
 */
export interface VitalSigns {
  /** Blood pressure - systolic (mmHg) */
  bloodPressureSystolic?:  number;
  
  /** Blood pressure - diastolic (mmHg) */
  bloodPressureDiastolic?: number;
  
  /** Heart rate (beats per minute) */
  heartRate?: number;
  
  /** Respiratory rate (breaths per minute) */
  respiratoryRate?: number;
  
  /** Body temperature (Celsius) */
  temperature?: number;
  
  /** Oxygen saturation (percentage) */
  oxygenSaturation?:  number;
  
  /** Weight (kilograms) */
  weight?:  number;
  
  /** Height (centimeters) */
  height?: number;
  
  /** Body Mass Index (calculated) */
  bmi?: number;
  
  /** Pain score (0-10) */
  painScore?: number;
  
  /** Blood glucose (mmol/L) */
  bloodGlucose?: number;
  
  /** Glasgow Coma Scale (3-15) */
  glasgowComaScale?: number;
  
  /** Timestamp when vitals were recorded */
  recordedAt:  Date;
  
  /** ID of person who recorded vitals */
  recordedBy?: string;
  
  /** Notes */
  notes?: string;
}

/**
 * Normal ranges for vital signs (adults)
 */
export const VITAL_SIGNS_NORMAL_RANGES = {
  bloodPressureSystolic: { min: 90, max: 120 },
  bloodPressureDiastolic: { min:  60, max:  80 },
  heartRate: { min: 60, max: 100 },
  respiratoryRate: { min: 12, max: 20 },
  temperature: { min: 36.1, max: 37.2 },
  oxygenSaturation: { min: 95, max: 100 },
  bloodGlucose:  { min: 4.0, max: 7.8 }, // fasting
};

/**
 * Calculate BMI from weight and height
 */
export function calculateBMI(weightKg: number, heightCm: number): number {
  const heightM = heightCm / 100;
  return Math.round((weightKg / (heightM * heightM)) * 10) / 10;
}

/**
 * Get BMI category
 */
export function getBMICategory(bmi: number): string {
  if (bmi < 18.5) return 'Underweight';
  if (bmi < 25) return 'Normal';
  if (bmi < 30) return 'Overweight';
  if (bmi < 35) return 'Obese Class I';
  if (bmi < 40) return 'Obese Class II';
  return 'Obese Class III';
}

/**
 * Check if vital sign is within normal range
 */
export function isVitalSignNormal(
  vitalSign: keyof typeof VITAL_SIGNS_NORMAL_RANGES,
  value: number,
): boolean {
  const range = VITAL_SIGNS_NORMAL_RANGES[vitalSign];
  return value >= range.min && value <= range.max;
}
