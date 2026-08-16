const crypto = require('crypto');

/**
 * Generate a deterministic SHA-256 fingerprint for an incoming event.
 * Ensures idempotency: duplicate events produce identical fingerprints.
 */
function generateEventFingerprint(eventData) {
  const source = (eventData.source || '').toLowerCase().trim();
  const threatId = (eventData.threatId || '').toLowerCase().trim();
  const timestamp = eventData.timestamp ? new Date(eventData.timestamp).toISOString() : '';
  const type = (eventData.type || '').toLowerCase().trim();
  
  // Extract indicator string cleanly
  let indicatorVal = '';
  if (typeof eventData.indicator === 'object' && eventData.indicator !== null) {
    indicatorVal = (eventData.indicator.value || '').toLowerCase().trim();
  } else if (typeof eventData.indicator === 'string') {
    indicatorVal = eventData.indicator.toLowerCase().trim();
  }

  // Include custom ID if provided explicitly or generate hash from structural attributes
  const rawKey = `${source}|${threatId}|${timestamp}|${type}|${indicatorVal}`;
  
  return crypto.createHash('sha256').update(rawKey).digest('hex');
}

/**
 * Generate a deterministic SHA-256 checksum fingerprint for a decision state.
 * SHA-256(canonical(events) + canonical(rules) + canonical(decision))
 */
function generateDecisionFingerprint(orderedEvents, ruleVersion, decision, confidence) {
  const canonicalEventStr = orderedEvents.map(e => `${e.eventId || e._id}:${e.fingerprint}:${e.source}:${new Date(e.timestamp).toISOString()}`).join(';');
  const rawPayload = `RULES:${ruleVersion}|DECISION:${decision}|CONF:${confidence}|EVENTS:[${canonicalEventStr}]`;
  return crypto.createHash('sha256').update(rawPayload).digest('hex');
}

module.exports = {
  generateEventFingerprint,
  generateDecisionFingerprint
};
