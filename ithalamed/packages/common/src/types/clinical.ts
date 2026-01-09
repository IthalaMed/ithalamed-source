/**
 * Clinical Types
 * 
 * Types for clinical documentation, diagnosis, and treatment
 */

/**
 * ICD-10 Diagnosis
 */
export interface Diagnosis {
  /** ICD-10 code */
  code: string;
  
  /** ICD-10 description */
  description: string;
  
  /** Primary or secondary diagnosis */
  type: 'primary' | 'secondary' | 'admitting' | 'discharge';
  
  /** Date of diagnosis */
  diagnosedDate?:  Date;
  
  /** Certainty level */
  certainty?:  'confirmed' | 'provisional' | 'differential' | 'rule_out';
  
  /** Clinical notes */
  notes?: string;
}

/**
 * SOAP Note structure
 */
export interface SOAPNote {
  /** Subjective - Patient's reported symptoms and history */
  subjective:  {
    chiefComplaint:  string;
    historyOfPresentIllness?:  string;
    reviewOfSystems?: ReviewOfSystems;
    patientReportedSymptoms?: string[];
  };
  
  /** Objective - Clinical findings and measurements */
  objective: {
    vitalSigns?: VitalSigns;
    physicalExamination?: PhysicalExamination;
    labResults?: LabResultSummary[];
    imagingResults?: ImagingResultSummary[];
  };
  
  /** Assessment - Clinical impression and diagnoses */
  assessment: {
    diagnoses:  Diagnosis[];
    differentialDiagnoses?:  Diagnosis[];
    clinicalImpression?: string;
  };
  
  /** Plan - Treatment and follow-up */
  plan: {
    medications?: MedicationOrder[];
    procedures?: ProcedureOrder[];
    labOrders?: LabOrder[];
    imagingOrders?: ImagingOrder[];
    referrals?: Referral[];
    patientEducation?: string[];
    followUpInstructions?: string;
    followUpDate?: Date;
  };
}

/**
 * Review of Systems checklist
 */
export interface ReviewOfSystems {
  constitutional?: SystemReview;
  eyes?: SystemReview;
  ent?: SystemReview;
  cardiovascular?: SystemReview;
  respiratory?: SystemReview;
  gastrointestinal?: SystemReview;
  genitourinary?: SystemReview;
  musculoskeletal?: SystemReview;
  skin?: SystemReview;
  neurological?: SystemReview;
  psychiatric?: SystemReview;
  endocrine?: SystemReview;
  hematologic?: SystemReview;
  immunologic?: SystemReview;
}

/**
 * System review for ROS
 */
export interface SystemReview {
  reviewed: boolean;
  normal:  boolean;
  findings?:  string[];
  notes?: string;
}

/**
 * Physical examination findings
 */
export interface PhysicalExamination {
  generalAppearance?: string;
  heent?: ExaminationSection;
  neck?: ExaminationSection;
  cardiovascular?: ExaminationSection;
  respiratory?: ExaminationSection;
  abdomen?: ExaminationSection;
  musculoskeletal?: ExaminationSection;
  neurological?: ExaminationSection;
  skin?: ExaminationSection;
  psychiatric?: ExaminationSection;
  genitourinary?: ExaminationSection;
  extremities?: ExaminationSection;
}

/**
 * Examination section
 */
export interface ExaminationSection {
  examined: boolean;
  normal: boolean;
  findings?: string;
  notes?: string;
}

/**
 * Lab result summary for clinical notes
 */
export interface LabResultSummary {
  testName: string;
  value: string;
  unit: string;
  referenceRange: string;
  flag?:  'normal' | 'low' | 'high' | 'critical';
  resultDate:  Date;
}

/**
 * Imaging result summary
 */
export interface ImagingResultSummary {
  modality: string;
  bodyPart: string;
  findings:  string;
  impression: string;
  resultDate: Date;
}

/**
 * Medication order for plan
 */
export interface MedicationOrder {
  medicationName: string;
  dosage: string;
  route: string;
  frequency: string;
  duration?:  string;
  instructions?: string;
  isPrescribed:  boolean;
}

/**
 * Procedure order
 */
export interface ProcedureOrder {
  procedureName: string;
  cptCode?:  string;
  urgency:  'routine' | 'urgent' | 'emergent';
  scheduledDate?: Date;
  notes?: string;
}

/**
 * Lab order
 */
export interface LabOrder {
  testName: string;
  testCode?: string;
  priority: 'routine' | 'urgent' | 'stat';
  clinicalIndication?: string;
  fasting?: boolean;
}

/**
 * Imaging order
 */
export interface ImagingOrder {
  modality:  string;
  bodyPart:  string;
  contrast?: boolean;
  priority: 'routine' | 'urgent' | 'stat';
  clinicalIndication:  string;
  comparisonToPrior?: boolean;
}

/**
 * Referral
 */
export interface Referral {
  specialty: string;
  urgency: 'routine' | 'urgent' | 'emergent';
  reason: string;
  preferredProvider?: string;
  preferredFacility?: string;
  attachedDocuments?: string[];
}

// Import VitalSigns from vital-signs.type.ts
import { VitalSigns } from './vital-signs.type';
