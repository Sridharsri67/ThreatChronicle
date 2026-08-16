import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, RefreshCw, LayoutDashboard, Shield, Globe, Cpu } from 'lucide-react';

export default function Header({ metrics, health, onOpenCommand, onRefresh }) {
  return (
    <header className="app-header">
      <div style={{ display: 'flex', alignItems: 'center' }}>
        <NavLink to="/" className="brand-mark">
          <div className="brand-symbol" />
          <span>THREATCHRONICLE</span>
          <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400, marginLeft: '0.4rem' }}>
            ENGINE v1.0
          </span>
        </NavLink>

        <nav className="nav-tab-group">
          <NavLink to="/" className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}>
            <LayoutDashboard size={14} />
            <span>DASHBOARD</span>
          </NavLink>

          <NavLink to="/threats" className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}>
            <Shield size={14} />
            <span>THREAT QUEUE</span>
          </NavLink>

          <NavLink to="/live-fetch" className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}>
            <Globe size={14} />
            <span>LIVE FETCH</span>
          </NavLink>

          <NavLink to="/analytics" className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}>
            <Cpu size={14} />
            <span>ANALYTICS</span>
          </NavLink>
        </nav>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem' }}>
        <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>
          SESSION: OPS-2026-001
        </div>

        <button className="cmd-trigger" onClick={onOpenCommand} title="Open Command Palette (⌘ K)">
          <Search size={13} />
          <span>Search command...</span>
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
