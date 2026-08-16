import React, { useState } from 'react';
import { ShieldAlert, X } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function CriticalAlertBanner({ threatId = '203.0.113.45' }) {
  const [dismissed, setDismissed] = useState(false);
  const navigate = useNavigate();

  if (dismissed) return null;

  return (
    <div className="critical-alert-banner">
      <div style={{ color: 'var(--status-critical)', background: 'rgba(255, 42, 75, 0.15)', padding: '0.5rem', borderRadius: '8px', border: '1px solid rgba(255, 42, 75, 0.3)' }}>
        <ShieldAlert size={22} />
      </div>

      <div style={{ flex: 1 }}>
        <div style={{ fontSize: '0.68rem', fontWeight: 800, letterSpacing: '0.08em', color: 'var(--status-critical)', textTransform: 'uppercase' }}>
          CRITICAL ALERT
        </div>
        <div style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-white)', marginTop: '0.1rem' }}>
          Advanced Persistent Threat detected in your network
        </div>
        <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
          Source: {threatId}
        </div>
      </div>

      <button className="btn-alert-action" onClick={() => navigate(`/threats?id=${encodeURIComponent(threatId)}`)}>
        View Incident
      </button>

      <button
        onClick={() => setDismissed(true)}
        style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', marginLeft: '0.2rem' }}
        title="Dismiss Alert"
      >
        <X size={16} />
      </button>
    </div>
  );
}
