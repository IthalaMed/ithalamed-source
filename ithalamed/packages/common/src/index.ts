// ==================== RE-EXPORT ALL SHARED TYPES ====================
// This allows backend services to import everything from @ithalamed/common
export * from '@ithalamed/shared-types';

// ==================== NESTJS-SPECIFIC EXPORTS ====================

// Guards
export * from './nestjs/guards';

// Decorators
export * from './nestjs/decorators';

// Strategies
export * from './nestjs/strategies';

// Filters
export * from './nestjs/filters';

// Interceptors
export * from './nestjs/interceptors';

// Pipes (if any)
// export * from './nestjs/pipes';

// ==================== UTILITIES ====================
export * from './utils';

// ==================== HELPERS ====================
// Medical Aid scheme name helper
export function getMedicalAidSchemeName(scheme: string): string {
  const schemeNames:  Record<string, string> = {
    discovery: 'Discovery Health',
    momentum: 'Momentum Health',
    bonitas: 'Bonitas Medical Fund',
    medshield: 'Medshield Medical Scheme',
    gems: 'Government Employees Medical Scheme',
    fedhealth: 'Fedhealth Medical Scheme',
    bestmed: 'Bestmed Medical Scheme',
    profmed: 'Profmed',
    medihelp: 'Medihelp',
    polmed: 'POLMED',
    bankmed:  'Bankmed',
    sizwe: 'Sizwe Medical Fund',
    samwumed:  'SAMWUMED',
    hosmed: 'Hosmed Medical Aid',
    keyhealth: 'KeyHealth',
    liberty: 'Liberty Medical Scheme',
    other: 'Other',
  };
  return schemeNames[scheme] || scheme;
}
