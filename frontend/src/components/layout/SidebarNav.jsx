import React from 'react';
import { NavLink } from 'react-router-dom';
import { Shield, Eye, ShieldAlert, Globe, FileText, Settings } from 'lucide-react';

export default function SidebarNav() {
  const navItems = [
    { to: '/', label: 'Overview', icon: Eye },
    { to: '/threats', label: 'Threats', icon: Shield },
    { to: '/incidents', label: 'Incident Queue', icon: ShieldAlert },
    { to: '/live-fetch', label: 'Intelligence', icon: Globe },
    { to: '/reports', label: 'Reports', icon: FileText },
    { to: '/analytics', label: 'Settings', icon: Settings }
  ];

  return (
    <aside className="soc-sidebar">
      <div className="brand-shield-logo" title="ThreatChronicle Security Engine">
        <Shield size={20} />
      </div>

      <nav style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem', width: '100%', alignItems: 'center' }}>
        {navItems.map((item, idx) => (
          <NavLink
            key={idx}
            to={item.to}
            end
            className={({ isActive }) => `sidebar-nav-item ${isActive ? 'active' : ''}`}
            title={item.label}
          >
            <item.icon size={18} />
            <span>{item.label}</span>
          </NavLink>
        ))}
      </nav>
    </aside>
  );
}
