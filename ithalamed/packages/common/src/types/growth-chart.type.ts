/**
 * Growth Chart Types
 * 
 * Based on Growth Charts & Immunizations requirements for pediatric care
 * from ithalamed_overview2.txt
 */

/**
 * Growth measurement
 */
export interface GrowthMeasurement {
  /** Measurement date */
  date:  Date;
  
  /** Age in months at measurement */
  ageInMonths: number;
  
  /** Weight in kg */
  weight?:  number;
  
  /** Height/Length in cm */
  height?: number;
  
  /** Head circumference in cm (for 0-3 years) */
  headCircumference?: number;
  
  /** BMI (calculated for 2+ years) */
  bmi?: number;
  
  /** Weight-for-age percentile */
  weightPercentile?: number;
  
  /** Height-for-age percentile */
  heightPercentile?: number;
  
  /** Weight-for-height percentile */
  weightForHeightPercentile?: number;
  
  /** BMI-for-age percentile */
  bmiPercentile?: number;
  
  /** Head circumference percentile */
  headCircumferencePercentile?: number;
  
  /** Z-scores */
  zScores?: {
    weightForAge?: number;
    heightForAge?: number;
    weightForHeight?: number;
    bmiForAge?: number;
    headCircumference?: number;
  };
  
  /** Notes */
  notes?: string;
}

/**
 * WHO Growth Standard reference data point
 */
export interface GrowthStandardPoint {
  ageInMonths:  number;
  p3: number;
  p15: number;
  p50: number;
  p85: number;
  p97: number;
  sd_minus_3: number;
  sd_minus_2: number;
  sd_minus_1: number;
  sd_0: number;
  sd_plus_1: number;
  sd_plus_2: number;
  sd_plus_3: number;
}

/**
 * Developmental milestone
 */
export interface DevelopmentalMilestone {
  /** Milestone ID */
  id: string;
  
  /** Category */
  category: 'gross_motor' | 'fine_motor' | 'language_receptive' | 'language_expressive' | 'social_emotional' | 'cognitive';
  
  /** Description */
  description: string;
  
  /** Expected age range (months) */
  expectedAgeRange: {
    min: number;
    max: number;
  };
  
  /** Whether milestone is achieved */
  achieved:  boolean;
  
  /** Date achieved */
  achievedDate?:  Date;
  
  /** Notes */
  notes?: string;
}

/**
 * Immunization record
 */
export interface ImmunizationRecord {
  /** Vaccine name */
  vaccineName: string;
  
  /** Vaccine code (CVX code) */
  vaccineCode?: string;
  
  /** Brand name */
  brandName?: string;
  
  /** Dose number (1st, 2nd, 3rd, etc.) */
  doseNumber: number;
  
  /** Date administered */
  administeredDate:  Date;
  
  /** Lot/Batch number */
  lotNumber?: string;
  
  /** Expiry date of vaccine */
  expiryDate?:  Date;
  
  /** Site of administration */
  site?: 'left_arm' | 'right_arm' | 'left_thigh' | 'right_thigh' | 'oral' | 'intranasal';
  
  /** Route */
  route?: 'intramuscular' | 'subcutaneous' | 'oral' | 'intranasal' | 'intradermal';
  
  /** Administering provider */
  administeredBy?: string;
  
  /** Facility where administered */
  facilityName?: string;
  
  /** Adverse reactions */
  adverseReaction?:  {
    occurred: boolean;
    description?: string;
    severity?: 'mild' | 'moderate' | 'severe';
    reportedDate?: Date;
  };
  
  /** Next dose due date */
  nextDoseDate?: Date;
  
  /** Notes */
  notes?:  string;
}

/**
 * South African EPI Schedule vaccine entry
 */
export interface EPIVaccineEntry {
  /** Vaccine name */
  name: string;
  
  /** Abbreviated name */
  abbreviation:  string;
  
  /** Age description */
  ageDescription: string;
  
  /** Age in weeks (for birth and early vaccines) */
  ageWeeks?: number;
  
  /** Age in months */
  ageMonths?: number;
  
  /** Age in years */
  ageYears?: number;
  
  /** Dose number */
  doseNumber: number;
  
  /** Total doses in series */
  totalDoses:  number;
  
  /** Is catch-up available */
  catchUpAvailable:  boolean;
  
  /** Notes */
  notes?: string;
}

/**
 * South African Expanded Programme on Immunisation (EPI) Schedule
 * As per National Department of Health guidelines
 */
export const SA_EPI_SCHEDULE:  EPIVaccineEntry[] = [
  // Birth
  { name: 'Bacillus Calmette-Guérin', abbreviation: 'BCG', ageDescription: 'Birth', ageWeeks: 0, doseNumber: 1, totalDoses: 1, catchUpAvailable: true, notes: 'Intradermal injection' },
  { name: 'Oral Polio Vaccine', abbreviation: 'OPV 0', ageDescription: 'Birth', ageWeeks: 0, doseNumber: 0, totalDoses: 4, catchUpAvailable: true },
  
  // 6 weeks
  { name: 'Oral Polio Vaccine', abbreviation: 'OPV 1', ageDescription: '6 weeks', ageWeeks: 6, doseNumber:  1, totalDoses: 4, catchUpAvailable: true },
  { name: 'Diphtheria-Tetanus-Pertussis-IPV-Hib', abbreviation: 'DTaP-IPV-Hib 1', ageDescription: '6 weeks', ageWeeks:  6, doseNumber: 1, totalDoses: 4, catchUpAvailable: true },
  { name: 'Hepatitis B', abbreviation: 'HepB 1', ageDescription: '6 weeks', ageWeeks:  6, doseNumber: 1, totalDoses: 3, catchUpAvailable: true },
  { name: 'Pneumococcal Conjugate Vaccine', abbreviation: 'PCV 1', ageDescription: '6 weeks', ageWeeks: 6, doseNumber:  1, totalDoses: 3, catchUpAvailable: true },
  { name: 'Rotavirus', abbreviation: 'RV 1', ageDescription: '6 weeks', ageWeeks: 6, doseNumber: 1, totalDoses: 2, catchUpAvailable: true, notes: 'Oral vaccine' },
  
  // 10 weeks
  { name: 'Diphtheria-Tetanus-Pertussis-IPV-Hib', abbreviation: 'DTaP-IPV-Hib 2', ageDescription: '10 weeks', ageWeeks: 10, doseNumber: 2, totalDoses: 4, catchUpAvailable: true },
  { name: 'Hepatitis B', abbreviation: 'HepB 2', ageDescription: '10 weeks', ageWeeks: 10, doseNumber: 2, totalDoses: 3, catchUpAvailable: true },
  
  // 14 weeks
  { name: 'Oral Polio Vaccine', abbreviation: 'OPV 2', ageDescription: '14 weeks', ageWeeks: 14, doseNumber: 2, totalDoses: 4, catchUpAvailable: true },
  { name: 'Diphtheria-Tetanus-Pertussis-IPV-Hib', abbreviation: 'DTaP-IPV-Hib 3', ageDescription: '14 weeks', ageWeeks: 14, doseNumber: 3, totalDoses: 4, catchUpAvailable: true },
  { name: 'Hepatitis B', abbreviation: 'HepB 3', ageDescription: '14 weeks', ageWeeks: 14, doseNumber:  3, totalDoses: 3, catchUpAvailable: true },
  { name: 'Pneumococcal Conjugate Vaccine', abbreviation: 'PCV 2', ageDescription: '14 weeks', ageWeeks: 14, doseNumber: 2, totalDoses: 3, catchUpAvailable: true },
  { name: 'Rotavirus', abbreviation: 'RV 2', ageDescription:  '14 weeks', ageWeeks: 14, doseNumber: 2, totalDoses:  2, catchUpAvailable:  true, notes: 'Oral vaccine' },
  
  // 6 months
  { name: 'Vitamin A', abbreviation: 'Vit A', ageDescription: '6 months', ageMonths: 6, doseNumber: 1, totalDoses: 9, catchUpAvailable: true, notes: 'Oral supplement' },
  
  // 9 months
  { name: 'Measles', abbreviation: 'Measles 1', ageDescription: '9 months', ageMonths: 9, doseNumber: 1, totalDoses: 2, catchUpAvailable: true },
  { name: 'Pneumococcal Conjugate Vaccine', abbreviation: 'PCV 3', ageDescription: '9 months', ageMonths: 9, doseNumber:  3, totalDoses: 3, catchUpAvailable: true },
  
  // 12 months
  { name: 'Vitamin A', abbreviation: 'Vit A', ageDescription: '12 months', ageMonths: 12, doseNumber: 2, totalDoses: 9, catchUpAvailable: true },
  { name: 'Measles', abbreviation: 'Measles 2', ageDescription: '12 months', ageMonths: 12, doseNumber: 2, totalDoses: 2, catchUpAvailable: true },
  
  // 18 months
  { name: 'Oral Polio Vaccine', abbreviation: 'OPV 3', ageDescription: '18 months', ageMonths: 18, doseNumber: 3, totalDoses: 4, catchUpAvailable: true },
  { name: 'Diphtheria-Tetanus-Pertussis-IPV-Hib', abbreviation: 'DTaP-IPV-Hib 4', ageDescription: '18 months', ageMonths: 18, doseNumber: 4, totalDoses: 4, catchUpAvailable: true },
  { name: 'Vitamin A', abbreviation: 'Vit A', ageDescription:  '18 months', ageMonths: 18, doseNumber: 3, totalDoses: 9, catchUpAvailable: true },
  
  // 6 years
  { name: 'Tetanus-Diphtheria', abbreviation: 'Td', ageDescription: '6 years', ageYears: 6, doseNumber: 1, totalDoses: 2, catchUpAvailable: true },
  
  // 12 years
  { name: 'Tetanus-Diphtheria', abbreviation: 'Td', ageDescription: '12 years', ageYears: 12, doseNumber: 2, totalDoses: 2, catchUpAvailable: true },
  { name: 'Human Papillomavirus', abbreviation: 'HPV 1', ageDescription: '9-14 years (girls)', ageYears: 9, doseNumber: 1, totalDoses: 2, catchUpAvailable: true, notes: 'Girls only, school-based program' },
  { name: 'Human Papillomavirus', abbreviation: 'HPV 2', ageDescription: '9-14 years (girls)', ageYears: 9, doseNumber: 2, totalDoses: 2, catchUpAvailable: true, notes:  '6 months after first dose' },
];

/**
 * Growth alert types
 */
export type GrowthAlertType = 
  | 'underweight'
  | 'overweight'
  | 'stunted'
  | 'wasted'
  | 'microcephaly'
  | 'macrocephaly'
  | 'failure_to_thrive'
  | 'rapid_weight_gain';

/**
 * Growth alert
 */
export interface GrowthAlert {
  type: GrowthAlertType;
  severity: 'mild' | 'moderate' | 'severe';
  message: string;
  recommendation: string;
  zScore?: number;
  percentile?: number;
}
