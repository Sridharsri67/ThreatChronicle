import React, { useState } from 'react';
import { motion } from 'motion/react';
import { Shield, Copy, Check, Fingerprint, Download, FileText } from 'lucide-react';

export default function DecisionHero({ threat }) {
  const [copied, setCopied] = useState(false);

  if (!threat) return null;

  const handleCopyFingerprint = () => {
    if (threat.decisionFingerprint) {
      navigator.clipboard.writeText(threat.decisionFingerprint);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    }
  };

  const handleDownloadReport = (format = 'json') => {
    if (!threat || !threat.threatId) return;
    const url = `/api/threats/${encodeURIComponent(threat.threatId)}/report?format=${format}`;
    const link = document.createElement('a');
    link.href = url;
    link.download = `ThreatChronicle_Report_${threat.threatId}.${format}`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

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
      className="decision-card"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.2 }}
    >
      <div className="decision-card-top">
        <div className="decision-title-group">
          <span className="decision-eyebrow">Active Threat Investigation</span>
          <h2 className="decision-threat-id mono">{threat.threatId}</h2>
        </div>

        <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
          <span className={`badge-status ${getBadgeClass(threat.decision)}`} style={{ fontSize: '0.75rem', padding: '0.25rem 0.6rem' }}>
            {threat.decision}
          </span>
          <span className="badge-v mono" style={{ fontSize: '0.75rem', padding: '0.2rem 0.5rem' }}>
            STATE v{threat.version}
          </span>

          <div style={{ display: 'flex', gap: '0.3rem', marginLeft: '0.5rem' }}>
            <button
              onClick={() => handleDownloadReport('pdf')}
              className="sim-card-btn"
              title="Download PDF Executive Report"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.55rem', fontSize: '0.68rem', background: 'var(--text-white)', color: '#000', border: 'none', fontWeight: 700 }}
            >
              <Download size={12} />
              <span>DOWNLOAD PDF REPORT</span>
            </button>
            <button
              onClick={() => handleDownloadReport('txt')}
              className="sim-card-btn"
              title="Download TXT Audit Report"
              style={{ display: 'flex', alignItems: 'center', gap: '0.35rem', padding: '0.25rem 0.55rem', fontSize: '0.68rem', background: 'var(--bg-elevated)', border: '1px solid var(--border-medium)', color: 'var(--text-secondary)' }}
            >
              <FileText size={12} />
              <span>TXT</span>
            </button>
          </div>
        </div>
      </div>

      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(160px, 1fr))', gap: '0.85rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-subtle)' }}>
        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700, letterSpacing: '0.05em' }}>DECISION CONFIDENCE</div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-white)' }}>
            {Math.round(threat.confidence * 100)}%
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700, letterSpacing: '0.05em' }}>EVIDENCE SOURCES</div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-white)' }}>
            {threat.totalEvents}
          </div>
        </div>

        <div>
          <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', uppercase: true, fontWeight: 700, letterSpacing: '0.05em' }}>CORRELATION RULE VERSION</div>
          <div className="mono" style={{ fontSize: '1.2rem', fontWeight: 700, color: 'var(--text-secondary)' }}>
            {threat.ruleVersion || 'v1.0'}
          </div>
        </div>
      </div>

      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.5rem 0.75rem', fontSize: '0.75rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', overflow: 'hidden' }}>
          <Fingerprint size={14} style={{ color: 'var(--text-muted)', flexShrink: 0 }} />
          <span className="mono" style={{ color: 'var(--text-muted)' }}>SHA256:</span>
          <span className="mono" style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
            {threat.decisionFingerprint}
          </span>
        </div>

        <button
          onClick={handleCopyFingerprint}
          style={{ background: 'transparent', border: 'none', color: 'var(--text-secondary)', cursor: 'pointer', display: 'flex', alignItems: 'center', gap: '0.3rem', fontSize: '0.7rem', flexShrink: 0, marginLeft: '0.5rem' }}
        >
          {copied ? <Check size={13} style={{ color: 'var(--status-clean)' }} /> : <Copy size={13} />}
          <span className="mono">{copied ? 'COPIED' : 'COPY'}</span>
        </button>
      </div>
    </motion.div>
  );
}
