import React from 'react';
import { motion } from 'motion/react';

export default function ThreatListItem({ threat, isSelected, onSelect }) {
  const getBadgeClass = (decision) => {
    switch (decision) {
      case 'BLOCKED': return 'badge-blocked';
      case 'SUSPICIOUS': return 'badge-suspicious';
      case 'MONITOR': return 'badge-monitor';
      case 'CLEAN': return 'badge-clean';
      default: return 'badge-monitor';
    }
  };

  return (
    <motion.div
      className={`threat-row ${isSelected ? 'active' : ''}`}
      onClick={onSelect}
      whileHover={{ x: 2 }}
      transition={{ duration: 0.12 }}
    >
      <div className="threat-row-top">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <span className={`badge-status ${getBadgeClass(threat.decision)}`}>
            {threat.decision}
          </span>
          <span className="badge-v mono">v{threat.version}</span>
        </div>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
          {Math.round(threat.confidence * 100)}%
        </span>
      </div>

      <div className="threat-row-id mono">{threat.threatId}</div>

      <div style={{ display: 'flex', justifyContent: 'space-between', fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.1rem' }}>
        <span>{threat.totalEvents} evidence source(s)</span>
        <span>{new Date(threat.updatedAt || threat.lastEventTime).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })}</span>
      </div>
    </motion.div>
  );
}
