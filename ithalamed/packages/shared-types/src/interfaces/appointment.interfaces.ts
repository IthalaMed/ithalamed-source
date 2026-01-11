import {
  AppointmentType,
  AppointmentStatus,
  AppointmentPriority,
  ConsultationMode,
  CancellationReason,
  CheckInMethod,
} from '../enums';

/**
 * Provider Interface
 */
export interface Provider {
  id: string;
  userId?:  string;
  firstName: string;
  lastName: string;
  fullName: string;
  title?:  string;
  specialization: string;
  qualifications?:  string[];
  profilePhotoUrl?: string;
  rating?: number;
  reviewCount?: number;
  consultationFee?: number;
  isAvailable: boolean;
}

/**
 * Facility Interface
 */
export interface Facility {
  id: string;
  name: string;
  type: string;
  address: string;
  suburb?:  string;
  city: string;
  province: string;
  postalCode?:  string;
  phoneNumber: string;
  email?:  string;
  latitude?: number;
  longitude?: number;
  operatingHours?: Record<string, { open: string; close: string }>;
}

/**
 * Appointment Interface
 */
export interface Appointment {
  id: string;
  appointmentNumber: string;
  patientId: string;
  providerId:  string;
  provider?:  Provider;
  facilityId: string;
  facility?: Facility;
  appointmentType: AppointmentType;
  status: AppointmentStatus;
  priority: AppointmentPriority;
  consultationMode: ConsultationMode;
  scheduledStartTime:  string;
  scheduledEndTime: string;
  actualStartTime?:  string;
  actualEndTime?:  string;
  duration: number;
  chiefComplaint?: string;
  notes?: string;
  cancellationReason?: CancellationReason;
  cancellationNotes?: string;
  checkInTime?: string;
  checkInMethod?:  CheckInMethod;
  qrCode?: string;
  meetingLink?: string;
  reminderSent:  boolean;
  createdAt:  string;
  updatedAt:  string;
}

/**
 * Appointment Slot Interface
 */
export interface AppointmentSlot {
  startTime: string;
  endTime: string;
  available: boolean;
  providerId: string;
  facilityId: string;
}

// ==================== REQUEST INTERFACES ====================

export interface BookAppointmentRequest {
  providerId: string;
  facilityId: string;
  appointmentType: AppointmentType;
  consultationMode: ConsultationMode;
  scheduledStartTime: string;
  duration?:  number;
  chiefComplaint?: string;
  notes?: string;
  priority?:  AppointmentPriority;
}

export interface RescheduleAppointmentRequest {
  newStartTime: string;
  reason?: string;
}

export interface CancelAppointmentRequest {
  reason:  CancellationReason;
  notes?: string;
}

export interface CheckInRequest {
  method: CheckInMethod;
  location?: {
    latitude:  number;
    longitude: number;
  };
}
