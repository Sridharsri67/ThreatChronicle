import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Eye, ShieldAlert, Globe, FileText, Settings, Cpu } from 'lucide-react';

export default function Header() {
  const navItems = [
    { to: '/', label: 'OVERVIEW', icon: Eye, end: true },
    { to: '/threats', label: 'THREATS', icon: Shield },
    { to: '/incidents', label: 'INCIDENTS', icon: ShieldAlert },
    { to: '/live-fetch', label: 'FETCH', icon: Globe },
    { to: '/reports', label: 'REPORTS', icon: FileText },
    { to: '/analytics', label: 'SETTINGS', icon: Settings }
  ];

  return (
    <header className="app-header">
      {/* Left Brand Mark with Glowing Red Shield Logo */}
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.85rem', flexShrink: 0 }}>
        <NavLink to="/" className="brand-mark" style={{ textDecoration: 'none' }}>
          <div
            style={{
              width: '32px',
              height: '32px',
              border: '1.5px solid var(--crimson-accent)',
              borderRadius: '8px',
              display: 'flex',
              alignItems: 'center',
              justifyContent: 'center',
              color: 'var(--crimson-accent)',
              boxShadow: '0 0 12px var(--crimson-glow)',
              background: 'rgba(255, 42, 75, 0.08)'
            }}
          >
            <Shield size={18} />
          </div>
          <span style={{ fontWeight: 800, fontSize: '0.92rem', color: 'var(--text-white)', letterSpacing: '0.04em' }}>
            THREATCHRONICLE
          </span>
        </NavLink>
      </div>

      {/* Top Navbar Header Navigation Group */}
      <nav className="nav-tab-group">
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end={item.end}
            className={({ isActive }) => `nav-tab-link ${isActive ? 'active' : ''}`}
          >
            <item.icon size={14} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </header>
  );
}
