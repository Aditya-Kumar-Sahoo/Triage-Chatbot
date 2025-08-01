/**
 * Shared code between client and server
 * Useful to share types between client and server
 * and/or small pure JS functions that can be used on both client and server
 */

/**
 * Example response type for /api/demo
 */
export interface DemoResponse {
  message: string;
}

/**
 * Triage prediction response type for /api/triage
 */
export interface TriageResponse {
  category: "Red" | "Orange" | "Yellow" | "Green" | "Black";
  severity: 0 | 1 | 2 | 3 | 4;
  emoji: string;
  description: string;
}

/**
 * Triage prediction request type for /api/triage
 */
export interface TriageRequest {
  symptoms: string;
}
