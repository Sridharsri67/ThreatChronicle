import React, { useState } from 'react';
import { Send, Zap, AlertCircle, RefreshCw } from 'lucide-react';

export default function EventInjector({ onLoadFixture, onInjectCustom }) {
  const [loading, setLoading] = useState(false);
  const [message, setMessage] = useState('');

  const handleFixtureClick = async (name) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await onLoadFixture(name);
      setMessage(`Successfully loaded '${name}' fixture (${res.totalEventsProcessed} events processed)`);
    } catch (err) {
      setMessage(`Failed to load fixture: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="simulator-bar">
      <div style={{ display: 'flex', alignItems: 'center', gap: '0.6rem' }}>
        <Zap size={18} className="text-accent" />
        <div>
          <div style={{ fontWeight: 700, fontSize: '0.85rem' }}>Edge-Case Event Simulator</div>
          <div style={{ fontSize: '0.75rem', color: 'var(--text-secondary)' }}>Inject test events to trigger real-time state reconstruction</div>
        </div>
      </div>

      <div style={{ display: 'flex', gap: '0.5rem', flexWrap: 'wrap' }}>
        <button className="sim-btn" onClick={() => handleFixtureClick('conflict')} disabled={loading}>
          Conflict Test
        </button>
        <button className="sim-btn" onClick={() => handleFixtureClick('late-event')} disabled={loading}>
          Late Event Test
        </button>
        <button className="sim-btn" onClick={() => handleFixtureClick('duplicate')} disabled={loading}>
          Duplicate Test
        </button>
        <button className="sim-btn" onClick={() => handleFixtureClick('invalidation')} disabled={loading}>
          Clean Invalidation
        </button>
        <button className="sim-btn" onClick={() => handleFixtureClick('all')} disabled={loading} style={{ background: 'var(--color-accent)', color: '#000' }}>
          Load All 8 Fixtures
        </button>
      </div>

      {message && (
        <div style={{ fontSize: '0.75rem', color: 'var(--color-accent)', fontWeight: 600 }}>
          {message}
        </div>
      )}
    </div>
  );
}
