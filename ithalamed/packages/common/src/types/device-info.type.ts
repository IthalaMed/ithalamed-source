/**
 * Device information for session tracking
 */
export interface DeviceInfo {
  /** Unique device identifier */
  deviceId?:  string;
  
  /** Device type */
  deviceType?: 'mobile' | 'tablet' | 'web' | 'desktop';
  
  /** Operating system/Platform */
  platform?: 'ios' | 'android' | 'web' | 'windows' | 'macos' | 'linux';
  
  /** OS version */
  osVersion?: string;
  
  /** Application version */
  appVersion?: string;
  
  /** Device model (e.g., "iPhone 14 Pro") */
  deviceModel?: string;
  
  /** Device manufacturer */
  manufacturer?: string;
  
  /** Push notification token */
  pushToken?: string;
  
  /** Whether biometrics are enabled on device */
  biometricsEnabled?: boolean;
  
  /** Browser name (for web) */
  browser?: string;
  
  /** Browser version (for web) */
  browserVersion?:  string;
}
