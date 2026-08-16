import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Clock, Zap, ChevronDown, ChevronUp, FileCode } from 'lucide-react';

export default function EventCard({ event }) {
  const [expanded, setExpanded] = useState(false);

  const getStatusColor = (level) => {
    switch (level) {
      case 'critical':
      case 'high': return 'var(--status-blocked)';
      case 'medium': return 'var(--status-suspicious)';
      case 'low': return 'var(--status-monitor)';
      case 'clean': return 'var(--status-clean)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <motion.div
      className="timeline-node"
      initial={{ opacity: 0, x: -6 }}
      animate={{ opacity: 1, x: 0 }}
      transition={{ duration: 0.15 }}
    >
      <div className={`timeline-dot-pin ${event.isLate ? 'late' : ''}`} />

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', cursor: 'pointer' }} onClick={() => setExpanded(!expanded)}>
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
            <span className="mono" style={{ fontWeight: 700, fontSize: '0.82rem', color: 'var(--text-white)' }}>
              {event.source.toUpperCase()}
            </span>
            <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-muted)' }}>[{event.type}]</span>
            {event.isLate && <span className="late-tag">⚡ LATE EVENT</span>}
          </div>

          <div style={{ fontSize: '0.78rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
            Threat Level: <span className="mono" style={{ fontWeight: 700, color: getStatusColor(event.threatLevel) }}>{event.threatLevel.toUpperCase()}</span> | Confidence: <span className="mono">{Math.round(event.confidence * 100)}%</span>
          </div>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
          <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
            {new Date(event.timestamp).toISOString()}
          </span>
          <button style={{ background: 'transparent', border: 'none', color: 'var(--text-muted)', cursor: 'pointer' }}>
            {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
          </button>
        </div>
      </div>

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: 'auto' }}
            exit={{ opacity: 0, height: 0 }}
            style={{ marginTop: '0.65rem', paddingTop: '0.65rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}
          >
            <div className="mono" style={{ color: 'var(--text-muted)', marginBottom: '0.3rem' }}>
              Event ID: {event.eventId} | Fingerprint: {event.fingerprint}
            </div>
            <div style={{ background: '#050505', border: '1px solid var(--border-subtle)', borderRadius: '4px', padding: '0.5rem', overflowX: 'auto' }}>
              <pre className="mono" style={{ fontSize: '0.68rem', color: 'var(--text-secondary)' }}>
                {JSON.stringify(event.normalizedData || event.data || {}, null, 2)}
              </pre>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
