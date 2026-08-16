import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Shield } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, threats, onSelectThreat }) {
  const [query, setQuery] = useState('');

  useEffect(() => {
    const handleKeyDown = (e) => {
      if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
        e.preventDefault();
        isOpen ? onClose() : null;
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  if (!isOpen) return null;

  const filteredThreats = (threats || []).filter(t => 
    t.threatId.toLowerCase().includes(query.toLowerCase()) ||
    t.decision.toLowerCase().includes(query.toLowerCase())
  );

  return (
    <AnimatePresence>
      <div className="cmd-backdrop" onClick={onClose}>
        <motion.div
          className="cmd-modal"
          onClick={(e) => e.stopPropagation()}
          initial={{ opacity: 0, scale: 0.96, y: -10 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          exit={{ opacity: 0, scale: 0.96, y: -10 }}
          transition={{ duration: 0.15, ease: 'easeOut' }}
        >
          <div className="cmd-input-wrap">
            <Search size={16} style={{ color: 'var(--text-muted)' }} />
            <input
              type="text"
              className="cmd-input"
              placeholder="Search threat ID, IP, domain, or hash..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <span className="kbd">ESC</span>
          </div>

          <div className="cmd-list">
            <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
              Active Threat Queue ({filteredThreats.length})
            </div>

            {filteredThreats.map(t => (
              <div key={t.threatId} className="cmd-item" onClick={() => { onSelectThreat(t.threatId); onClose(); }}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <Shield size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span className="mono" style={{ fontWeight: 600 }}>{t.threatId}</span>
                </div>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <span className={`badge-status badge-${t.decision.toLowerCase()}`}>{t.decision}</span>
                  <span className="badge-v mono">v{t.version}</span>
                </div>
              </div>
            ))}
          </div>
        </motion.div>
      </div>
    </AnimatePresence>
  );
}
