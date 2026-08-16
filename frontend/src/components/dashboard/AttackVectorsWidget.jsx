import React from 'react';

export default function AttackVectorsWidget() {
  return (
    <div className="widget-card">
      <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.4rem' }}>
        <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>TOP ATTACK VECTORS</span>
      </div>

      <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between' }}>
        {/* SVG Donut Chart */}
        <div style={{ position: 'relative', width: '100px', height: '100px' }}>
          <svg viewBox="0 0 36 36" style={{ width: '100%', height: '100%', transform: 'rotate(-90deg)' }}>
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#1A1A24" strokeWidth="3" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF2A4B" strokeWidth="3.5" strokeDasharray="38, 100" />
            <path d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831" fill="none" stroke="#FF6B00" strokeWidth="3" strokeDasharray="28, 100" />
          </svg>

          <div style={{ position: 'absolute', inset: 0, display: 'flex', flexDirection: 'column', alignItems: 'center', justifyContent: 'center' }}>
            <span className="mono" style={{ fontSize: '1rem', fontWeight: 800, color: 'var(--text-white)', lineHeight: 1 }}>3.8K</span>
            <span style={{ fontSize: '0.62rem', color: 'var(--text-muted)' }}>Total</span>
          </div>
        </div>

        {/* Legend */}
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem', fontSize: '0.72rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', width: '120px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2A4B' }}></span> Web Exploits
            </span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>38%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', width: '120px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF6B00' }}></span> Brute Force
            </span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>28%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', width: '120px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FFA800' }}></span> Malware
            </span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>18%</span>
          </div>

          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', justifyContent: 'space-between', width: '120px' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E676' }}></span> Phishing
            </span>
            <span className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>9%</span>
          </div>
        </div>
      </div>
    </div>
  );
}
