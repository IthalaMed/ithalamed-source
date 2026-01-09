/**
 * Emergency Severity Index (ESI) Triage Levels
 */
export enum TriageLevel {
  /** Level 1: Resuscitation - Immediate life-saving intervention */
  RESUSCITATION = 1,
  
  /** Level 2: Emergent - High risk, time sensitive */
  EMERGENT = 2,
  
  /** Level 3: Urgent - Stable but needs timely care */
  URGENT = 3,
  
  /** Level 4: Less Urgent - Can wait 1-2 hours */
  LESS_URGENT = 4,
  
  /** Level 5: Non-urgent - Can wait or be referred elsewhere */
  NON_URGENT = 5,
}

/**
 * Get maximum wait time in minutes for triage level
 */
export function getTriageMaxWaitTime(level: TriageLevel): number {
  const waitTimes: Record<TriageLevel, number> = {
    [TriageLevel.RESUSCITATION]: 0,
    [TriageLevel. EMERGENT]: 10,
    [TriageLevel. URGENT]: 30,
    [TriageLevel.LESS_URGENT]: 60,
    [TriageLevel. NON_URGENT]: 120,
  };
  return waitTimes[level];
}

/**
 * Get triage level color for UI
 */
export function getTriageLevelColor(level: TriageLevel): string {
  const colors: Record<TriageLevel, string> = {
    [TriageLevel.RESUSCITATION]: '#FF0000', // Red
    [TriageLevel. EMERGENT]: '#FF6600', // Orange
    [TriageLevel.URGENT]:  '#FFFF00', // Yellow
    [TriageLevel.LESS_URGENT]: '#00FF00', // Green
    [TriageLevel.NON_URGENT]: '#0000FF', // Blue
  };
  return colors[level];
}
