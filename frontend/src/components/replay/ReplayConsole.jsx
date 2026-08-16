import React, { useState } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Play, CheckCircle2, AlertTriangle, RefreshCw, ShieldCheck } from 'lucide-react';

export default function ReplayConsole({ threatId, onRunReplay }) {
  const [isReplaying, setIsReplaying] = useState(false);
  const [step, setStep] = useState(0);
  const [replayResult, setReplayResult] = useState(null);

  const handleRunReplay = async () => {
    if (!threatId || isReplaying) return;
    setIsReplaying(true);
    setReplayResult(null);
    setStep(1);

    // Multi-stage animated simulation steps for visual quality
    setTimeout(async () => {
      setStep(2);
      setTimeout(async () => {
        setStep(3);
        try {
          const res = await onRunReplay(threatId);
          setReplayResult(res);
        } catch (err) {
          console.error('Replay execution error:', err);
        } finally {
          setIsReplaying(false);
          setStep(0);
        }
      }, 300);
    }, 250);
  };

  return (
    <div className="replay-console-box">
      <div className="replay-console-header">
        <div>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.88rem', fontWeight: 700, color: 'var(--text-white)' }}>
            <ShieldCheck size={16} />
            <span>Replay Verification Console</span>
          </div>
          <p style={{ fontSize: '0.75rem', color: 'var(--text-muted)', marginTop: '0.15rem' }}>
            Reconstructs state purely from raw event stream and compares replayed fingerprint against stored decision.
          </p>
        </div>

        <button className="btn-replay" onClick={handleRunReplay} disabled={isReplaying}>
          {isReplaying ? (
            <>
              <RefreshCw size={14} className="spin" style={{ animation: 'spin 1s linear infinite' }} />
              <span>Replaying...</span>
            </>
          ) : (
            <>
              <Play size={14} />
              <span>RUN REPLAY VERIFICATION</span>
            </>
          )}
        </button>
      </div>

      {/* Progress Animation Step Indicator */}
      {isReplaying && (
        <motion.div
          initial={{ opacity: 0, height: 0 }}
          animate={{ opacity: 1, height: 'auto' }}
          exit={{ opacity: 0, height: 0 }}
          style={{ fontSize: '0.75rem', color: 'var(--text-secondary)', background: 'var(--bg-darkest)', padding: '0.6rem 0.85rem', borderRadius: '5px', border: '1px solid var(--border-subtle)' }}
        >
          <div className="mono" style={{ color: 'var(--text-muted)', fontSize: '0.7rem' }}>
            {step === 1 && 'Step 1/3: Loading raw historical events from immutable event store...'}
            {step === 2 && 'Step 2/3: Applying 4-tier deterministic tie-breaking & conflict resolution...'}
            {step === 3 && 'Step 3/3: Recalculating decision & generating SHA256 checksum...'}
          </div>
        </motion.div>
      )}

      {/* Verification Result Banner */}
      <AnimatePresence mode="wait">
        {replayResult && (
          <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            {replayResult.match ? (
              <div className="replay-banner replay-banner-pass">
                <CheckCircle2 size={18} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>✓ REPLAY VERIFIED — 100% Deterministic Match</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85, marginTop: '0.15rem' }}>
                    Stored: <strong>{replayResult.stored.decision}</strong> | Replayed: <strong>{replayResult.replayed.decision}</strong> | Checksum Fingerprints MATCH
                  </div>
                </div>
              </div>
            ) : (
              <div className="replay-banner replay-banner-mismatch">
                <AlertTriangle size={18} style={{ flexShrink: 0 }} />
                <div>
                  <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>⚠ REPLAY MISMATCH DETECTED</div>
                  <div style={{ fontSize: '0.75rem', opacity: 0.85 }}>
                    Stored: {replayResult.stored.decision} | Replayed: {replayResult.replayed.decision}
                  </div>
                </div>
              </div>
            )}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
