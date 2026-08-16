import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, ChevronDown, Loader2 } from 'lucide-react';
import { fetchLiveIntelligence } from '../../services/api';

export default function ThreatSearchPill({ threats, onRefreshData, style = {} }) {
  const navigate = useNavigate();
  const [indicatorType, setIndicatorType] = useState('ip'); // 'ip' | 'domain' | 'hash'
  const [query, setQuery] = useState('');
  const [loading, setLoading] = useState(false);

  const placeholders = {
    ip: 'Enter IP Address (e.g., 185.220.101.5)',
    domain: 'Enter Domain Name (e.g., example.com)',
    hash: 'Enter File Hash (e.g., 44d88612...)'
  };

  const handleSearch = async (e) => {
    if (e) e.preventDefault();
    const val = query.trim();
    if (!val) return;

    setLoading(true);
    try {
      const cleanRaw = val.replace(/^ip_|^domain_|^hash_/, '').toLowerCase();
      
      // 1. Check if threat already exists in current state/database
      const allThreats = threats || [];
      const existing = allThreats.find(t =>
        t.threatId.toLowerCase() === val.toLowerCase() ||
        t.threatId.toLowerCase() === `${indicatorType}_${val.toLowerCase()}` ||
        t.threatId.toLowerCase().includes(cleanRaw)
      );

      if (existing) {
        navigate(`/incidents?id=${encodeURIComponent(existing.threatId)}`);
        return;
      }

      // 2. Fetch Live Intelligence automatically
      const res = await fetchLiveIntelligence(val, indicatorType);
      if (onRefreshData) await onRefreshData();

      const targetId = res && res.threatId ? res.threatId : `${indicatorType}_${val}`;
      navigate(`/incidents?id=${encodeURIComponent(targetId)}`);
    } catch (err) {
      console.error('Live fetch search failed:', err);
      navigate('/incidents');
    } finally {
      setLoading(false);
    }
  };

  return (
    <form
      onSubmit={handleSearch}
      style={{
        display: 'flex',
        alignItems: 'center',
        background: 'rgba(12, 12, 18, 0.92)',
        border: '1px solid rgba(255, 255, 255, 0.12)',
        borderRadius: '50px',
        padding: '0.3rem 0.35rem 0.3rem 1.1rem',
        backdropFilter: 'blur(16px)',
        boxShadow: '0 8px 32px rgba(0, 0, 0, 0.6), 0 0 20px rgba(255, 42, 75, 0.1)',
        width: '100%',
        maxWidth: '680px',
        margin: '0 auto',
        transition: 'all 0.2s ease',
        ...style
      }}
    >
      {/* Left Type Selector Dropdown */}
      <div style={{ position: 'relative', display: 'flex', alignItems: 'center', flexShrink: 0 }}>
        <select
          value={indicatorType}
          onChange={(e) => setIndicatorType(e.target.value)}
          style={{
            background: 'transparent',
            border: 'none',
            color: 'var(--text-white)',
            fontSize: '0.82rem',
            fontWeight: 700,
            paddingRight: '1.2rem',
            appearance: 'none',
            cursor: 'pointer',
            outline: 'none',
            fontFamily: 'inherit'
          }}
        >
          <option value="ip" style={{ background: '#0E0E14', color: '#FFF' }}>IP Address</option>
          <option value="domain" style={{ background: '#0E0E14', color: '#FFF' }}>Domain</option>
          <option value="hash" style={{ background: '#0E0E14', color: '#FFF' }}>Hash</option>
        </select>
        <ChevronDown size={13} style={{ position: 'absolute', right: '0.2rem', pointerEvents: 'none', color: 'var(--text-muted)' }} />
      </div>

      {/* Vertical Divider Line */}
      <div style={{ width: '1px', height: '22px', background: 'rgba(255, 255, 255, 0.12)', margin: '0 0.85rem', flexShrink: 0 }} />

      {/* Center Text Input */}
      <input
        type="text"
        placeholder={placeholders[indicatorType]}
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        style={{
          flex: 1,
          background: 'transparent',
          border: 'none',
          outline: 'none',
          fontSize: '0.84rem',
          color: 'var(--text-white)',
          fontFamily: 'inherit'
        }}
      />

      {/* Right Red Circular Search Button */}
      <button
        type="submit"
        disabled={loading || !query.trim()}
        style={{
          width: '38px',
          height: '38px',
          borderRadius: '50%',
          background: '#FF2A4B',
          border: 'none',
          color: '#FFFFFF',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          cursor: query.trim() ? 'pointer' : 'default',
          opacity: query.trim() ? 1 : 0.6,
          boxShadow: query.trim() ? '0 0 14px rgba(255, 42, 75, 0.6)' : 'none',
          transition: 'all 0.2s ease',
          flexShrink: 0,
          marginLeft: '0.5rem'
        }}
      >
        {loading ? <Loader2 size={16} className="spin" /> : <Search size={16} />}
      </button>
    </form>
  );
}
