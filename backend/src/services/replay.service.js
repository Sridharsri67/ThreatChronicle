const Event = require('../models/Event');
const ThreatState = require('../models/ThreatState');
const AuditRecord = require('../models/AuditRecord');
const { reconstructThreatState } = require('../engine/stateMachine');

/**
 * Replay Engine Service for ThreatChronicle
 * Reconstructs state from scratch based purely on historical event streams
 * and compares it against stored materialized decisions.
 */

async function replayThreat(threatId) {
  // 1. Fetch all events for threatId
  const rawEvents = await Event.find({ threatId }).lean();
  if (!rawEvents || rawEvents.length === 0) {
    return {
      match: false,
      error: `No events found for threatId '${threatId}'`,
      threatId
    };
  }

  // 2. Fetch stored materialized threat state and audit records
  const storedState = await ThreatState.findOne({ threatId }).lean();
  const latestAudit = await AuditRecord.findOne({ threatId }).sort({ stateVersion: -1 }).lean();

  if (!storedState) {
    return {
      match: false,
      error: `No stored threat state found for threatId '${threatId}'`,
      threatId
    };
  }

  // 3. Reconstruct state purely from raw events
  const { materializedState, auditRecord, orderedEvents, conflictResult } = reconstructThreatState(threatId, rawEvents);

  // 4. Compare replayed output vs stored state
  const decisionMatch = materializedState.decision === storedState.decision;
  const fingerprintMatch = materializedState.decisionFingerprint === storedState.decisionFingerprint;
  const confidenceMatch = Math.abs(materializedState.confidence - storedState.confidence) < 0.001;

  const isVerifiedMatch = decisionMatch && fingerprintMatch;

  return {
    threatId,
    match: isVerifiedMatch,
    verificationStatus: isVerifiedMatch ? 'VERIFIED_MATCH' : 'MISMATCH',
    stored: {
      version: storedState.version,
      decision: storedState.decision,
      confidence: storedState.confidence,
      fingerprint: storedState.decisionFingerprint,
      ruleVersion: storedState.ruleVersion
    },
    replayed: {
      decision: materializedState.decision,
      confidence: materializedState.confidence,
      fingerprint: materializedState.decisionFingerprint,
      ruleVersion: materializedState.ruleVersion,
      totalEvents: orderedEvents.length
    },
    comparison: {
      decisionMatch,
      fingerprintMatch,
      confidenceMatch
    },
    conflictResolution: conflictResult,
    replayAudit: auditRecord,
    replayedAt: new Date()
  };
}

module.exports = {
  replayThreat
};
