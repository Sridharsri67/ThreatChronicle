import React from 'react';
import { NavLink } from 'react-router-dom';
import { Search, RefreshCw, LayoutDashboard, Shield, Globe, Cpu } from 'lucide-react';

export default function Header({ metrics, health, onOpenCommand, onRefresh }) {
  return (
    <header className="app-header">
      {/* Left Brand Mark */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '1rem', flexShrink: 0 }}>
        <NavLink to="/" className="brand-mark">
          <div className="brand-symbol" />
          <span>THREATCHRONICLE</span>
          <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', fontWeight: 400 }}>
            ENGINE v1.0
          </span>
        </NavLink>

        <div className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)', background: 'rgba(255,255,255,0.04)', padding: '0.2rem 0.5rem', borderRadius: '4px', border: '1px solid var(--border-subtle)' }}>
          SESSION: OPS-2026-001
        </div>
      </div>

      {/* Center Navigation Tabs */}
      <nav className="nav-tab-group">
        <NavLink to="/" end className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}>
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

      {/* Right Controls */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
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
          style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer', display: 'flex', alignItems: 'center' }}
          title="Refresh Engine Metrics"
        >
          <RefreshCw size={14} />
        </button>
      </div>
    </header>
  );
}
