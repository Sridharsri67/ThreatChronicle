const Event = require('../models/Event');
const ThreatState = require('../models/ThreatState');
const AuditRecord = require('../models/AuditRecord');
const { canonicalizeEvent } = require('../utils/canonicalize');
const { generateEventFingerprint } = require('../utils/fingerprint');
const { reconstructThreatState } = require('../engine/stateMachine');

/**
 * Event Ingestion Service
 * Ingests, normalizes, deduplicates, and processes events to update threat states.
 */

async function ingestEvent(rawPayload) {
  // 1. Normalize raw event
  const canonical = canonicalizeEvent(rawPayload);

  // 2. Generate unique fingerprint
  const fingerprint = generateEventFingerprint(canonical);
  canonical.fingerprint = fingerprint;

  // 3. Deduplication check
  const existingEvent = await Event.findOne({ fingerprint });
  if (existingEvent) {
    // Duplicate detected - return early without altering state
    const currentThreatState = await ThreatState.findOne({ threatId: canonical.threatId });
    return {
      accepted: false,
      duplicate: true,
      eventId: existingEvent.eventId,
      fingerprint: existingEvent.fingerprint,
      threatId: canonical.threatId,
      stateVersion: currentThreatState ? currentThreatState.version : 1,
      decision: currentThreatState ? currentThreatState.decision : 'MONITOR',
      message: 'Duplicate event ignored; state unchanged'
    };
  }

  // 4. Save new immutable event
  const savedEvent = await Event.create(canonical);

  // 5. Fetch all historical events for this threatId
  const allThreatEvents = await Event.find({ threatId: canonical.threatId }).lean();

  // 6. Fetch existing materialized state
  const existingState = await ThreatState.findOne({ threatId: canonical.threatId }).lean();

  // 7. Reconstruct threat state deterministically
  const { materializedState, auditRecord } = reconstructThreatState(
    canonical.threatId,
    allThreatEvents,
    existingState,
    savedEvent
  );

  // 8. Atomic database update for materialized state and audit record
  const updatedState = await ThreatState.findOneAndUpdate(
    { threatId: canonical.threatId },
    materializedState,
    { upsert: true, new: true, setDefaultsOnInsert: true }
  );

  const savedAudit = await AuditRecord.create(auditRecord);

  return {
    accepted: true,
    duplicate: false,
    eventId: savedEvent.eventId,
    fingerprint: savedEvent.fingerprint,
    threatId: canonical.threatId,
    stateVersion: updatedState.version,
    decision: updatedState.decision,
    confidence: updatedState.confidence,
    isLate: auditRecord.triggerEventIsLate,
    decisionChanged: auditRecord.changed,
    decisionFingerprint: updatedState.decisionFingerprint,
    auditId: savedAudit._id
  };
}

module.exports = {
  ingestEvent
};
