import React, { useState } from 'react';
import { Search, ShieldAlert, AlertTriangle, Eye, CheckCircle } from 'lucide-react';

export default function ThreatList({ threats, selectedThreatId, onSelectThreat }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredThreats = threats.filter(t => {
    const matchesFilter = filter === 'ALL' || t.decision === filter;
    const matchesSearch = t.threatId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

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
    <aside className="threat-sidebar">
      <div className="sidebar-controls">
        <div style={{ position: 'relative' }}>
          <input
            type="text"
            className="search-input"
            placeholder="Search threat ID..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>

        <div className="filter-tabs">
          {['ALL', 'BLOCKED', 'SUSPICIOUS', 'MONITOR', 'CLEAN'].map(tab => (
            <button
              key={tab}
              className={`tab-btn ${filter === tab ? 'active' : ''}`}
              onClick={() => setFilter(tab)}
            >
              {tab}
            </button>
          ))}
        </div>
      </div>

      <div className="threat-list">
        {filteredThreats.length === 0 ? (
          <div style={{ padding: '2rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.85rem' }}>
            No threat states match your criteria.
          </div>
        ) : (
          filteredThreats.map(t => (
            <div
              key={t.threatId}
              className={`threat-card ${selectedThreatId === t.threatId ? 'active' : ''}`}
              onClick={() => onSelectThreat(t.threatId)}
            >
              <div className="threat-card-header">
                <span className={`badge ${getBadgeClass(t.decision)}`}>{t.decision}</span>
                <span className="badge badge-version">v{t.version}</span>
              </div>
              <div className="threat-id mono">{t.threatId}</div>
              <div className="threat-card-meta">
                <span>Events: {t.totalEvents}</span>
                <span>Conf: {Math.round(t.confidence * 100)}%</span>
              </div>
            </div>
          ))
        )}
      </div>
    </aside>
  );
}
