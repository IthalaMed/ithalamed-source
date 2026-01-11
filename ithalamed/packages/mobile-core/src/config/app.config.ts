export interface AppConfig {
  appName: string;
  version: string;
  primaryColor: string;
  secondaryColor: string;
  sessionTimeout: number;
  otpLength: number;
  pinLength: number;
  minPasswordLength: number;
  maxLoginAttempts: number;
  lockoutDuration: number;
  defaultPageSize: number;
  maxPageSize: number;
  support: {
    email: string;
    phone: string;
    whatsapp: string;
    website: string;
  };
  emergency: {
    ambulance: string;
    police: string;
    fire: string;
  };
  supportedLanguages: Array<{
    code: string;
    name: string;
    nativeName: string;
  }>;
  defaultLanguage: string;
}

export const DEFAULT_APP_CONFIG: AppConfig = {
  appName: 'IthalaMed',
  version: '1.0.0',
  primaryColor: '#0891b2',
  secondaryColor: '#6366f1',
  sessionTimeout:  15 * 60 * 1000,
  otpLength: 6,
  pinLength: 4,
  minPasswordLength: 8,
  maxLoginAttempts: 5,
  lockoutDuration:  30 * 60 * 1000,
  defaultPageSize:  20,
  maxPageSize: 100,
  support: {
    email: 'support@ithalamed.com',
    phone: '+27 60 206 2762',
    whatsapp: '+27602062762',
    website: 'https://ithalamed.com',
  },
  emergency:  {
    ambulance: '10177',
    police: '10111',
    fire: '10177',
  },
  supportedLanguages: [
    { code: 'en', name: 'English', nativeName: 'English' },
    { code: 'zu', name: 'Zulu', nativeName: 'isiZulu' },
    { code: 'xh', name: 'Xhosa', nativeName: 'isiXhosa' },
    { code: 'af', name: 'Afrikaans', nativeName: 'Afrikaans' },
    { code: 'st', name: 'Sotho', nativeName: 'Sesotho' },
  ],
  defaultLanguage: 'en',
};
