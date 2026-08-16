const { getSourceRank } = require('./ordering');

/**
 * Conflict Resolver for ThreatChronicle
 * Resolves contradictory claims from heterogeneous sources.
 * Precedence Rule: Source Reliability > Timestamp > Confidence > Lexicographical Tie-breaker
 */

function resolveConflicts(orderedEvents) {
  if (!orderedEvents || orderedEvents.length === 0) {
    return {
      hasConflict: false,
      resolutionSteps: [],
      winningCandidate: null,
      summary: 'No events to evaluate'
    };
  }

  // Check if multiple distinct sources or contradictory threat levels exist
  const sourcesPresent = new Set(orderedEvents.map(e => e.source));
  const threatLevelsPresent = new Set(orderedEvents.map(e => e.threatLevel));
  const hasConflict = sourcesPresent.size > 1 && threatLevelsPresent.size > 1;

  const steps = [];

  steps.push({
    step: 1,
    description: 'Collected all raw event telemetry for threat',
    candidates: orderedEvents.map(e => ({
      eventId: e.eventId,
      source: e.source,
      sourceRank: getSourceRank(e.source),
      threatLevel: e.threatLevel,
      confidence: e.confidence,
      timestamp: new Date(e.timestamp).toISOString()
    }))
  });

  if (hasConflict) {
    steps.push({
      step: 2,
      description: 'Conflict detected: Multiple sources provided divergent threat classifications',
      reason: `Found sources [${Array.from(sourcesPresent).join(', ')}] with threat levels [${Array.from(threatLevelsPresent).join(', ')}]`
    });
  }

  // Find candidate with highest source rank first
  let candidates = [...orderedEvents];

  // Group by highest source rank
  const maxRank = Math.max(...candidates.map(c => getSourceRank(c.source)));
  const highestRankCandidates = candidates.filter(c => getSourceRank(c.source) === maxRank);

  steps.push({
    step: 3,
    description: `Filtered by Source Reliability Hierarchy (Max Rank = ${maxRank})`,
    candidates: highestRankCandidates.map(c => ({ eventId: c.eventId, source: c.source, threatLevel: c.threatLevel })),
    reason: `Precedence hierarchy: AlienVault (Rank 3) > VirusTotal/EDR (Rank 2) > AI Report (Rank 1)`
  });

  // If multiple candidates remain at highest rank, filter by latest timestamp
  let latestCandidates = highestRankCandidates;
  if (highestRankCandidates.length > 1) {
    const maxTime = Math.max(...highestRankCandidates.map(c => new Date(c.timestamp).getTime()));
    latestCandidates = highestRankCandidates.filter(c => new Date(c.timestamp).getTime() === maxTime);

    steps.push({
      step: 4,
      description: 'Applied Timestamp tie-breaker among top-rank sources',
      candidates: latestCandidates.map(c => ({ eventId: c.eventId, timestamp: c.timestamp }))
    });
  }

  // If still multiple, select highest confidence
  let topConfidenceCandidates = latestCandidates;
  if (latestCandidates.length > 1) {
    const maxConf = Math.max(...latestCandidates.map(c => Number(c.confidence) || 0));
    topConfidenceCandidates = latestCandidates.filter(c => (Number(c.confidence) || 0) === maxConf);

    steps.push({
      step: 5,
      description: 'Applied Confidence tie-breaker',
      candidates: topConfidenceCandidates.map(c => ({ eventId: c.eventId, confidence: c.confidence }))
    });
  }

  // Deterministic tie-breaker winner
  const winner = topConfidenceCandidates[0];

  steps.push({
    step: steps.length + 1,
    description: 'Selected Winning Evidence Candidate',
    winner: {
      eventId: winner.eventId,
      source: winner.source,
      threatLevel: winner.threatLevel,
      confidence: winner.confidence,
      timestamp: winner.timestamp
    },
    reason: `Candidate ${winner.eventId} from source '${winner.source}' won resolution`
  });

  return {
    hasConflict,
    resolutionSteps: steps,
    winningCandidate: winner,
    summary: hasConflict
      ? `Resolved conflict in favor of source '${winner.source}' (${winner.threatLevel.toUpperCase()})`
      : `Single/Unanimous evidence from '${winner.source}'`
  };
}

module.exports = {
  resolveConflicts
};
