/**
 * Physical address structure
 */
export interface Address {
  /** Street address line 1 */
  street: string;
  
  /** Street address line 2 (optional) */
  street2?: string;
  
  /** Suburb or neighborhood */
  suburb?: string;
  
  /** City or town */
  city:  string;
  
  /** State or province */
  province:  string;
  
  /** Postal/ZIP code */
  postalCode: string;
  
  /** Country code (ISO 3166-1 alpha-2) */
  country: string;
  
  /** GPS coordinates (optional) */
  coordinates?: {
    latitude: number;
    longitude: number;
  };
}

/**
 * South African provinces
 */
export enum SouthAfricanProvince {
  EASTERN_CAPE = 'Eastern Cape',
  FREE_STATE = 'Free State',
  GAUTENG = 'Gauteng',
  KWAZULU_NATAL = 'KwaZulu-Natal',
  LIMPOPO = 'Limpopo',
  MPUMALANGA = 'Mpumalanga',
  NORTHERN_CAPE = 'Northern Cape',
  NORTH_WEST = 'North West',
  WESTERN_CAPE = 'Western Cape',
}

/**
 * Format address as single string
 */
export function formatAddress(address: Address): string {
  const parts = [
    address. street,
    address.street2,
    address.suburb,
    address.city,
    address.province,
    address.postalCode,
    address.country,
  ].filter(Boolean);
  
  return parts.join(', ');
}
