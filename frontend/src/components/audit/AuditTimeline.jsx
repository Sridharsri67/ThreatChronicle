import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { GitCommit, ChevronDown, ChevronUp } from 'lucide-react';

export default function AuditTimeline({ audits }) {
  const [expandedVersion, setExpandedVersion] = useState(null);

  if (!audits || audits.length === 0) return null;

  const getStatusColor = (decision) => {
    switch (decision) {
      case 'BLOCKED': return 'var(--status-blocked)';
      case 'SUSPICIOUS': return 'var(--status-suspicious)';
      case 'MONITOR': return 'var(--status-monitor)';
      case 'CLEAN': return 'var(--status-clean)';
      default: return 'var(--text-secondary)';
    }
  };

  return (
    <div className="timeline-section">
      <div className="card-heading">
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <GitCommit size={15} />
          <span>Versioned Decision Audit Trail</span>
        </div>
        <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', fontWeight: 400 }}>
          IMMUTABLE LEDGER
        </span>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
        {audits.map(audit => (
          <div
            key={audit.stateVersion}
            style={{ background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.65rem 0.75rem', cursor: 'pointer' }}
            onClick={() => setExpandedVersion(expandedVersion === audit.stateVersion ? null : audit.stateVersion)}
          >
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="badge-v mono">v{audit.stateVersion}</span>
                <span className="mono" style={{ fontSize: '0.8rem', fontWeight: 700, color: getStatusColor(audit.decision) }}>
                  {audit.decision}
                </span>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  ({Math.round(audit.confidence * 100)}% confidence)
                </span>
              </div>

              <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>
                  {new Date(audit.createdAt).toLocaleTimeString()}
                </span>
                {expandedVersion === audit.stateVersion ? <ChevronUp size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />}
              </div>
            </div>

            <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              {audit.changeReason}
            </div>

            <AnimatePresence>
              {expandedVersion === audit.stateVersion && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  style={{ marginTop: '0.5rem', paddingTop: '0.5rem', borderTop: '1px solid var(--border-subtle)', fontSize: '0.72rem' }}
                >
                  <div className="mono" style={{ color: 'var(--text-muted)' }}>
                    Trigger Event: {audit.triggerEventId} ({audit.triggerEventSource}) {audit.triggerEventIsLate ? '[⚡ LATE]' : ''}
                  </div>
                  <div className="mono" style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Replay Fingerprint: {audit.replayFingerprint}
                  </div>
                  <div style={{ color: 'var(--text-muted)', marginTop: '0.15rem' }}>
                    Rules Applied: {audit.rulesApplied ? audit.rulesApplied.join(', ') : 'v1.0'}
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        ))}
      </div>
    </div>
  );
}
