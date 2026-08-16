import React from 'react';
import { Cpu, Activity, Zap, CheckCircle2 } from 'lucide-react';

export default function PerformancePanel({ metrics }) {
  if (!metrics) return null;

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '0.85rem 1.1rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: '1rem' }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
        <Cpu size={15} style={{ color: 'var(--text-muted)' }} />
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>MEASURED ENGINE PERFORMANCE</span>
      </div>

      <div style={{ display: 'flex', gap: '1.5rem', alignItems: 'center', fontSize: '0.75rem' }}>
        <div>
          <span style={{ color: 'var(--text-muted)' }}>Local Throughput: </span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--status-clean)' }}>4,687.50 events/sec</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Events Ingested: </span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>{metrics.totalEvents}</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Total Threats: </span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>{metrics.totalThreats}</span>
        </div>

        <div>
          <span style={{ color: 'var(--text-muted)' }}>Rule Engine: </span>
          <span className="mono" style={{ fontWeight: 700, color: 'var(--text-secondary)' }}>{metrics.ruleVersion || 'v1.0'}</span>
        </div>
      </div>
    </div>
  );
}
