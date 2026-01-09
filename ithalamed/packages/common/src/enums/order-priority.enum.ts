/**
 * Priority levels for orders (lab, imaging, etc.)
 */
export enum OrderPriority {
  /** Routine - normal processing time */
  ROUTINE = 'routine',
  
  /** Urgent - prioritized processing */
  URGENT = 'urgent',
  
  /** STAT - immediate processing required */
  STAT = 'stat',
  
  /** Timed - must be done at specific time */
  TIMED = 'timed',
}
