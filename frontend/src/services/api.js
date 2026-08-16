/**
 * Centralized API Service Layer for ThreatChronicle Frontend
 * Communicates with Express backend running on http://localhost:5001 (proxied via Vite)
 */

const BASE_URL = '/api';

export async function fetchThreats(params = {}) {
  const query = new URLSearchParams();
  if (params.decision && params.decision !== 'ALL') query.append('decision', params.decision);
  if (params.search) query.append('search', params.search);
  if (params.page) query.append('page', params.page);
  if (params.limit) query.append('limit', params.limit);

  const url = `${BASE_URL}/threats${query.toString() ? `?${query.toString()}` : ''}`;
  const res = await fetch(url);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch threat list`);
  return await res.json();
}

export async function fetchThreatDetail(id) {
  if (!id) return null;
  const res = await fetch(`${BASE_URL}/threats/${encodeURIComponent(id)}`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch threat detail for ${id}`);
  return await res.json();
}

export async function replayThreat(id) {
  if (!id) return null;
  const res = await fetch(`${BASE_URL}/threats/${encodeURIComponent(id)}/replay`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' }
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to replay threat ${id}`);
  return await res.json();
}

export async function downloadReport(id, format = 'pdf') {
  if (!id) return;
  const res = await fetch(`${BASE_URL}/threats/${encodeURIComponent(id)}/report?format=${format}`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to download ${format} report for ${id}`);
  
  const blob = await res.blob();
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `threat-report-${id.replace(/[^a-zA-Z0-9_-]/g, '_')}.${format}`;
  document.body.appendChild(a);
  a.click();
  a.remove();
  window.URL.revokeObjectURL(url);
}

export async function fetchLiveIntelligence(value, type = 'ip') {
  const res = await fetch(`${BASE_URL}/events/fetch-live`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ indicator: { type, value } })
  });
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch live intelligence`);
  return await res.json();
}

export async function fetchMetrics() {
  const res = await fetch(`${BASE_URL}/metrics`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to fetch metrics`);
  return await res.json();
}

export async function fetchHealth() {
  const res = await fetch(`${BASE_URL}/health`);
  if (!res.ok) throw new Error(`HTTP error ${res.status}: Failed to check engine health`);
  return await res.json();
}
