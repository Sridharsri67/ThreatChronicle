/**
 * Deterministic Event Ordering Algorithm for ThreatChronicle
 * 
 * Guarantee: Given N events (regardless of arrival order), this function
 * ALWAYS produces the exact same sorted array.
 * 
 * Ordering Hierarchy:
 * 1. Timestamp ASC (Occurrence time)
 * 2. Source Reliability Rank DESC (AlienVault = 3 > VirusTotal/EDR = 2 > AI Report = 1)
 * 3. Confidence Level DESC
 * 4. Event ID / Fingerprint ASC (Strict string lexicographical tie-breaker)
 */

const SOURCE_RELIABILITY = {
  alienvault: 3,
  virus_total: 2,
  edr: 2,
  ai_report: 1,
  generic: 0
};

function getSourceRank(source) {
  if (!source) return 0;
  const s = String(source).toLowerCase().trim();
  return SOURCE_RELIABILITY[s] !== undefined ? SOURCE_RELIABILITY[s] : 0;
}

function deterministicSort(events) {
  if (!Array.isArray(events) || events.length === 0) {
    return [];
  }

  return [...events].sort((a, b) => {
    // 1. Timestamp ASC
    const timeA = new Date(a.timestamp).getTime();
    const timeB = new Date(b.timestamp).getTime();
    if (timeA !== timeB) {
      return timeA - timeB;
    }

    // 2. Source Reliability Rank DESC
    const rankA = getSourceRank(a.source);
    const rankB = getSourceRank(b.source);
    if (rankA !== rankB) {
      return rankB - rankA;
    }

    // 3. Confidence DESC
    const confA = Number(a.confidence) || 0;
    const confB = Number(b.confidence) || 0;
    if (confA !== confB) {
      return confB - confA;
    }

    // 4. Event ID / Fingerprint Lexicographical ASC (Tie-breaker)
    const idA = String(a.eventId || a.fingerprint || a._id || '');
    const idB = String(b.eventId || b.fingerprint || b._id || '');
    return idA.localeCompare(idB);
  });
}

module.exports = {
  SOURCE_RELIABILITY,
  getSourceRank,
  deterministicSort
};
