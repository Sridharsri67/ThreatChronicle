import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'motion/react';
import { Search, Play, Zap, Shield, Filter, FileText, X } from 'lucide-react';

export default function CommandPalette({ isOpen, onClose, threats, onSelectThreat, onLoadFixture, onRunReplay }) {
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

  const actions = [
    { id: 'act_load_all', name: 'Load All Edge-Case Fixtures', icon: Zap, action: () => { onLoadFixture('all'); onClose(); } },
    { id: 'act_load_conflict', name: 'Load Multi-Source Conflict Fixture', icon: Zap, action: () => { onLoadFixture('conflict'); onClose(); } },
    { id: 'act_load_late', name: 'Load Historical Late-Event Fixture', icon: Zap, action: () => { onLoadFixture('late-event'); onClose(); } },
    { id: 'act_load_dup', name: 'Load Duplicate Payload Fixture', icon: Zap, action: () => { onLoadFixture('duplicate'); onClose(); } }
  ];

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
              placeholder="Search threat ID, IP, domain, hash, or action..."
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              autoFocus
            />
            <span className="kbd">ESC</span>
          </div>

          <div className="cmd-list">
            {/* Action Items */}
            {query === '' && (
              <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase' }}>
                Quick Actions
              </div>
            )}

            {query === '' && actions.map(act => (
              <div key={act.id} className="cmd-item" onClick={act.action}>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
                  <act.icon size={14} style={{ color: 'var(--text-secondary)' }} />
                  <span>{act.name}</span>
                </div>
                <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--text-muted)' }}>ACTION</span>
              </div>
            ))}

            {/* Threats Listing */}
            <div style={{ padding: '0.4rem 0.75rem', fontSize: '0.65rem', fontWeight: 700, letterSpacing: '0.08em', color: 'var(--text-muted)', textTransform: 'uppercase', marginTop: '0.4rem' }}>
              Threats ({filteredThreats.length})
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
