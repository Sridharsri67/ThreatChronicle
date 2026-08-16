import React from 'react';
import { ShieldCheck, CheckCircle2, Server, Lock, HardDrive } from 'lucide-react';

export default function NetworkStatusWidget() {
  const items = [
    { label: 'Firewall', status: 'Operational', icon: ShieldCheck },
    { label: 'Endpoints', status: 'Secure', icon: HardDrive },
    { label: 'Cloud Workloads', status: 'Operational', icon: Server },
    { label: 'Identity', status: 'Secure', icon: Lock }
  ];

  return (
    <div className="widget-card">
      <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>NETWORK STATUS</span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.45rem', fontSize: '0.75rem' }}>
        {items.map((item, idx) => (
          <div key={idx} style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', padding: '0.4rem 0.65rem', borderRadius: '5px' }}>
            <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-secondary)' }}>
              <item.icon size={13} style={{ color: 'var(--status-clean)' }} />
              <span>{item.label}</span>
            </div>
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--status-clean)', fontWeight: 700 }}>
              {item.status}
            </span>
          </div>
        ))}

        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'rgba(0, 230, 118, 0.08)', border: '1px solid rgba(0, 230, 118, 0.3)', padding: '0.5rem 0.65rem', borderRadius: '6px', marginTop: '0.2rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.45rem', color: 'var(--text-white)', fontWeight: 700 }}>
            <CheckCircle2 size={15} style={{ color: 'var(--status-clean)' }} />
            <span>Overall Status</span>
          </div>
          <span className="mono" style={{ fontSize: '0.85rem', color: 'var(--status-clean)', fontWeight: 800 }}>
            Secure
          </span>
        </div>
      </div>
    </div>
  );
}
