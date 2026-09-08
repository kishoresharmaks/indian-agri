import { getLicensingServerUrl, getConfiguredLicenseKey } from './licenseClient';

const HEARTBEAT_INTERVAL_MS = 5 * 60 * 1000; // 5 minutes

interface HeartbeatResult {
  success: boolean;
  isAlive: boolean;
  status?: string;
  daysRemaining?: number;
  validUntil?: string;
  message?: string;
}

let heartbeatIntervalId: ReturnType<typeof setInterval> | null = null;

/**
 * Sends a heartbeat ping to the licensing server.
 * Updates lastPingAt on the server and returns current license status.
 */
export async function sendLicenseHeartbeat(token?: string, licenseKeyOverride?: string): Promise<HeartbeatResult> {
  const serverUrl = getLicensingServerUrl();
  const licenseKey = (licenseKeyOverride || getConfiguredLicenseKey()).trim().toUpperCase();

  if (!serverUrl) {
    // No licensing server configured — skip heartbeat
    return { success: false, isAlive: false, message: 'No licensing server configured.' };
  }

  if (!licenseKey) {
    return { success: false, isAlive: false, message: 'No license key configured.' };
  }

  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 10000); // 10s timeout

    const response = await fetch(`${serverUrl}/api/license/heartbeat`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ licenseKey, token }),
      signal: controller.signal,
    });

    clearTimeout(timeoutId);

    if (!response.ok) {
      return {
        success: false,
        isAlive: false,
        message: `License server returned ${response.status}`,
      };
    }

    const data = await response.json();
    return {
      success: data.success ?? false,
      isAlive: data.isAlive ?? false,
      status: data.status,
      daysRemaining: data.daysRemaining,
      validUntil: data.validUntil,
      message: data.message,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : 'Unknown error';
    return { success: false, isAlive: false, message };
  }
}

/**
 * Starts the periodic license heartbeat.
 * Runs every HEARTBEAT_INTERVAL_MS milliseconds.
 * Stops any previously running heartbeat first.
 */
export function startLicenseHeartbeat(token?: string, licenseKeyOverride?: string): () => void {
  if (heartbeatIntervalId !== null) {
    clearInterval(heartbeatIntervalId);
  }

  // Send an immediate heartbeat on start
  sendLicenseHeartbeat(token, licenseKeyOverride).catch((err) =>
    console.error('License heartbeat failed:', err)
  );

  heartbeatIntervalId = setInterval(
    () => {
      sendLicenseHeartbeat(token, licenseKeyOverride).catch((err) =>
        console.error('License heartbeat failed:', err)
      );
    },
    HEARTBEAT_INTERVAL_MS
  );

  // Return a stop function for React useEffect cleanup
  return () => {
    stopLicenseHeartbeat();
  };
}

/**
 * Stops the periodic license heartbeat.
 */
export function stopLicenseHeartbeat(): void {
  if (heartbeatIntervalId !== null) {
    clearInterval(heartbeatIntervalId);
    heartbeatIntervalId = null;
  }
}

/**
 * API route handler for /api/license/heartbeat.
 * This is a relay endpoint on the client app that forwards the heartbeat
 * to the standalone licensing server.
 *
 * Protected routes can call this on each request to verify the license
 * is still active before serving data.
 */
export async function licenseHeartbeatHandler(token?: string): Promise<{
  valid: boolean;
  status?: string;
  daysRemaining?: number;
  message?: string;
}> {
  const result = await sendLicenseHeartbeat(token);

  if (!result.success || !result.isAlive) {
    return {
      valid: false,
      status: result.status,
      daysRemaining: result.daysRemaining,
      message: result.message,
    };
  }

  return {
    valid: true,
    status: result.status,
    daysRemaining: result.daysRemaining,
    message: result.message,
  };
}
