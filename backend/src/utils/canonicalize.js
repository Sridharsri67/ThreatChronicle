/**
 * Canonical Event Normalizer for ThreatChronicle
 * Maps heterogeneous threat intelligence payloads into a clean, unified schema.
 */

function normalizeSource(sourceStr) {
  if (!sourceStr) return 'generic';
  const s = String(sourceStr).toLowerCase().trim().replace(/[^a-z0-9_]/g, '_');
  if (s.includes('alienvault') || s.includes('otx')) return 'alienvault';
  if (s.includes('virustotal') || s.includes('vt') || s.includes('virus_total')) return 'virus_total';
  if (s.includes('edr') || s.includes('endpoint') || s.includes('crowdstrike') || s.includes('defender')) return 'edr';
  if (s.includes('ai') || s.includes('llm') || s.includes('report')) return 'ai_report';
  return s || 'generic';
}

function normalizeThreatLevel(levelStr) {
  if (!levelStr) return 'unknown';
  const l = String(levelStr).toLowerCase().trim();
  if (['critical', 'severe', 'catastrophic'].includes(l)) return 'critical';
  if (['high', 'malicious', 'dangerous'].includes(l)) return 'high';
  if (['medium', 'suspicious', 'warning', 'phishing'].includes(l)) return 'medium';
  if (['low', 'info', 'informational', 'benign'].includes(l)) return 'low';
  if (['clean', 'safe', 'whitelist', 'whitelisted', 'clear'].includes(l)) return 'clean';
  return 'unknown';
}

function normalizeConfidence(confVal) {
  let num = Number(confVal);
  if (isNaN(num)) return 0.5;
  // Handle percentage scale 0-100 vs decimal scale 0-1
  if (num > 1.0 && num <= 100) {
    num = num / 100;
  }
  return Math.min(Math.max(num, 0.0), 1.0);
}

function deriveThreatId(indicator) {
  if (!indicator) return 'threat_unknown';
  let type = 'ip';
  let value = '';

  if (typeof indicator === 'object') {
    type = (indicator.type || 'ip').toLowerCase().trim();
    value = (indicator.value || '').toLowerCase().trim();
  } else if (typeof indicator === 'string') {
    value = indicator.toLowerCase().trim();
    // Simple heuristic deduction
    if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(value)) {
      type = 'ip';
    } else if (/^[a-f0-9]{32,64}$/i.test(value)) {
      type = 'hash';
    } else if (value.includes('.')) {
      type = 'domain';
    } else {
      type = 'endpoint';
    }
  }

  // Clean value
  value = value.replace(/https?:\/\//, '').replace(/\/.*$/, '').trim();

  return `${type}_${value}`;
}

function canonicalizeEvent(rawPayload) {
  const source = normalizeSource(rawPayload.source);
  const timestamp = rawPayload.timestamp ? new Date(rawPayload.timestamp) : new Date();
  
  // Extract indicator
  let indicatorObj = { type: 'ip', value: '0.0.0.0' };
  if (rawPayload.indicator && typeof rawPayload.indicator === 'object') {
    indicatorObj = {
      type: (rawPayload.indicator.type || 'ip').toLowerCase().trim(),
      value: (rawPayload.indicator.value || '').toLowerCase().trim()
    };
  } else if (typeof rawPayload.indicator === 'string') {
    const derivedId = deriveThreatId(rawPayload.indicator);
    const parts = derivedId.split('_');
    indicatorObj = {
      type: parts[0],
      value: parts.slice(1).join('_')
    };
  } else if (rawPayload.data && rawPayload.data.ip) {
    indicatorObj = { type: 'ip', value: rawPayload.data.ip.toLowerCase().trim() };
  } else if (rawPayload.data && rawPayload.data.domain) {
    indicatorObj = { type: 'domain', value: rawPayload.data.domain.toLowerCase().trim() };
  }

  const threatId = rawPayload.threatId || deriveThreatId(indicatorObj);
  const threatLevel = normalizeThreatLevel(rawPayload.threatLevel || (rawPayload.data && (rawPayload.data.threat_level || rawPayload.data.classification)));
  const confidence = normalizeConfidence(rawPayload.confidence !== undefined ? rawPayload.confidence : (rawPayload.data && rawPayload.data.confidence));
  const eventId = rawPayload.eventId || `evt_${Math.random().toString(36).substring(2, 9)}`;

  return {
    eventId,
    source,
    timestamp,
    receivedAt: rawPayload.receivedAt ? new Date(rawPayload.receivedAt) : new Date(),
    type: rawPayload.type || 'ioc',
    threatId,
    indicator: indicatorObj,
    threatLevel,
    confidence,
    data: rawPayload.data || {},
    normalizedData: {
      source,
      threatLevel,
      confidence,
      indicator: indicatorObj,
      rawTimestamp: timestamp.toISOString()
    },
    schemaVersion: 1
  };
}

module.exports = {
  normalizeSource,
  normalizeThreatLevel,
  normalizeConfidence,
  deriveThreatId,
  canonicalizeEvent
};
