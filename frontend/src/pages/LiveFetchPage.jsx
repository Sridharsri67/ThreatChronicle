import React from 'react';
import LiveFetchBar from '../components/live/LiveFetchBar';
import ThreatList from '../components/threats/ThreatList';
import DecisionHero from '../components/decision/DecisionHero';
import EventTimeline from '../components/timeline/EventTimeline';
import PerformancePanel from '../components/dashboard/PerformancePanel';
import { useNavigate } from 'react-router-dom';

export default function LiveFetchPage({ threats, metrics, onRefreshData }) {
  const navigate = useNavigate();
  const selectedThreat = threats && threats.length > 0 ? threats[0] : null;

  return (
    <div className="inspector-canvas" style={{ flex: 1, padding: '1.5rem 2rem' }}>
      <LiveFetchBar onRefreshData={onRefreshData} />

      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ fontSize: '0.85rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.5rem' }}>
          LIVE THREAT INTELLIGENCE INGESTION ENGINE
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Enter any IP address (e.g. 185.220.101.5), Domain name (e.g. example.com), or File Hash (MD5/SHA-256) into the search bar above.
          ThreatChronicle queries VirusTotal v3, AlienVault OTX, and Shodan REST APIs using credentials configured in .env, normalizes the live telemetry into canonical events, and deterministically reconstructs the threat verdict in MongoDB.
        </p>
      </div>

      <PerformancePanel metrics={metrics} />
    </div>
  );
}
