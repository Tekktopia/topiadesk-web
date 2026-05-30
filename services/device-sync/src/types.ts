/**
 * Internal event types. All provider-specific webhook payloads get normalised
 * into one of these before they hit the queue.
 */

export type ProviderId = 'entra' | 'google' | 'intune' | 'jamf' | 'kandji';

export interface DeviceFingerprint {
  /** Provider-side stable id (Graph deviceId, Google deviceId, Jamf computer id, …) */
  providerDeviceId: string;
  /** Manufacturer serial */
  serial?:        string;
  /** OS-level hostname */
  hostname?:      string;
  /** Model name as the provider reports it */
  model?:         string;
  /** OS family + version */
  os?:            string;
  /** ISO timestamp of the event causing this fingerprint */
  observedAt:     string;
}

/** The unit of work consumed by the reconciliation worker. */
export interface RawSignal {
  id:           string;               // dedupe key
  providerId:   ProviderId;
  tenantId:     string;               // Topiadesk tenant
  userEmail:    string;
  userDisplayName?: string;
  device:       DeviceFingerprint;
  /** What the provider says happened */
  kind:         'sign-in' | 'device-added' | 'primary-user-changed' | 'device-removed' | 'compliance-failed';
  receivedAt:   string;
  rawPayload:   unknown;
}

export interface ReconciliationOutcome {
  signalId:     string;
  tenantId:     string;
  decision:     'no-change' | 'inbox-entry-created' | 'auto-approved' | 'ignored-by-policy';
  inboxEntryId?: string;
  assetIdBefore?: string;
  assetIdAfter?:  string;
  notes?:       string;
}
