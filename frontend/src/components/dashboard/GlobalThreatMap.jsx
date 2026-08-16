import React from 'react';
import { motion } from 'motion/react';
import { Globe, Maximize2 } from 'lucide-react';

export default function GlobalThreatMap() {
  const dots = [
    { start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" }, end: { lat: 51.5074, lng: -0.1278, label: "London" }, color: "#FF2A4B" },
    { start: { lat: 40.7128, lng: -74.006, label: "New York" }, end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, color: "#FF6B00" },
    { start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" }, end: { lat: 50.1109, lng: 8.6821, label: "Frankfurt" }, color: "#FF2A4B" },
    { start: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, color: "#FFA800" },
    { start: { lat: 55.7558, lng: 37.6173, label: "Moscow" }, end: { lat: 22.3193, lng: 114.1694, label: "Hong Kong" }, color: "#FF2A4B" }
  ];

  // Convert lat/lng coordinates into SVG canvas (x, y) coordinates (800x400 viewBox)
  const project = (lat, lng) => {
    const x = (lng + 180) * (800 / 360);
    const latRad = (lat * Math.PI) / 180;
    const mercN = Math.log(Math.tan(Math.PI / 4 + latRad / 2));
    const y = 200 - (800 * mercN) / (2 * Math.PI);
    return { x: Math.max(30, Math.min(770, x)), y: Math.max(30, Math.min(370, y)) };
  };

  // Generate SVG Bezier arc curve path string
  const createArc = (start, end) => {
    const p1 = project(start.lat, start.lng);
    const p2 = project(end.lat, end.lng);
    const midX = (p1.x + p2.x) / 2;
    const midY = Math.min(p1.y, p2.y) - Math.abs(p1.x - p2.x) * 0.25;
    return { path: `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`, p1, p2 };
  };

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

      <div className="map-svg-container" style={{ background: '#09090e', borderRadius: '8px', border: '1px solid var(--border-subtle)', overflow: 'hidden' }}>
        <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="glowArc">
              <feGaussianBlur stdDeviation="3" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <filter id="glowLand">
              <feGaussianBlur stdDeviation="1.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {/* Grid Latitude / Longitude Lines */}
          {[80, 160, 240, 320].map(y => (
            <line key={y} x1="0" y1={y} x2="800" y2={y} stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          ))}
          {[160, 320, 480, 640].map(x => (
            <line key={x} x1={x} y1="0" x2={x} y2="400" stroke="rgba(255,255,255,0.05)" strokeDasharray="4 4" />
          ))}

          {/* High-Contrast Visible Continent Landmass Paths */}
          <g fill="#161622" stroke="rgba(255, 42, 75, 0.25)" strokeWidth="1.2" filter="url(#glowLand)">
            {/* North America */}
            <path d="M 50 60 Q 120 30 240 40 T 270 140 T 210 190 T 170 240 L 140 200 L 120 150 L 70 130 L 40 90 Z" />
            {/* Greenland */}
            <path d="M 270 20 Q 320 15 360 35 T 340 90 L 280 80 Z" />
            {/* South America */}
            <path d="M 210 220 Q 280 220 310 270 T 270 370 T 220 340 L 190 260 Z" />
            {/* Europe */}
            <path d="M 370 60 Q 460 40 520 70 T 490 150 L 410 160 L 360 110 Z" />
            {/* Africa */}
            <path d="M 370 165 Q 490 155 530 210 T 490 350 L 420 330 L 360 220 Z" />
            {/* Asia */}
            <path d="M 510 60 Q 660 30 770 70 T 790 210 L 710 240 L 620 220 L 510 150 Z" />
            {/* Australia */}
            <path d="M 650 260 Q 760 250 780 300 T 740 370 L 640 340 Z" />
          </g>

          {/* High-Density Visible Dotted Matrix Layer */}
          {Array.from({ length: 40 }).map((_, row) =>
            Array.from({ length: 80 }).map((_, col) => {
              const x = col * 10;
              const y = row * 10;
              const isLand =
                (x > 40 && x < 270 && y > 30 && y < 240) || // NA
                (x > 190 && x < 310 && y > 210 && y < 370) || // SA
                (x > 360 && x < 520 && y > 40 && y < 160) || // EU
                (x > 350 && x < 530 && y > 160 && y < 350) || // AF
                (x > 500 && x < 790 && y > 30 && y < 240) || // ASIA
                (x > 630 && x < 790 && y > 240 && y < 370); // AU

              if (!isLand || (row + col) % 2 !== 0) return null;
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={x}
                  cy={y}
                  r="1.5"
                  fill="#454563"
                  opacity="0.85"
                />
              );
            })
          )}

          {/* Animated Arc Lines (Aceternity UI Style) */}
          {dots.map((d, i) => {
            const { path, p1, p2 } = createArc(d.start, d.end);
            return (
              <g key={i}>
                {/* Arc Track */}
                <path
                  d={path}
                  fill="none"
                  stroke="rgba(255, 255, 255, 0.12)"
                  strokeWidth="1.5"
                />

                {/* Animated Arc Pulse Path */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="2.5"
                  filter="url(#glowArc)"
                  initial={{ pathLength: 0, opacity: 0 }}
                  animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                  transition={{
                    duration: 3 + i * 0.5,
                    repeat: Infinity,
                    ease: "easeInOut",
                    delay: i * 0.6
                  }}
                />

                {/* Origin Location Point & Pulsing Ring */}
                <g transform={`translate(${p1.x}, ${p1.y})`}>
                  <circle r="10" fill={d.color} opacity="0.25">
                    <animate attributeName="r" values="3;14;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill={d.color} />
                  <text y="-8" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="Fira Code" fontWeight="700">
                    {d.start.label}
                  </text>
                </g>

                {/* Target Location Point & Pulsing Ring */}
                <g transform={`translate(${p2.x}, ${p2.y})`}>
                  <circle r="10" fill={d.color} opacity="0.25">
                    <animate attributeName="r" values="3;14;3" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.7;0;0.7" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="4" fill="#FFFFFF" />
                  <text y="-8" textAnchor="middle" fill="#FFFFFF" fontSize="9" fontFamily="Fira Code" fontWeight="800">
                    {d.end.label}
                  </text>
                </g>
              </g>
            );
          })}
        </svg>
      </div>
    </div>
  );
}
