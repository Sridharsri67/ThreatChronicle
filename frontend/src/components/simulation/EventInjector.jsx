import React, { useState } from 'react';
import { Zap, Globe, Search, RefreshCw } from 'lucide-react';
import { fetchLiveIntelligence } from '../../services/api';

export default function EventInjector({ onLoadFixture, onRefreshData }) {
  const [loading, setLoading] = useState(false);
  const [liveInput, setLiveInput] = useState('');
  const [message, setMessage] = useState('');

  const fixtures = [
    { name: 'conflict', label: 'CONFLICT' },
    { name: 'late-event', label: 'LATE EVENT' },
    { name: 'duplicate', label: 'DUPLICATE' },
    { name: 'invalidation', label: 'CLEAN INVALIDATION' },
    { name: 'out-of-order', label: 'OUT OF ORDER' },
    { name: 'same-timestamp', label: 'SAME TIMESTAMP' },
    { name: 'ai-report', label: 'AI REPORT' },
    { name: 'mixed-incident', label: 'MIXED INCIDENT' },
    { name: 'all', label: 'LOAD ALL FIXTURES' }
  ];

  const handleRunFixture = async (fixtureName) => {
    setLoading(true);
    setMessage('');
    try {
      const res = await onLoadFixture(fixtureName);
      setMessage(`Loaded '${fixtureName}' (${res.totalEventsProcessed || res.results.length} events processed)`);
    } catch (err) {
      setMessage(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  const handleLiveFetch = async (e) => {
    e.preventDefault();
    if (!liveInput.trim() || loading) return;

    setLoading(true);
    setMessage('');
    try {
      const val = liveInput.trim();
      let type = 'ip';
      if (val.includes('.')) type = 'domain';
      else if (/^[a-f0-9]{32,64}$/i.test(val)) type = 'hash';

      const res = await fetchLiveIntelligence(val, type);
      if (res.success) {
        setMessage(`Live APIs fetched & correlated ${res.eventsProcessed} event(s) for ${val}`);
        if (onRefreshData) await onRefreshData();
      } else {
        setMessage(res.message || 'No live data retrieved');
      }
    } catch (err) {
      setMessage(`Live API Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
      {/* Live External API Fetch Bar */}
      <form onSubmit={handleLiveFetch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '0.4rem 0.65rem' }}>
        <Globe size={14} style={{ color: 'var(--status-clean)' }} />
        <span className="mono" style={{ fontSize: '0.72rem', color: 'var(--text-muted)', whiteSpace: 'nowrap' }}>LIVE INTELLIGENCE (VT / OTX / SHODAN):</span>
        <input
          type="text"
          className="mono"
          placeholder="Enter IP, domain, hash (e.g. 8.8.8.8, 1.1.1.1)..."
          value={liveInput}
          onChange={(e) => setLiveInput(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-white)', fontSize: '0.8rem' }}
        />
        <button
          type="submit"
          className="sim-card-btn"
          disabled={loading || !liveInput.trim()}
          style={{ background: 'var(--text-white)', color: '#000', border: 'none', fontWeight: 700, padding: '0.35rem 0.75rem' }}
        >
          {loading ? 'FETCHING APIS...' : 'FETCH LIVE API DATA'}
        </button>
      </form>

      {/* Preset Fixture Bar */}
      <div>
        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
            <Zap size={13} />
            <span>LOCAL FIXTURE SIMULATOR</span>
          </div>
          {message && (
            <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--status-clean)' }}>
              {message}
            </span>
          )}
        </div>

        <div className="sim-grid">
          {fixtures.map(f => (
            <button
              key={f.name}
              className="sim-card-btn"
              onClick={() => handleRunFixture(f.name)}
              disabled={loading}
              style={f.name === 'all' ? { border: '1px solid var(--border-medium)', color: 'var(--text-white)' } : {}}
            >
              {f.label}
            </button>
          ))}
        </div>
      </div>
    </div>
  );
}
