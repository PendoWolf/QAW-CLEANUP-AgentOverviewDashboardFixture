// Pendo Track Events. The Pendo agent attaches the visitor and account to every event,
// so they are never passed as properties.
export type TrackEventProperties = Record<string, string | number | boolean | string[] | undefined>;

interface PendoAgent {
  track: (eventName: string, properties?: TrackEventProperties) => void;
}

declare global {
  interface Window {
    pendo?: PendoAgent;
  }
}

/** Sends a Pendo Track Event. Does nothing if the Pendo agent is not loaded, and never throws. */
export function trackEvent(eventName: string, properties: TrackEventProperties = {}): void {
  try {
    window.pendo?.track(eventName, properties);
  } catch (e) {
    console.warn(`Pendo track event "${eventName}" failed`, e);
  }
}

const DAY_MS = 24 * 60 * 60 * 1000;

/** Milliseconds since epoch (UTC midnight) of a `YYYY-MM-DD` date, as the trip form sends it. */
function utcDay(date: string): number {
  const [year, month, day] = date.split("-").map(Number);
  return Date.UTC(year, month - 1, day);
}

/** The number of days a trip lasts, counting its start and end dates. */
export function tripLengthDays(startDate: string, endDate: string): number {
  return Math.round((utcDay(endDate) - utcDay(startDate)) / DAY_MS) + 1;
}

/** Days from today (local date) until the trip starts; negative once it has started. */
export function daysUntilStart(startDate: string): number {
  const now = new Date();
  const today = Date.UTC(now.getFullYear(), now.getMonth(), now.getDate());
  return Math.round((utcDay(startDate) - today) / DAY_MS);
}
