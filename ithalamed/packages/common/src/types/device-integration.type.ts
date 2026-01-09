/**
 * Medical Device Integration Types
 * 
 * Based on Medical Device Integration requirements from ithalamed_overview2.txt
 * for Hospital Operations and Mirth Connect integration
 */

/**
 * Medical device registration
 */
export interface MedicalDevice {
  /** Device ID */
  id: string;
  
  /** Device serial number */
  serialNumber: string;
  
  /** Device type */
  deviceType: string;
  
  /** Manufacturer */
  manufacturer: string;
  
  /** Model name/number */
  model: string;
  
  /** Firmware version */
  firmwareVersion?:  string;
  
  /** Facility ID */
  facilityId:  string;
  
  /** Department */
  department: string;
  
  /** Location (room/bed) */
  location?: string;
  
  /** IP address */
  ipAddress?: string;
  
  /** Communication protocol */
  protocol:  'hl7_v2' | 'hl7_fhir' | 'dicom' | 'mqtt' | 'proprietary';
  
  /** Connection status */
  connectionStatus: 'connected' | 'disconnected' | 'error';
  
  /** Last communication time */
  lastCommunication?: Date;
  
  /** Calibration status */
  calibrationStatus:  'valid' | 'due' | 'overdue' | 'not_applicable';
  
  /** Last calibration date */
  lastCalibrationDate?: Date;
  
  /** Next calibration due */
  nextCalibrationDue?: Date;
  
  /** Maintenance status */
  maintenanceStatus:  'operational' | 'maintenance_due' | 'under_maintenance' | 'out_of_service';
  
  /** Last maintenance date */
  lastMaintenanceDate?: Date;
  
  /** Is active */
  isActive: boolean;
  
  /** Metadata */
  metadata?: Record<string, unknown>;
}

/**
 * Device-patient association
 */
export interface DevicePatientAssociation {
  id: string;
  deviceId: string;
  patientId: string;
  encounterId?:  string;
  bedId?: string;
  associatedAt: Date;
  disassociatedAt?: Date;
  associatedBy: string;
  isActive: boolean;
}

/**
 * Device data reading
 */
export interface DeviceReading {
  /** Reading ID */
  id: string;
  
  /** Device ID */
  deviceId: string;
  
  /** Patient ID (if associated) */
  patientId?: string;
  
  /** Reading type */
  readingType: string;
  
  /** Value */
  value: number | string | Record<string, unknown>;
  
  /** Unit of measurement */
  unit?:  string;
  
  /** Timestamp from device */
  deviceTimestamp:  Date;
  
  /** Server received timestamp */
  receivedAt: Date;
  
  /** Is abnormal */
  isAbnormal?:  boolean;
  
  /** Abnormality type */
  abnormalityType?: 'low' | 'high' | 'critical_low' | 'critical_high';
  
  /** Reference range */
  referenceRange?:  {
    low?:  number;
    high?: number;
    criticalLow?: number;
    criticalHigh?: number;
  };
  
  /** Raw data from device */
  rawData?: string;
}

/**
 * Device alert
 */
export interface DeviceAlert {
  /** Alert ID */
  id: string;
  
  /** Device ID */
  deviceId: string;
  
  /** Patient ID */
  patientId?: string;
  
  /** Alert type */
  alertType: string;
  
  /** Alert code */
  alertCode?:  string;
  
  /** Priority */
  priority: 'info' | 'warning' | 'critical';
  
  /** Message */
  message: string;
  
  /** Alert timestamp */
  timestamp: Date;
  
  /** Is acknowledged */
  acknowledged: boolean;
  
  /** Acknowledged by */
  acknowledgedBy?:  string;
  
  /** Acknowledged at */
  acknowledgedAt?: Date;
  
  /** Action taken */
  actionTaken?:  string;
  
  /** Is resolved */
  resolved: boolean;
  
  /** Resolved at */
  resolvedAt?: Date;
  
  /** Related readings */
  relatedReadings?: string[];
}

/**
 * Ventilator parameters
 */
export interface VentilatorParameters {
  /** Mode */
  mode: 'VC' | 'PC' | 'SIMV' | 'CPAP' | 'BiPAP' | 'PRVC' | 'APRV' | 'other';
  
  /** Set parameters */
  setParameters: {
    tidalVolume?: number;      // mL
    respiratoryRate?: number;   // breaths/min
    peep?: number;              // cmH2O
    fio2?: number;              // %
    inspiratoryPressure?: number; // cmH2O
    pressureSupport?: number;   // cmH2O
    ieRatio?: string;           // e.g., "1:2"
  };
  
  /** Measured parameters */
  measuredParameters:  {
    tidalVolumeExpired?: number;
    minuteVentilation?: number;
    peakPressure?: number;
    plateauPressure?: number;
    meanAirwayPressure?: number;
    compliance?: number;        // mL/cmH2O
    resistance?: number;        // cmH2O/L/s
    autopeep?: number;
  };
  
  /** Alarms */
  activeAlarms?: string[];
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Infusion pump data
 */
export interface InfusionPumpData {
  /** Channel number (for multi-channel pumps) */
  channel: number;
  
  /** Drug name */
  drugName?:  string;
  
  /** Drug concentration */
  drugConcentration?: string;
  
  /** Rate */
  rate:  number;
  
  /** Rate unit */
  rateUnit:  'mL/hr' | 'mcg/kg/min' | 'mg/hr' | 'units/hr';
  
  /** Volume infused */
  volumeInfused: number;
  
  /** Volume to be infused (VTBI) */
  vtbi?:  number;
  
  /** Time remaining */
  timeRemaining?: number; // minutes
  
  /** Status */
  status: 'running' | 'paused' | 'stopped' | 'alarm' | 'completed';
  
  /** Active alarms */
  activeAlarms?: string[];
  
  /** Timestamp */
  timestamp: Date;
}

/**
 * Patient monitor waveform data
 */
export interface WaveformData {
  /** Waveform type */
  type: 'ecg' | 'pleth' | 'resp' | 'abp' | 'cvp' | 'etco2';
  
  /** Lead (for ECG) */
  lead?: string;
  
  /** Sample rate (Hz) */
  sampleRate:  number;
  
  /** Data points */
  dataPoints: number[];
  
  /** Start timestamp */
  startTimestamp: Date;
  
  /** Duration (ms) */
  durationMs: number;
}

/**
 * HL7 message structure (simplified)
 */
export interface HL7Message {
  messageType: string;
  messageControlId: string;
  sendingApplication: string;
  sendingFacility: string;
  receivingApplication: string;
  receivingFacility: string;
  timestamp: Date;
  segments: HL7Segment[];
  rawMessage: string;
}

/**
 * HL7 segment
 */
export interface HL7Segment {
  segmentId: string;
  fields: string[];
}

/**
 * FHIR Observation resource (simplified)
 */
export interface FHIRObservation {
  resourceType: 'Observation';
  id:  string;
  status: 'registered' | 'preliminary' | 'final' | 'amended' | 'corrected' | 'cancelled';
  category?:  {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }[];
  code: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
    text?:  string;
  };
  subject:  {
    reference: string;
    display?:  string;
  };
  effectiveDateTime?:  string;
  issued?: string;
  valueQuantity?: {
    value:  number;
    unit: string;
    system?: string;
    code?: string;
  };
  valueString?: string;
  valueBoolean?: boolean;
  interpretation?: {
    coding: Array<{
      system: string;
      code: string;
      display: string;
    }>;
  }[];
  referenceRange?: Array<{
    low?: { value: number; unit: string };
    high?: { value: number; unit: string };
    text?: string;
  }>;
  device?: {
    reference: string;
    display?: string;
  };
}
