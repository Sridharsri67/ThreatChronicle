import React from 'react';
import { Layers, ShieldAlert, GitMerge } from 'lucide-react';

export default function ConflictPanel({ steps }) {
  if (!steps || steps.length === 0) return null;

  return (
    <div className="timeline-section">
      <div className="card-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GitMerge size={15} />
          <span>Multi-Source Conflict Resolution Rationale</span>
        </div>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          PRECEDENCE: SOURCE &gt; TIMESTAMP &gt; CONFIDENCE
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem' }}>
        {steps.map((step, idx) => (
          <div key={idx} className="conflict-step">
            <div style={{ fontWeight: 600, color: 'var(--text-white)' }}>
              Step {step.step}: {step.description}
            </div>
            {step.reason && (
              <div style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                {step.reason}
              </div>
            )}
          </div>
        ))}
      </div>
    </div>
  );
}
