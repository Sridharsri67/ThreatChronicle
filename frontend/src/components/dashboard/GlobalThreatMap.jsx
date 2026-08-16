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
    return { x: Math.max(20, Math.min(780, x)), y: Math.max(30, Math.min(370, y)) };
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

      <div className="map-svg-container">
        <svg viewBox="0 0 800 400" style={{ width: '100%', height: '100%' }}>
          <defs>
            <filter id="glowArc">
              <feGaussianBlur stdDeviation="2.5" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
            <linearGradient id="arcGradient" x1="0%" y1="0%" x2="100%" y2="100%">
              <stop offset="0%" stopColor="#FF2A4B" stopOpacity="0.8" />
              <stop offset="100%" stopColor="#FF6B00" stopOpacity="0.8" />
            </linearGradient>
          </defs>

          {/* Dotted World Grid Map Projection */}
          {Array.from({ length: 40 }).map((_, row) =>
            Array.from({ length: 80 }).map((_, col) => {
              const x = col * 10;
              const y = row * 10;
              // Filter dots roughly in landmass bounds
              const isLand =
                (x > 100 && x < 260 && y > 60 && y < 220) || // North America
                (x > 180 && x < 280 && y > 220 && y < 350) || // South America
                (x > 380 && x < 520 && y > 50 && y < 160) || // Europe
                (x > 370 && x < 500 && y > 160 && y < 320) || // Africa
                (x > 500 && x < 750 && y > 50 && y < 240) || // Asia
                (x > 640 && x < 760 && y > 250 && y < 350); // Australia

              if (!isLand || (row + col) % 2 !== 0) return null;
              return (
                <circle
                  key={`${row}-${col}`}
                  cx={x}
                  cy={y}
                  r="1"
                  fill="#2A2A38"
                  opacity="0.6"
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
                  stroke="rgba(255, 255, 255, 0.08)"
                  strokeWidth="1.5"
                />

                {/* Animated Arc Pulse Path */}
                <motion.path
                  d={path}
                  fill="none"
                  stroke={d.color}
                  strokeWidth="2"
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
                  <circle r="8" fill={d.color} opacity="0.2">
                    <animate attributeName="r" values="3;12;3" dur="2s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill={d.color} />
                  <text y="-7" textAnchor="middle" fill="#C4C4D0" fontSize="8" fontFamily="Fira Code" fontWeight="600">
                    {d.start.label}
                  </text>
                </g>

                {/* Target Location Point & Pulsing Ring */}
                <g transform={`translate(${p2.x}, ${p2.y})`}>
                  <circle r="8" fill={d.color} opacity="0.2">
                    <animate attributeName="r" values="3;12;3" dur="2.5s" repeatCount="indefinite" />
                    <animate attributeName="opacity" values="0.6;0;0.6" dur="2.5s" repeatCount="indefinite" />
                  </circle>
                  <circle r="3" fill="#FFFFFF" />
                  <text y="-7" textAnchor="middle" fill="#FFFFFF" fontSize="8" fontFamily="Fira Code" fontWeight="700">
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
