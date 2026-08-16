import React, { useState } from 'react';
import { Globe, Search, RefreshCw } from 'lucide-react';
import { fetchLiveIntelligence } from '../../services/api';

export default function EventInjector({ onRefreshData }) {
  const [loading, setLoading] = useState(false);
  const [liveInput, setLiveInput] = useState('');
  const [message, setMessage] = useState('');

  const handleLiveFetch = async (e) => {
    e.preventDefault();
    if (!liveInput.trim() || loading) return;

    setLoading(true);
    setMessage('');
    try {
      const val = liveInput.trim();
      let type = 'ip';
      if (/^(?:[0-9]{1,3}\.){3}[0-9]{1,3}$/.test(val)) {
        type = 'ip';
      } else if (/^[a-f0-9]{32,64}$/i.test(val)) {
        type = 'hash';
      } else if (val.includes('.')) {
        type = 'domain';
      }

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
    <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1rem', marginBottom: '1.25rem', display: 'flex', flexDirection: 'column', gap: '0.5rem' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-muted)' }}>
          <Globe size={14} style={{ color: 'var(--status-clean)' }} />
          <span>LIVE THREAT INTELLIGENCE FETCH (VT / OTX / SHODAN)</span>
        </div>
        {message && (
          <span className="mono" style={{ fontSize: '0.7rem', color: 'var(--status-clean)' }}>
            {message}
          </span>
        )}
      </div>

      <form onSubmit={handleLiveFetch} style={{ display: 'flex', gap: '0.5rem', alignItems: 'center', background: 'var(--bg-darkest)', border: '1px solid var(--border-medium)', borderRadius: '6px', padding: '0.4rem 0.65rem' }}>
        <Search size={14} style={{ color: 'var(--text-muted)' }} />
        <input
          type="text"
          className="mono"
          placeholder="Enter any IP, Domain, or Hash to query live APIs (e.g. 8.8.8.8, 1.1.1.1, example.com)..."
          value={liveInput}
          onChange={(e) => setLiveInput(e.target.value)}
          style={{ flex: 1, background: 'transparent', border: 'none', outline: 'none', color: 'var(--text-white)', fontSize: '0.82rem' }}
        />
        <button
          type="submit"
          className="sim-card-btn"
          disabled={loading || !liveInput.trim()}
          style={{ background: 'var(--text-white)', color: '#000', border: 'none', fontWeight: 700, padding: '0.4rem 0.85rem', cursor: 'pointer' }}
        >
          {loading ? 'FETCHING APIS...' : 'FETCH LIVE API DATA'}
        </button>
      </form>
    </div>
  );
}
