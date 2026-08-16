const { deterministicSort } = require('./ordering');
const { resolveConflicts } = require('./resolver');
const { evaluateThreatState, RULE_VERSION } = require('./rules');
const { generateDecisionFingerprint } = require('../utils/fingerprint');

/**
 * State Machine & Reconstructor for ThreatChronicle
 * Rebuilds state deterministically from raw events.
 */

function reconstructThreatState(threatId, rawEvents, previousState = null, triggerEvent = null) {
  if (!rawEvents || rawEvents.length === 0) {
    throw new Error(`Cannot reconstruct state for threat ${threatId}: No events provided`);
  }

  // 1. Order all events deterministically
  const orderedEvents = deterministicSort(rawEvents);

  // 2. Identify firstSeen and lastEventTime
  const firstSeen = new Date(orderedEvents[0].timestamp);
  const lastEventTime = new Date(orderedEvents[orderedEvents.length - 1].timestamp);
  const lastEventReceivedAt = new Date(Math.max(...orderedEvents.map(e => new Date(e.receivedAt || e.timestamp).getTime())));

  // 3. Flag late/out-of-order events
  // An event is late if its occurrence timestamp is strictly earlier than an event received prior to it
  const evidenceList = orderedEvents.map(evt => {
    let isLate = false;
    if (triggerEvent && evt.eventId === triggerEvent.eventId) {
      // Check if trigger event's occurrence time is earlier than previously received event times
      if (previousState && previousState.lastEventTime && new Date(evt.timestamp) < new Date(previousState.lastEventTime)) {
        isLate = true;
      }
    }
    return {
      eventId: evt.eventId,
      fingerprint: evt.fingerprint,
      source: evt.source,
      timestamp: evt.timestamp,
      receivedAt: evt.receivedAt,
      type: evt.type,
      threatLevel: evt.threatLevel,
      confidence: evt.confidence,
      isLate: isLate || false,
      normalizedData: evt.normalizedData
    };
  });

  // 4. Resolve conflicts
  const conflictResult = resolveConflicts(orderedEvents);

  // 5. Evaluate state rules
  const evaluation = evaluateThreatState(orderedEvents, conflictResult.winningCandidate);

  // 6. Generate decision fingerprint
  const decisionFingerprint = generateDecisionFingerprint(
    orderedEvents,
    evaluation.ruleVersion,
    evaluation.decision,
    evaluation.confidence
  );

  // 7. Calculate state version transition
  const previousVersion = previousState ? previousState.version : 0;
  const previousDecision = previousState ? previousState.decision : 'NONE';
  const stateVersion = previousVersion + 1;
  const decisionChanged = previousState ? previousState.decision !== evaluation.decision : true;

  const triggerIsLate = triggerEvent ? (previousState && previousState.lastEventTime && new Date(triggerEvent.timestamp) < new Date(previousState.lastEventTime)) : false;

  let changeReason = `State initialized at version v1`;
  if (previousState) {
    if (triggerIsLate) {
      changeReason = `Historical late-arriving event (${triggerEvent.source} @ ${new Date(triggerEvent.timestamp).toISOString()}) reconstructed timeline`;
    } else if (decisionChanged) {
      changeReason = `Decision shifted from ${previousDecision} to ${evaluation.decision} based on new ${triggerEvent ? triggerEvent.source : 'event'} evidence`;
    } else {
      changeReason = `New evidence appended; decision retained at ${evaluation.decision}`;
    }
  }

  // Materialized State Object
  const materializedState = {
    threatId,
    version: stateVersion,
    decision: evaluation.decision,
    confidence: evaluation.confidence,
    score: evaluation.score,
    winningEvidence: conflictResult.winningCandidate ? {
      source: conflictResult.winningCandidate.source,
      eventId: conflictResult.winningCandidate.eventId,
      threatLevel: conflictResult.winningCandidate.threatLevel,
      confidence: conflictResult.winningCandidate.confidence
    } : null,
    evidence: evidenceList,
    totalEvents: orderedEvents.length,
    firstSeen,
    lastEventTime,
    lastEventReceivedAt,
    decisionFingerprint,
    ruleVersion: evaluation.ruleVersion
  };

  // Audit Record Object
  const auditRecord = {
    threatId,
    stateVersion,
    decision: evaluation.decision,
    confidence: evaluation.confidence,
    triggerEventId: triggerEvent ? triggerEvent.eventId : orderedEvents[orderedEvents.length - 1].eventId,
    triggerEventSource: triggerEvent ? triggerEvent.source : orderedEvents[orderedEvents.length - 1].source,
    triggerEventIsLate: triggerIsLate || false,
    eventIds: orderedEvents.map(e => e.eventId),
    totalEventsConsidered: orderedEvents.length,
    resolutionSteps: conflictResult.resolutionSteps,
    rulesApplied: evaluation.rulesApplied,
    previousDecision,
    previousVersion,
    changed: decisionChanged,
    changeReason,
    replayFingerprint: decisionFingerprint,
    ruleVersion: evaluation.ruleVersion
  };

  return {
    materializedState,
    auditRecord,
    orderedEvents,
    evaluation,
    conflictResult
  };
}

module.exports = {
  reconstructThreatState
};
