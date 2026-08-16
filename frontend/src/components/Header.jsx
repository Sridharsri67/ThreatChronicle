import React from 'react';
import { Shield, Zap, RefreshCw, Activity, CheckCircle2 } from 'lucide-react';

export default function Header({ metrics, onRefresh }) {
  return (
    <header className="app-header">
      <div className="brand">
        <div className="brand-icon">
          <Shield size={20} />
        </div>
        <div>
          <span className="brand-title">ThreatChronicle</span>
          <span className="brand-tag">Deterministic Threat Engine</span>
        </div>
      </div>

      <div className="header-metrics">
        <div className="metric-pill">
          <Activity size={14} className="text-accent" />
          <span className="metric-label">Threats:</span>
          <span className="metric-value">{metrics ? metrics.totalThreats : 0}</span>
        </div>

        <div className="metric-pill">
          <Zap size={14} style={{ color: '#f59e0b' }} />
          <span className="metric-label">Events Processed:</span>
          <span className="metric-value">{metrics ? metrics.totalEvents : 0}</span>
        </div>

        <div className="metric-pill">
          <CheckCircle2 size={14} style={{ color: '#10b981' }} />
          <span className="metric-label">Rule Engine:</span>
          <span className="metric-value mono">v1.0</span>
        </div>

        <div className="metric-pill">
          <div className="status-dot"></div>
          <span className="metric-label">Status:</span>
          <span className="metric-value" style={{ color: '#10b981' }}>OPERATIONAL</span>
        </div>

        <button 
          onClick={onRefresh} 
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer' }}
          title="Refresh Engine Metrics"
        >
          <RefreshCw size={16} />
        </button>
      </div>
    </header>
  );
}
