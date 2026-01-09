/**
 * Geographic location
 */
export interface GeoLocation {
  /** Latitude */
  latitude: number;
  
  /** Longitude */
  longitude: number;
  
  /** Accuracy in meters */
  accuracy?: number;
  
  /** Altitude in meters */
  altitude?: number;
  
  /** Heading in degrees */
  heading?: number;
  
  /** Speed in meters per second */
  speed?: number;
  
  /** Timestamp */
  timestamp?:  Date;
}

/**
 * What3Words location
 */
export interface What3WordsLocation {
  /** Three word address */
  words: string;
  
  /** Coordinates */
  coordinates:  {
    latitude: number;
    longitude: number;
  };
}

/**
 * Calculate distance between two points (Haversine formula)
 * @returns Distance in kilometers
 */
export function calculateDistance(
  point1: GeoLocation,
  point2: GeoLocation,
): number {
  const R = 6371; // Earth's radius in kilometers
  
  const dLat = toRadians(point2.latitude - point1.latitude);
  const dLon = toRadians(point2.longitude - point1.longitude);
  
  const a =
    Math.sin(dLat / 2) * Math.sin(dLat / 2) +
    Math.cos(toRadians(point1.latitude)) *
      Math.cos(toRadians(point2.latitude)) *
      Math.sin(dLon / 2) *
      Math.sin(dLon / 2);
  
  const c = 2 * Math. atan2(Math. sqrt(a), Math.sqrt(1 - a));
  
  return R * c;
}

function toRadians(degrees: number): number {
  return degrees * (Math.PI / 180);
}
