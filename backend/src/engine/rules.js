/**
 * Centralized Rules Engine for ThreatChronicle
 * Rule Version: v1.0
 * 
 * Determines final threat decision ('BLOCKED', 'SUSPICIOUS', 'MONITOR', 'CLEAN')
 * based on weighted evidence, source reliability, and conflict resolution results.
 */

const RULE_VERSION = 'v1.0';

const THREAT_LEVEL_WEIGHTS = {
  critical: 1.0,
  high: 0.85,
  medium: 0.5,
  low: 0.2,
  clean: 0.0,
  unknown: 0.1
};

const SOURCE_WEIGHTS = {
  alienvault: 1.0,
  virus_total: 0.8,
  edr: 0.85,
  ai_report: 0.6,
  generic: 0.5
};

function evaluateThreatState(orderedEvents, winningCandidate = null) {
  if (!orderedEvents || orderedEvents.length === 0) {
    return {
      decision: 'CLEAN',
      confidence: 0,
      score: 0,
      rulesApplied: ['RULE_NO_EVENTS_DEFAULT_CLEAN'],
      ruleVersion: RULE_VERSION
    };
  }

  const rulesApplied = [];
  rulesApplied.push(`RULE_VERSION_${RULE_VERSION}`);

  // Determine winning candidate if not explicitly provided
  let topEvidence = winningCandidate;
  if (!topEvidence) {
    // Primary evidence is the highest reliability source or latest event
    topEvidence = orderedEvents[orderedEvents.length - 1];
  }

  // Calculate weighted threat score across evidence set
  let totalWeightedScore = 0;
  let totalWeight = 0;
  let hasCriticalOrHigh = false;
  let hasActiveCleanSignal = false;

  orderedEvents.forEach(evt => {
    const levelWeight = THREAT_LEVEL_WEIGHTS[evt.threatLevel] !== undefined ? THREAT_LEVEL_WEIGHTS[evt.threatLevel] : 0.1;
    const sourceWeight = SOURCE_WEIGHTS[evt.source] !== undefined ? SOURCE_WEIGHTS[evt.source] : 0.5;
    const confidence = Number(evt.confidence) || 0.5;

    if (evt.threatLevel === 'critical' || evt.threatLevel === 'high') {
      hasCriticalOrHigh = true;
    }
    if (evt.threatLevel === 'clean') {
      hasActiveCleanSignal = true;
    }

    const weight = sourceWeight * confidence;
    totalWeightedScore += levelWeight * weight;
    totalWeight += weight;
  });

  const aggregateScore = totalWeight > 0 ? (totalWeightedScore / totalWeight) : 0;

  let decision = 'MONITOR';
  
  // Rule Logic:
  // If AlienVault or high-ranking source explicitly marks 'high' or 'critical' with confidence >= 0.7 -> BLOCKED
  if (topEvidence && (topEvidence.source === 'alienvault' || topEvidence.source === 'edr') && (topEvidence.threatLevel === 'high' || topEvidence.threatLevel === 'critical') && topEvidence.confidence >= 0.7) {
    decision = 'BLOCKED';
    rulesApplied.push('RULE_HIGH_RELIABILITY_PRIMARY_IOC_BLOCK');
  } else if (aggregateScore >= 0.70 || (hasCriticalOrHigh && topEvidence.threatLevel !== 'clean')) {
    decision = 'BLOCKED';
    rulesApplied.push('RULE_AGGREGATE_SCORE_THRESHOLD_BLOCK');
  } else if (hasActiveCleanSignal && topEvidence.threatLevel === 'clean' && (topEvidence.source === 'alienvault' || topEvidence.source === 'virus_total')) {
    decision = 'CLEAN';
    rulesApplied.push('RULE_PRIMARY_SOURCE_CLEAN_OVERRIDE');
  } else if (aggregateScore >= 0.40) {
    decision = 'SUSPICIOUS';
    rulesApplied.push('RULE_AGGREGATE_SCORE_SUSPICIOUS');
  } else if (aggregateScore >= 0.15) {
    decision = 'MONITOR';
    rulesApplied.push('RULE_AGGREGATE_SCORE_MONITOR');
  } else {
    decision = 'CLEAN';
    rulesApplied.push('RULE_LOW_RISK_CLEAN');
  }

  // Calculate final confidence
  const decisionConfidence = topEvidence ? topEvidence.confidence : aggregateScore;

  return {
    decision,
    confidence: Number(decisionConfidence.toFixed(2)),
    score: Number(aggregateScore.toFixed(2)),
    topEvidence,
    rulesApplied,
    ruleVersion: RULE_VERSION
  };
}

module.exports = {
  RULE_VERSION,
  THREAT_LEVEL_WEIGHTS,
  SOURCE_WEIGHTS,
  evaluateThreatState
};
