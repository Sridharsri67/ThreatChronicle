import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2, ShieldAlert, BarChart2 } from 'lucide-react';
import PerformancePanel from '../components/dashboard/PerformancePanel';

export default function AnalyticsPage({ metrics }) {
  return (
    <div className="inspector-canvas" style={{ flex: 1, padding: '1.5rem 2rem' }}>
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <BarChart2 size={18} style={{ color: 'var(--text-white)' }} />
          <h2 style={{ fontSize: '1.1rem', fontWeight: 800, color: 'var(--text-white)' }}>Engine Operational Analytics & Reliability Matrix</h2>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Real-time performance measurements, local ingestion throughput, and multi-source reliability ranking hierarchy.
        </p>
      </div>

      <PerformancePanel metrics={metrics} />

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(280px, 1fr))', gap: '1.25rem', marginTop: '1.25rem' }}>
        {/* Source Precedence Matrix Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.1rem' }}>
          <div className="card-heading">
            <span>SOURCE PRECEDENCE MATRIX</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RULE v1.0</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.78rem' }}>
            <div style={{ background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', padding: '0.55rem 0.75rem', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>AlienVault OTX</span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Primary IOC & Curated Pulses</div>
              </div>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--status-clean)' }}>RANK 3 (MAX)</span>
            </div>

            <div style={{ background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', padding: '0.55rem 0.75rem', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>VirusTotal / EDR</span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>Multi-Engine Antivirus & Endpoint Logs</div>
              </div>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--status-suspicious)' }}>RANK 2</span>
            </div>

            <div style={{ background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', padding: '0.55rem 0.75rem', borderRadius: '5px', display: 'flex', justifyContent: 'space-between' }}>
              <div>
                <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>AI Threat Report</span>
                <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>LLM Probabilistic Assessments</div>
              </div>
              <span className="mono" style={{ fontWeight: 700, color: 'var(--text-muted)' }}>RANK 1</span>
            </div>
          </div>
        </div>

        {/* Sorting Order Card */}
        <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.1rem' }}>
          <div className="card-heading">
            <span>4-TIER DETERMINISTIC SORTING</span>
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>RECONSTRUCTION</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem', fontSize: '0.78rem' }}>
            <div style={{ background: 'var(--bg-darkest)', padding: '0.5rem 0.65rem', borderRadius: '4px', borderLeft: '2px solid var(--text-white)' }}>
              1. <strong>timestamp ASC</strong> — Occurrence time in the wild
            </div>
            <div style={{ background: 'var(--bg-darkest)', padding: '0.5rem 0.65rem', borderRadius: '4px', borderLeft: '2px solid var(--text-white)' }}>
              2. <strong>sourceRank DESC</strong> — AlienVault (3) &gt; VirusTotal/EDR (2) &gt; AI Report (1)
            </div>
            <div style={{ background: 'var(--bg-darkest)', padding: '0.5rem 0.65rem', borderRadius: '4px', borderLeft: '2px solid var(--text-white)' }}>
              3. <strong>confidence DESC</strong> — Signal confidence score (0.0 – 1.0)
            </div>
            <div style={{ background: 'var(--bg-darkest)', padding: '0.5rem 0.65rem', borderRadius: '4px', borderLeft: '2px solid var(--text-white)' }}>
              4. <strong>eventId / fingerprint ASC</strong> — Lexicographical tie-breaker
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
