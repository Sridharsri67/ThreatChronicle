import React from 'react';
import { motion } from 'motion/react';
import { Globe, Maximize2, Filter, MoreHorizontal } from 'lucide-react';

export default function GlobalThreatMap() {
  const nodes = [
    { id: 'us-east', name: 'US-East (Virginia)', cx: 220, cy: 140, severity: 'critical' },
    { id: 'eu-central', name: 'EU-Central (Frankfurt)', cx: 480, cy: 120, severity: 'high' },
    { id: 'ap-east', name: 'AP-East (Tokyo)', cx: 780, cy: 160, severity: 'high' },
    { id: 'ap-southeast', name: 'AP-Southeast (Singapore)', cx: 710, cy: 230, severity: 'medium' },
    { id: 'sa-east', name: 'SA-East (São Paulo)', cx: 330, cy: 280, severity: 'critical' },
    { id: 'au-southeast', name: 'AU-East (Sydney)', cx: 820, cy: 300, severity: 'low' }
  ];

  const arcs = [
    { from: [480, 120], to: [220, 140], color: '#FF2A4B' },
    { from: [780, 160], to: [220, 140], color: '#FF6B00' },
    { from: [330, 280], to: [480, 120], color: '#FF2A4B' },
    { from: [710, 230], to: [820, 300], color: '#FFA800' }
  ];

  return (
    <div className="map-card">
      <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.5rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <Globe size={16} style={{ color: 'var(--crimson-accent)' }} />
          <span style={{ fontSize: '0.95rem', fontWeight: 800, color: 'var(--text-white)' }}>GLOBAL THREAT MAP & INCIDENT ARCS</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem', fontSize: '0.7rem' }}>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-critical)' }}></span> Critical
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-high)' }}></span> High
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-medium)' }}></span> Medium
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: 'var(--status-low)' }}></span> Low
            </span>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      <div className="map-svg-container">
        <svg viewBox="0 0 960 400" style={{ width: '100%', height: '100%' }}>
          {/* Subtle World Map Grid Outlines */}
          <defs>
            <radialGradient id="mapGlow" cx="50%" cy="50%" r="50%">
              <stop offset="0%" stopColor="#FF2A4B" stopOpacity="0.15" />
              <stop offset="100%" stopColor="#000000" stopOpacity="0" />
            </radialGradient>
            <filter id="glow">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Continents Vector Outlines */}
          <path
            d="M 120 100 Q 180 80 260 120 T 320 220 T 260 310 Q 180 340 140 260 Z M 440 90 Q 520 70 600 110 T 640 220 Q 560 260 480 220 Z M 680 130 Q 760 100 840 140 T 880 250 T 780 330 Q 700 300 680 220 Z M 760 280 Q 820 260 880 290 T 860 360 Z"
            fill="#0E0E14"
            stroke="#1E1E2A"
            strokeWidth="1"
          />

          {/* Grid Lines */}
          {[100, 200, 300].map(y => (
            <line key={y} x1="0" y1={y} x2="960" y2={y} stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
          ))}
          {[200, 400, 600, 800].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="rgba(255,255,255,0.03)" strokeDasharray="3 3" />
          ))}

          {/* Glowing Attack Trajectory Arcs */}
          {arcs.map((arc, idx) => {
            const midX = (arc.from[0] + arc.to[0]) / 2;
            const midY = Math.min(arc.from[1], arc.to[1]) - 50;
            const pathD = `M ${arc.from[0]} ${arc.from[1]} Q ${midX} ${midY} ${arc.to[0]} ${arc.to[1]}`;
            return (
              <g key={idx}>
                <path d={pathD} fill="none" stroke={arc.color} strokeWidth="1.5" strokeDasharray="4 4" opacity="0.8" filter="url(#glow)" />
                <circle cx={midX} cy={midY} r="3" fill={arc.color} />
              </g>
            );
          })}

          {/* Pulsing Node Origin Points */}
          {nodes.map(node => {
            const color = node.severity === 'critical' ? '#FF2A4B' : node.severity === 'high' ? '#FF6B00' : node.severity === 'medium' ? '#FFA800' : '#00E676';
            return (
              <g key={node.id}>
                <circle cx={node.cx} cy={node.cy} r="12" fill={color} opacity="0.15" />
                <circle cx={node.cx} cy={node.cy} r="6" fill={color} opacity="0.4" />
                <circle cx={node.cx} cy={node.cy} r="3" fill="#FFFFFF" />
                <text x={node.cx + 8} y={node.cy + 3} fill="#A3A3A3" fontSize="9" fontFamily="Fira Code">{node.name}</text>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
