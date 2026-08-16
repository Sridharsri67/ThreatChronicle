import React, { useMemo } from 'react';
import { motion } from 'motion/react';
import { Globe, Maximize2 } from 'lucide-react';
import DottedMap from 'dotted-map';

export default function GlobalThreatMap() {
  // Generate high-resolution pixel-perfect dotted world map SVG using dotted-map
  const { svgMap, points } = useMemo(() => {
    const map = new DottedMap({ height: 50, grid: 'diagonal' });

    const dots = [
      { start: { lat: 37.7749, lng: -122.4194, label: "San Francisco" }, end: { lat: 51.5074, lng: -0.1278, label: "London" }, color: "#00E5FF" },
      { start: { lat: 40.7128, lng: -74.006, label: "New York" }, end: { lat: 35.6762, lng: 139.6503, label: "Tokyo" }, color: "#FF2A4B" },
      { start: { lat: -23.5505, lng: -46.6333, label: "São Paulo" }, end: { lat: 50.1109, lng: 8.6821, label: "Frankfurt" }, color: "#00E5FF" },
      { start: { lat: 1.3521, lng: 103.8198, label: "Singapore" }, end: { lat: -33.8688, lng: 151.2093, label: "Sydney" }, color: "#00E5FF" },
      { start: { lat: 55.7558, lng: 37.6173, label: "Moscow" }, end: { lat: 22.3193, lng: 114.1694, label: "Hong Kong" }, color: "#FF2A4B" }
    ];

    const projectedArcs = dots.map(d => {
      const p1 = map.getPin({ lat: d.start.lat, lng: d.start.lng });
      const p2 = map.getPin({ lat: d.end.lat, lng: d.end.lng });
      
      const midX = (p1.x + p2.x) / 2;
      const midY = Math.min(p1.y, p2.y) - Math.abs(p1.x - p2.x) * 0.35;
      const pathD = `M ${p1.x} ${p1.y} Q ${midX} ${midY} ${p2.x} ${p2.y}`;
      
      return { path: pathD, p1, p2, color: d.color, startLabel: d.start.label, endLabel: d.end.label };
    });

    const svg = map.getSVG({
      radius: 0.22,
      color: 'rgba(255, 255, 255, 0.28)',
      shape: 'circle',
      backgroundColor: '#050508'
    }).replace('<svg ', '<svg preserveAspectRatio="none" style="width:100%;height:100%;display:block;" ');

    return { svgMap: svg, points: projectedArcs };
  }, []);

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
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#FF2A4B' }}></span> Critical
            </span>
            <span style={{ display: 'flex', alignItems: 'center', gap: '0.25rem', color: 'var(--text-muted)' }}>
              <span style={{ width: '6px', height: '6px', borderRadius: '50%', background: '#00E5FF' }}></span> Active Flow
            </span>
          </div>

          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            <Maximize2 size={14} />
          </button>
        </div>
      </div>

      {/* Dotted World Map Container */}
      <div
        className="map-svg-container"
        style={{
          background: '#040406',
          borderRadius: '8px',
          border: '1px solid var(--border-subtle)',
          position: 'relative',
          overflow: 'hidden',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center'
        }}
      >
        {/* Aceternity Dotted World Map Image Background */}
        <div
          dangerouslySetInnerHTML={{ __html: svgMap }}
          style={{ width: '100%', height: '100%', opacity: 0.85 }}
        />

        {/* Overlay Animated Curved Arcs Layer */}
        <svg
          viewBox="0 0 100 50"
          style={{
            position: 'absolute',
            inset: 0,
            width: '100%',
            height: '100%',
            pointerEvents: 'none'
          }}
        >
          <defs>
            <filter id="aceternityGlow">
              <feGaussianBlur stdDeviation="0.6" result="coloredBlur"/>
              <feMerge>
                <feMergeNode in="coloredBlur"/>
                <feMergeNode in="SourceGraphic"/>
              </feMerge>
            </filter>
          </defs>

          {points.map((arc, i) => (
            <g key={i}>
              {/* Static Background Arc Guide */}
              <path
                d={arc.path}
                fill="none"
                stroke="rgba(255, 255, 255, 0.08)"
                strokeWidth="0.3"
              />

              {/* Animated Neon Cyan / Crimson Arc Path */}
              <motion.path
                d={arc.path}
                fill="none"
                stroke={arc.color}
                strokeWidth="0.5"
                filter="url(#aceternityGlow)"
                initial={{ pathLength: 0, opacity: 0 }}
                animate={{ pathLength: [0, 1, 1], opacity: [0, 1, 0] }}
                transition={{
                  duration: 3 + i * 0.5,
                  repeat: Infinity,
                  ease: "easeInOut",
                  delay: i * 0.5
                }}
              />

              {/* Origin Marker */}
              <g transform={`translate(${arc.p1.x}, ${arc.p1.y})`}>
                <circle r="1" fill={arc.color} opacity="0.3">
                  <animate attributeName="r" values="0.5;2;0.5" dur="2s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2s" repeatCount="indefinite" />
                </circle>
                <circle r="0.5" fill={arc.color} />
              </g>

              {/* Target Marker */}
              <g transform={`translate(${arc.p2.x}, ${arc.p2.y})`}>
                <circle r="1" fill={arc.color} opacity="0.3">
                  <animate attributeName="r" values="0.5;2;0.5" dur="2.5s" repeatCount="indefinite" />
                  <animate attributeName="opacity" values="0.8;0;0.8" dur="2.5s" repeatCount="indefinite" />
                </circle>
                <circle r="0.5" fill="#FFFFFF" />
              </g>
            </g>
          ))}
        </svg>
      </div>
    </div>
  );
}
