import React, { useState } from 'react';
import { Play, CheckCircle, AlertTriangle, Shield, Clock, GitCommit, Layers, FileText } from 'lucide-react';

export default function ThreatDetail({ threatData, onRunReplay }) {
  const [replayState, setReplayState] = useState(null);
  const [isReplaying, setIsReplaying] = useState(false);

  if (!threatData) {
    return (
      <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
        Select a threat from the sidebar to inspect its deterministic state reconstruction, evidence timeline, and replay verification.
      </div>
    );
  }

  const handleReplayClick = async () => {
    setIsReplaying(true);
    setReplayState(null);
    try {
      const res = await onRunReplay(threatData.threatId);
      setReplayState(res);
    } catch (err) {
      console.error('Replay error:', err);
    } finally {
      setIsReplaying(false);
    }
  };

  const getDecisionColor = (decision) => {
    switch (decision) {
      case 'BLOCKED': return 'var(--color-blocked)';
      case 'SUSPICIOUS': return 'var(--color-suspicious)';
      case 'MONITOR': return 'var(--color-monitor)';
      case 'CLEAN': return 'var(--color-clean)';
      default: return 'var(--text-primary)';
    }
  };

  return (
    <div className="inspector-panel">
      {/* 1. Threat Decision Summary Header */}
      <div className="panel-card">
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '1rem' }}>
          <div>
            <div style={{ fontSize: '0.75rem', color: 'var(--text-muted)', textTransform: 'uppercase' }}>Target Threat ID</div>
            <h2 className="mono" style={{ fontSize: '1.4rem', fontWeight: 800 }}>{threatData.threatId}</h2>
          </div>
          <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
            <span className="badge badge-version" style={{ fontSize: '0.85rem', padding: '0.2rem 0.6rem' }}>
              State Version: v{threatData.version}
            </span>
          </div>
        </div>

        <div className="decision-grid">
          <div className="decision-stat">
            <span className="stat-label">Current Decision</span>
            <span className="stat-value" style={{ color: getDecisionColor(threatData.decision) }}>
              {threatData.decision}
            </span>
          </div>

          <div className="decision-stat">
            <span className="stat-label">Decision Confidence</span>
            <span className="stat-value">{Math.round(threatData.confidence * 100)}%</span>
          </div>

          <div className="decision-stat">
            <span className="stat-label">Total Sourced Events</span>
            <span className="stat-value">{threatData.totalEvents}</span>
          </div>

          <div className="decision-stat">
            <span className="stat-label">Rule Version</span>
            <span className="stat-value mono" style={{ fontSize: '1rem', color: 'var(--color-accent)' }}>
              {threatData.ruleVersion || 'v1.0'}
            </span>
          </div>
        </div>

        <div style={{ marginTop: '1rem', paddingTop: '0.75rem', borderTop: '1px solid var(--border-color)', fontSize: '0.75rem', color: 'var(--text-secondary)' }} className="mono">
          <span style={{ color: 'var(--text-muted)' }}>SHA256 Decision Fingerprint: </span>
          <span style={{ color: 'var(--color-accent)' }}>{threatData.decisionFingerprint}</span>
        </div>
      </div>

      {/* 2. Signature Replay Verification Console */}
      <div className="replay-box">
        <div className="replay-header">
          <div>
            <h3 style={{ fontSize: '1.05rem', fontWeight: 700, display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
              <Play size={18} className="text-accent" />
              Deterministic Replay Verification Console
            </h3>
            <p style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
              Reconstructs threat state from raw historical event stream and compares replayed fingerprint against stored state.
            </p>
          </div>

          <button className="replay-btn" onClick={handleReplayClick} disabled={isReplaying}>
            <Play size={16} />
            {isReplaying ? 'Replaying...' : 'Run Replay Verification'}
          </button>
        </div>

        {replayState && (
          <div style={{ marginTop: '0.5rem' }}>
            {replayState.match ? (
              <div className="replay-result-badge replay-pass">
                <CheckCircle size={20} />
                <div>
                  <div>✓ REPLAY VERIFIED — 100% Deterministic Match</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 400, color: 'rgba(255,255,255,0.8)' }}>
                    Original Decision: <strong>{replayState.stored.decision}</strong> | Replayed Decision: <strong>{replayState.replayed.decision}</strong> | Fingerprints MATCH
                  </div>
                </div>
              </div>
            ) : (
              <div className="replay-result-badge replay-mismatch">
                <AlertTriangle size={20} />
                <div>
                  <div>⚠ REPLAY MISMATCH DETECTED</div>
                  <div style={{ fontSize: '0.75rem', fontWeight: 400 }}>
                    Stored: {replayState.stored.decision} | Replayed: {replayState.replayed.decision}
                  </div>
                </div>
              </div>
            )}
          </div>
        )}
      </div>

      {/* 3. Interactive Threat Event Timeline */}
      <div className="panel-card">
        <h3 className="card-title">
          <Clock size={16} className="text-accent" />
          Event Timeline & Reconstruction History ({threatData.rawEvents ? threatData.rawEvents.length : 0} events)
        </h3>

        <div className="timeline-container">
          {threatData.rawEvents && threatData.rawEvents.map((evt, idx) => (
            <div key={evt.eventId || idx} className="timeline-item">
              <div className={`timeline-dot ${evt.isLate ? 'late' : ''}`} />
              <div className="timeline-header">
                <div style={{ display: 'flex', gap: '0.5rem', alignItems: 'center' }}>
                  <span className="mono" style={{ fontWeight: 700, fontSize: '0.85rem' }}>{evt.source.toUpperCase()}</span>
                  <span className="badge badge-monitor" style={{ fontSize: '0.65rem' }}>{evt.type}</span>
                  {evt.isLate && <span className="late-badge">⚡ LATE EVENT</span>}
                </div>
                <span className="mono" style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>
                  Event Time: {new Date(evt.timestamp).toISOString()}
                </span>
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)' }}>
                Threat Level: <strong style={{ color: getDecisionColor(evt.threatLevel) }}>{evt.threatLevel.toUpperCase()}</strong> | Confidence: {Math.round(evt.confidence * 100)}%
              </div>
              <div className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)', marginTop: '0.25rem' }}>
                Fingerprint: {evt.fingerprint}
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* 4. Conflict Resolution Log */}
      {threatData.audits && threatData.audits.length > 0 && threatData.audits[threatData.audits.length - 1].resolutionSteps && (
        <div className="panel-card">
          <h3 className="card-title">
            <Layers size={16} className="text-accent" />
            Conflict Resolution Rationale & Source Ranking
          </h3>
          {threatData.audits[threatData.audits.length - 1].resolutionSteps.map((step, idx) => (
            <div key={idx} className="step-item">
              <div style={{ fontWeight: 700, color: 'var(--color-accent)' }}>
                Step {step.step}: {step.description}
              </div>
              {step.reason && <div style={{ color: 'var(--text-secondary)', marginTop: '0.2rem' }}>{step.reason}</div>}
            </div>
          ))}
        </div>
      )}

      {/* 5. Decision Audit History Log */}
      <div className="panel-card">
        <h3 className="card-title">
          <GitCommit size={16} className="text-accent" />
          Versioned Audit History Trail
        </h3>
        <div style={{ display: 'flex', flexDirection: 'column', gap: '0.75rem' }}>
          {threatData.audits && threatData.audits.map(audit => (
            <div key={audit.stateVersion} style={{ background: 'var(--bg-primary)', border: '1px solid var(--border-color)', borderRadius: '8px', padding: '0.85rem' }}>
              <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.35rem' }}>
                <span className="badge badge-version">State Version v{audit.stateVersion}</span>
                <span style={{ fontSize: '0.75rem', color: 'var(--text-muted)' }}>{new Date(audit.createdAt).toLocaleString()}</span>
              </div>
              <div style={{ fontSize: '0.85rem', fontWeight: 600 }}>
                Decision: <span style={{ color: getDecisionColor(audit.decision) }}>{audit.decision}</span> ({Math.round(audit.confidence * 100)}% confidence)
              </div>
              <div style={{ fontSize: '0.8rem', color: 'var(--text-secondary)', marginTop: '0.2rem' }}>
                Reason: {audit.changeReason}
              </div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
