export type Environment = 'development' | 'staging' | 'production';

export interface ApiConfig {
  baseURL: string;
  timeout: number;
  headers: Record<string, string>;
}

export const API_URLS: Record<Environment, string> = {
  development: 'http://localhost:3000/api/v1',
  staging: 'https://api-staging.ithalamed.com/api/v1',
  production: 'https://api.ithalamed.com/api/v1',
};

export const DEFAULT_API_CONFIG:  Omit<ApiConfig, 'baseURL'> = {
  timeout: 30000,
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
};

export function createApiConfig(env: Environment): ApiConfig {
  return {
    ... DEFAULT_API_CONFIG,
    baseURL: API_URLS[env],
  };
}

export const ENDPOINTS = {
  auth: {
    login: '/auth/login',
    loginWithPin: '/auth/login/pin',
    loginWithBiometric: '/auth/login/biometric',
    register: '/auth/register',
    logout: '/auth/logout',
    logoutAll: '/auth/logout/all',
    refresh: '/auth/refresh',
    me: '/auth/me',
    sendOtp: '/auth/otp/send',
    verifyOtp: '/auth/otp/verify',
    resendOtp: '/auth/otp/resend',
    forgotPassword: '/auth/password/forgot',
    resetPassword:  '/auth/password/reset',
    changePassword: '/auth/password/change',
    setPin: '/auth/pin/set',
    enableMfa: '/auth/mfa/enable',
    verifyMfaSetup: '/auth/mfa/verify-setup',
    verifyMfa: '/auth/mfa/verify',
    disableMfa:  '/auth/mfa/disable',
  },
  patients: {
    me: '/patients/me',
    byId: (id: string) => `/patients/${id}`,
    byNumber: (number: string) => `/patients/by-number/${number}`,
    byPhone: (phone: string) => `/patients/by-phone/${phone}`,
    search: '/patients/search',
    allergies: (patientId: string) => `/patients/${patientId}/allergies`,
    allergyById: (patientId: string, id: string) => `/patients/${patientId}/allergies/${id}`,
    emergencyContacts: (patientId: string) => `/patients/${patientId}/emergency-contacts`,
    emergencyContactById: (patientId: string, id: string) => `/patients/${patientId}/emergency-contacts/${id}`,
    medicalAid: (patientId: string) => `/patients/${patientId}/medical-aid`,
    medicalAidById: (patientId: string, id: string) => `/patients/${patientId}/medical-aid/${id}`,
    chronicConditions: (patientId: string) => `/patients/${patientId}/chronic-conditions`,
    chronicConditionById: (patientId: string, id: string) => `/patients/${patientId}/chronic-conditions/${id}`,
    consents: (patientId: string) => `/patients/${patientId}/consents`,
    documents: (patientId: string) => `/patients/${patientId}/documents`,
    documentById: (patientId: string, id:  string) => `/patients/${patientId}/documents/${id}`,
  },
  appointments: {
    list: '/appointments',
    byId: (id: string) => `/appointments/${id}`,
    upcoming: '/appointments/upcoming',
    past: '/appointments/past',
    today: '/appointments/today',
    book: '/appointments',
    cancel: (id: string) => `/appointments/${id}/cancel`,
    reschedule: (id: string) => `/appointments/${id}/reschedule`,
    checkIn: (id: string) => `/appointments/${id}/check-in`,
    confirm: (id: string) => `/appointments/${id}/confirm`,
  },
  providers: {
    list: '/providers',
    byId: (id: string) => `/providers/${id}`,
    search: '/providers/search',
    specializations: '/providers/specializations',
    availability: (id: string) => `/providers/${id}/availability`,
    slots: (id: string) => `/providers/${id}/slots`,
  },
  facilities: {
    list: '/facilities',
    byId: (id: string) => `/facilities/${id}`,
    search: '/facilities/search',
    nearby: '/facilities/nearby',
  },
};
