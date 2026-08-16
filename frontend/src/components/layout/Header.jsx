import React from 'react';
import { Search, Command, RefreshCw } from 'lucide-react';

export default function Header({ metrics, health, onOpenCommand, onRefresh }) {
  return (
    <header className="app-header">
      <div className="brand-mark">
        <div className="brand-symbol" />
        <span>THREATCHRONICLE</span>
        <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
          ENGINE v1.0
        </span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <button className="cmd-trigger" onClick={onOpenCommand} title="Open Command Palette (⌘ K)">
          <Search size={13} />
          <span>Search or command...</span>
          <span className="kbd">⌘K</span>
        </button>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
          <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-clean)' }}></span>
          <span style={{ color: 'var(--text-secondary)', fontWeight: 600 }}>OPERATIONAL</span>
        </div>

        <button
          onClick={onRefresh}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}
          title="Refresh Engine Metrics"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
