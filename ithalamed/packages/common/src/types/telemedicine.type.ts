/**
 * Telemedicine Types
 * 
 * Based on Telemedicine Module requirements from ithalamed_overview2.txt
 * and FR-PAT-030 through FR-PAT-038 from FRD
 */

/**
 * Telemedicine session status
 */
export type TelemedicineSessionStatus = 
  | 'scheduled'
  | 'waiting'
  | 'connecting'
  | 'active'
  | 'paused'
  | 'reconnecting'
  | 'completed'
  | 'cancelled'
  | 'failed';

/**
 * Connection quality levels
 */
export type ConnectionQuality = 'excellent' | 'good' | 'fair' | 'poor' | 'disconnected';

/**
 * Telemedicine session
 */
export interface TelemedicineSession {
  /** Session ID */
  id: string;
  
  /** Related appointment ID */
  appointmentId:  string;
  
  /** Patient ID */
  patientId:  string;
  
  /** Provider ID */
  providerId: string;
  
  /** Session type */
  sessionType: 'video' | 'audio' | 'chat';
  
  /** Session status */
  status: TelemedicineSessionStatus;
  
  /** Channel name for video SDK (Jitsi) */
  channelName:  string;
  
  /** Session token */
  sessionToken: string;
  
  /** Video SDK app ID */
  videoSdkAppId?:  string;
  
  /** Video SDK token */
  videoSdkToken?: string;
  
  /** Whether recording is enabled */
  recordingEnabled: boolean;
  
  /** Recording consent given */
  recordingConsent:  boolean;
  
  /** Recording URL (after session ends) */
  recordingUrl?: string;
  
  /** Scheduled start time */
  scheduledStartTime:  Date;
  
  /** Actual start time */
  actualStartTime?:  Date;
  
  /** End time */
  endTime?: Date;
  
  /** Duration in seconds */
  duration?:  number;
  
  /** Connection quality metrics */
  qualityMetrics?: ConnectionQualityMetrics;
  
  /** Chat messages during session */
  chatMessages?: TelemedicineChatMessage[];
  
  /** Files shared during session */
  sharedFiles?: TelemedicineSharedFile[];
  
  /** Session notes */
  notes?: string;
  
  /** Technical issues encountered */
  technicalIssues?: string[];
}

/**
 * Connection quality metrics
 */
export interface ConnectionQualityMetrics {
  /** Patient's connection quality */
  patientQuality: ConnectionQuality;
  
  /** Provider's connection quality */
  providerQuality: ConnectionQuality;
  
  /** Average latency (ms) */
  averageLatency?:  number;
  
  /** Packet loss percentage */
  packetLoss?:  number;
  
  /** Video resolution achieved */
  videoResolution?: string;
  
  /** Audio quality score (1-5) */
  audioQuality?:  number;
  
  /** Video quality score (1-5) */
  videoQuality?: number;
  
  /** Number of reconnection attempts */
  reconnectionAttempts?: number;
}

/**
 * Chat message during telemedicine session
 */
export interface TelemedicineChatMessage {
  id: string;
  senderId: string;
  senderType: 'patient' | 'provider';
  message: string;
  timestamp: Date;
  read: boolean;
}

/**
 * File shared during telemedicine session
 */
export interface TelemedicineSharedFile {
  id:  string;
  fileName: string;
  fileType: string;
  fileSize: number;
  uploadedBy: string;
  uploadedAt: Date;
  url:  string;
}

/**
 * Pre-consultation questionnaire response
 */
export interface PreConsultationQuestionnaire {
  /** Questionnaire ID */
  questionnaireId: string;
  
  /** Appointment ID */
  appointmentId:  string;
  
  /** Patient ID */
  patientId:  string;
  
  /** Responses */
  responses: QuestionnaireResponse[];
  
  /** Completed at */
  completedAt:  Date;
  
  /** Time taken to complete (seconds) */
  timeTaken?: number;
}

/**
 * Questionnaire response
 */
export interface QuestionnaireResponse {
  questionId: string;
  questionText: string;
  questionType: 'text' | 'single_choice' | 'multiple_choice' | 'scale' | 'boolean' | 'date';
  answer:  string | string[] | number | boolean | Date;
}

/**
 * Virtual waiting room entry
 */
export interface VirtualWaitingRoomEntry {
  /** Entry ID */
  id: string;
  
  /** Session ID */
  sessionId: string;
  
  /** Patient ID */
  patientId: string;
  
  /** Patient name */
  patientName:  string;
  
  /** Appointment time */
  appointmentTime: Date;
  
  /** Check-in time */
  checkInTime: Date;
  
  /** Position in queue */
  queuePosition: number;
  
  /** Estimated wait time (minutes) */
  estimatedWaitTime: number;
  
  /** Connection test completed */
  connectionTestCompleted: boolean;
  
  /** Connection test results */
  connectionTestResults?:  {
    cameraWorking: boolean;
    microphoneWorking: boolean;
    speakerWorking: boolean;
    internetSpeed: number;
    meetsMinimumRequirements: boolean;
  };
  
  /** Pre-consultation questionnaire completed */
  questionnaireCompleted: boolean;
  
  /** Documents uploaded */
  documentsUploaded: string[];
}
