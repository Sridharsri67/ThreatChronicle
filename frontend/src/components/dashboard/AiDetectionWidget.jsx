import React from 'react';
import { Cpu } from 'lucide-react';

export default function AiDetectionWidget() {
  return (
    <div className="widget-card">
      <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>AI DETECTION ENGINE</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1.25rem' }}>
        {/* Radar Target Scanner */}
        <div style={{ position: 'relative', width: '85px', height: '85px', flexShrink: 0 }}>
          <svg viewBox="0 0 100 100" style={{ width: '100%', height: '100%' }}>
            <circle cx="50" cy="50" r="45" fill="none" stroke="#1A1A26" strokeWidth="2" />
            <circle cx="50" cy="50" r="30" fill="none" stroke="#1A1A26" strokeWidth="1.5" strokeDasharray="3 3" />
            <circle cx="50" cy="50" r="15" fill="none" stroke="#1A1A26" strokeWidth="1" />
            <line x1="50" y1="5" x2="50" y2="95" stroke="rgba(0, 230, 118, 0.2)" />
            <line x1="5" y1="50" x2="95" y2="50" stroke="rgba(0, 230, 118, 0.2)" />
            <g className="radar-sweep">
              <path d="M 50 50 L 50 5 A 45 45 0 0 1 95 50 Z" fill="rgba(0, 230, 118, 0.15)" />
              <line x1="50" y1="50" x2="95" y2="50" stroke="#00E676" strokeWidth="2" />
            </g>
            <circle cx="70" cy="30" r="3" fill="#FF2A4B" />
          </svg>
        </div>

        {/* AI Stats */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', width: '100%' }}>
          <div>
            <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>Analyzing...</div>
            <div className="mono" style={{ fontSize: '1.3rem', fontWeight: 800, color: 'var(--status-clean)' }}>98.7%</div>
          </div>

          <div style={{ display: 'flex', justifyContent: 'space-between', borderTop: '1px solid var(--border-subtle)', paddingTop: '0.4rem', fontSize: '0.7rem' }}>
            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Anomalies Detected</div>
              <div className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>19</div>
            </div>

            <div>
              <div style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Patterns Analyzed</div>
              <div className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>21.6M</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
