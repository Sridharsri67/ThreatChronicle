const { canonicalizeEvent } = require('../utils/canonicalize');
const { ingestEvent } = require('./ingestion.service');

/**
 * External Threat Intelligence API Fetcher Service
 * Queries VirusTotal v3, AlienVault OTX, and Shodan REST APIs using keys configured in .env
 */

function autoDetectIndicatorType(value, providedType) {
  const cleanVal = String(value || '').trim().toLowerCase();
  if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(cleanVal)) {
    return 'ip';
  }
  if (/^[a-f0-9]{32,64}$/i.test(cleanVal)) {
    return 'hash';
  }
  if (cleanVal.includes('.')) {
    return 'domain';
  }
  return providedType || 'ip';
}

async function fetchVirusTotal(value, type = 'ip') {
  const apiKey = process.env.VT_API_KEY;
  if (!apiKey) return null;

  try {
    const cleanVal = value.trim().toLowerCase();
    const resolvedType = autoDetectIndicatorType(cleanVal, type);

    let endpoint = '';
    if (resolvedType === 'ip') {
      endpoint = `https://www.virustotal.com/api/v3/ip_addresses/${cleanVal}`;
    } else if (resolvedType === 'domain') {
      endpoint = `https://www.virustotal.com/api/v3/domains/${cleanVal}`;
    } else if (resolvedType === 'hash') {
      endpoint = `https://www.virustotal.com/api/v3/files/${cleanVal}`;
    } else {
      return null;
    }

    const res = await fetch(endpoint, {
      headers: { 'x-apikey': apiKey }
    });

    // If VirusTotal returns 404 (Not Found), it means 0 malicious reports / unseen clean indicator
    if (res.status === 404) {
      return {
        source: 'virus_total',
        timestamp: new Date().toISOString(),
        type: 'live_api_scan',
        threatId: `${resolvedType}_${cleanVal}`,
        indicator: { type: resolvedType, value: cleanVal },
        threatLevel: 'clean',
        confidence: 0.90,
        data: {
          status: 'NO_MALICIOUS_REPORTS',
          summary: 'Indicator has 0 threat detections in VirusTotal database'
        }
      };
    }

    if (!res.ok) {
      console.warn(`[VirusTotal API] HTTP ${res.status} for ${cleanVal}`);
      return null;
    }

    const json = await res.json();
    const stats = json.data?.attributes?.last_analysis_stats || {};
    const malicious = stats.malicious || 0;
    const suspicious = stats.suspicious || 0;
    const total = (stats.harmless || 0) + (stats.undetected || 0) + malicious + suspicious;

    let threatLevel = 'clean';
    if (malicious > 5) threatLevel = 'critical';
    else if (malicious > 0) threatLevel = 'high';
    else if (suspicious > 0) threatLevel = 'medium';

    const confidence = total > 0 ? Number(Math.min(0.99, (malicious + suspicious + 5) / (total + 5)).toFixed(2)) : 0.75;

    return {
      source: 'virus_total',
      timestamp: new Date().toISOString(),
      type: 'live_api_scan',
      threatId: `${resolvedType}_${cleanVal}`,
      indicator: { type: resolvedType, value: cleanVal },
      threatLevel,
      confidence,
      data: {
        rawStats: stats,
        reputation: json.data?.attributes?.reputation,
        tags: json.data?.attributes?.tags || []
      }
    };
  } catch (err) {
    console.error('[VirusTotal Fetch Error]:', err.message);
    return null;
  }
}

async function fetchAlienVaultOTX(value, type = 'ip') {
  const apiKey = process.env.OTX_API_KEY;
  if (!apiKey) return null;

  try {
    const cleanVal = value.trim().toLowerCase();
    const resolvedType = autoDetectIndicatorType(cleanVal, type);

    let section = 'IPv4';
    if (resolvedType === 'domain') section = 'domain';
    else if (resolvedType === 'hash') section = 'file';

    const endpoint = `https://otx.alienvault.com/api/v1/indicators/${section}/${cleanVal}/general`;

    const res = await fetch(endpoint, {
      headers: { 'X-OTX-API-KEY': apiKey }
    });

    if (res.status === 404) {
      return {
        source: 'alienvault',
        timestamp: new Date().toISOString(),
        type: 'live_otx_pulse',
        threatId: `${resolvedType}_${cleanVal}`,
        indicator: { type: resolvedType, value: cleanVal },
        threatLevel: 'clean',
        confidence: 0.85,
        data: {
          pulseCount: 0,
          summary: 'Indicator has 0 threat pulses in AlienVault OTX database'
        }
      };
    }

    if (!res.ok) {
      console.warn(`[AlienVault OTX API] HTTP ${res.status} for ${cleanVal}`);
      return null;
    }

    const json = await res.json();
    const pulseCount = json.pulse_info?.count || 0;

    let threatLevel = 'clean';
    if (pulseCount > 10) threatLevel = 'critical';
    else if (pulseCount > 2) threatLevel = 'high';
    else if (pulseCount > 0) threatLevel = 'medium';

    const confidence = pulseCount > 0 ? Math.min(0.95, 0.6 + pulseCount * 0.05) : 0.85;

    return {
      source: 'alienvault',
      timestamp: new Date().toISOString(),
      type: 'live_otx_pulse',
      threatId: `${resolvedType}_${cleanVal}`,
      indicator: { type: resolvedType, value: cleanVal },
      threatLevel,
      confidence: Number(confidence.toFixed(2)),
      data: {
        pulseCount,
        pulses: (json.pulse_info?.pulses || []).slice(0, 3).map(p => ({ id: p.id, name: p.name }))
      }
    };
  } catch (err) {
    console.error('[AlienVault OTX Fetch Error]:', err.message);
    return null;
  }
}

async function fetchShodan(value, type = 'ip') {
  const apiKey = process.env.SHODAN_API_KEY;
  const cleanVal = value.trim().toLowerCase();
  const resolvedType = autoDetectIndicatorType(cleanVal, type);

  if (!apiKey || resolvedType !== 'ip') return null;

  try {
    const endpoint = `https://api.shodan.io/shodan/host/${cleanVal}?key=${apiKey}`;

    const res = await fetch(endpoint);
    if (!res.ok) {
      console.warn(`[Shodan API] HTTP ${res.status} for ${cleanVal}`);
      return null;
    }

    const json = await res.json();
    const ports = json.ports || [];
    const vulns = Object.keys(json.vulns || {});

    let threatLevel = 'low';
    if (vulns.length > 5) threatLevel = 'critical';
    else if (vulns.length > 0) threatLevel = 'high';
    else if (ports.length > 5) threatLevel = 'medium';

    return {
      source: 'edr',
      timestamp: new Date().toISOString(),
      type: 'shodan_host_scan',
      threatId: `${resolvedType}_${cleanVal}`,
      indicator: { type: resolvedType, value: cleanVal },
      threatLevel,
      confidence: 0.85,
      data: {
        org: json.org,
        isp: json.isp,
        openPorts: ports,
        vulnerabilities: vulns.slice(0, 5)
      }
    };
  } catch (err) {
    console.error('[Shodan Fetch Error]:', err.message);
    return null;
  }
}

async function fetchAndIngestLiveIntelligence(indicatorValue, providedType = 'ip') {
  const cleanVal = String(indicatorValue || '').trim().toLowerCase();
  const resolvedType = autoDetectIndicatorType(cleanVal, providedType);

  const results = [];
  
  // Query all active external APIs concurrently with properly resolved type
  const [vtRes, otxRes, shodanRes] = await Promise.all([
    fetchVirusTotal(cleanVal, resolvedType),
    fetchAlienVaultOTX(cleanVal, resolvedType),
    fetchShodan(cleanVal, resolvedType)
  ]);

  const fetchedEvents = [vtRes, otxRes, shodanRes].filter(Boolean);

  if (fetchedEvents.length === 0) {
    return {
      success: false,
      message: `No live external API data retrieved for ${cleanVal} (check API keys or network connection)`,
      eventsProcessed: 0
    };
  }

  for (const evt of fetchedEvents) {
    const res = await ingestEvent(evt);
    results.push(res);
  }

  return {
    success: true,
    indicatorValue: cleanVal,
    type: resolvedType,
    eventsProcessed: results.length,
    results
  };
}

module.exports = {
  autoDetectIndicatorType,
  fetchVirusTotal,
  fetchAlienVaultOTX,
  fetchShodan,
  fetchAndIngestLiveIntelligence
};
