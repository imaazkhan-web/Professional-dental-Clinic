import "server-only";

// In-memory rate limiting map: IP -> array of request timestamps (epoch ms)
const ipRequests = new Map<string, number[]>();

const WINDOW_MS = 5 * 60 * 1000; // 5 minutes
const MAX_REQUESTS = 3;

/**
 * Checks if a given IP has exceeded the allowed request limit (3 requests per 5 minutes).
 * Returns true if allowed, false if limit exceeded.
 */
export function checkIpRateLimit(ip: string): boolean {
  const now = Date.now();
  const timestamps = ipRequests.get(ip) || [];

  // Keep only timestamps within the current rolling window
  const activeTimestamps = timestamps.filter(
    (timestamp) => now - timestamp < WINDOW_MS
  );

  if (activeTimestamps.length >= MAX_REQUESTS) {
    ipRequests.set(ip, activeTimestamps);
    return false;
  }

  activeTimestamps.push(now);
  ipRequests.set(ip, activeTimestamps);

  // Periodic cleanup if the map has grown large
  if (ipRequests.size > 500) {
    for (const [storedIp, list] of ipRequests.entries()) {
      const remaining = list.filter((t) => now - t < WINDOW_MS);
      if (remaining.length === 0) {
        ipRequests.delete(storedIp);
      } else {
        ipRequests.set(storedIp, remaining);
      }
    }
  }

  return true;
}

