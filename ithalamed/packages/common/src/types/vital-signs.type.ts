/**
 * Vital Signs Types
 * 
 * Based on Health Tracking & Monitoring requirements from ithalamed_overview2.txt
 * and Hospital Operations patient monitoring requirements
 */

/**
 * Blood pressure reading
 */
export interface BloodPressure {
  systolic: number;
  diastolic: number;
  meanArterialPressure?:  number;
  position?: 'sitting' | 'standing' | 'supine';
  arm?: 'left' | 'right';
}

/**
 * Complete vital signs record
 */
export interface VitalSigns {
  /** Blood pressure (mmHg) */
  bloodPressure?: BloodPressure;
  
  /** Heart rate (beats per minute) */
  heartRate?: number;
  
  /** Respiratory rate (breaths per minute) */
  respiratoryRate?:  number;
  
  /** Oxygen saturation (percentage) */
  oxygenSaturation?:  number;
  
  /** Temperature (Celsius) */
  temperature?: number;
  
  /** Temperature site */
  temperatureSite?: 'oral' | 'axillary' | 'rectal' | 'tympanic' | 'temporal';
  
  /** Weight (kg) */
  weight?: number;
  
  /** Height (cm) */
  height?: number;
  
  /** BMI (calculated) */
  bmi?: number;
  
  /** Pain score (0-10) */
  painScore?: number;
  
  /** Glasgow Coma Scale score */
  gcs?: GlasgowComaScale;
  
  /** Blood glucose (mmol/L) */
  bloodGlucose?: number;
  
  /** Blood glucose timing */
  glucoseTiming?: 'fasting' | 'random' | 'pre_meal' | 'post_meal';
  
  /** End-tidal CO2 (mmHg) - for intubated patients */
  etCo2?: number;
  
  /** Central venous pressure (cmH2O) */
  cvp?: number;
  
  /** Intracranial pressure (mmHg) */
  icp?: number;
  
  /** Recording timestamp */
  recordedAt:  Date;
  
  /** Recording method */
  recordingMethod?: 'manual' | 'automatic' | 'device';
  
  /** Device ID if automatically recorded */
  deviceId?: string;
  
  /** Notes */
  notes?: string;
}

/**
 * Glasgow Coma Scale components
 */
export interface GlasgowComaScale {
  /** Eye opening (1-4) */
  eyeOpening:  number;
  
  /** Verbal response (1-5) */
  verbalResponse: number;
  
  /** Motor response (1-6) */
  motorResponse: number;
  
  /** Total score (3-15) */
  total: number;
}

/**
 * Early Warning Score (NEWS2)
 */
export interface NEWS2Score {
  respiratoryRate: number;
  oxygenSaturation: number;
  supplementalOxygen: boolean;
  temperature: number;
  systolicBP: number;
  heartRate: number;
  consciousness: 'alert' | 'voice' | 'pain' | 'unresponsive';
  totalScore: number;
  riskLevel: 'low' | 'low_medium' | 'medium' | 'high';
}

/**
 * Pediatric vital signs with age-specific normal ranges
 */
export interface PediatricVitalSigns extends VitalSigns {
  /** Age in months (for reference range lookup) */
  ageInMonths:  number;
  
  /** Head circumference (cm) - for infants */
  headCircumference?: number;
  
  /** Capillary refill time (seconds) */
  capillaryRefillTime?: number;
}

/**
 * Obstetric vital signs
 */
export interface ObstetricVitalSigns extends VitalSigns {
  /** Fundal height (cm) */
  fundalHeight?: number;
  
  /** Fetal heart rate (bpm) */
  fetalHeartRate?: number;
  
  /** Fetal movement count */
  fetalMovements?: number;
  
  /** Uterine contractions per 10 minutes */
  contractionFrequency?: number;
  
  /** Contraction duration (seconds) */
  contractionDuration?: number;
  
  /** Cervical dilation (cm) - during labor */
  cervicalDilation?: number;
  
  /** Cervical effacement (%) - during labor */
  cervicalEffacement?: number;
  
  /** Station (-3 to +3) - during labor */
  station?: number;
}

/**
 * ICU-specific vital signs
 */
export interface ICUVitalSigns extends VitalSigns {
  /** Arterial blood pressure (from arterial line) */
  arterialBP?: BloodPressure;
  
  /** Pulmonary artery pressure */
  pulmonaryArteryPressure?: {
    systolic: number;
    diastolic: number;
    mean: number;
  };
  
  /** Pulmonary capillary wedge pressure */
  pcwp?: number;
  
  /** Cardiac output (L/min) */
  cardiacOutput?: number;
  
  /** Cardiac index (L/min/m²) */
  cardiacIndex?: number;
  
  /** Systemic vascular resistance */
  svr?: number;
  
  /** Mixed venous oxygen saturation */
  svo2?: number;
  
  /** Urine output (mL/hr) */
  urineOutput?: number;
  
  /** Fluid balance (mL) - intake minus output */
  fluidBalance?: number;
}
