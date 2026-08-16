import React, { useState } from 'react';
import ThreatListItem from './ThreatListItem';
import { Search } from 'lucide-react';

export default function ThreatList({ threats, selectedThreatId, onSelectThreat }) {
  const [filter, setFilter] = useState('ALL');
  const [search, setSearch] = useState('');

  const filteredThreats = (threats || []).filter(t => {
    const matchesFilter = filter === 'ALL' || t.decision === filter;
    const matchesSearch = t.threatId.toLowerCase().includes(search.toLowerCase());
    return matchesFilter && matchesSearch;
  });

  return (
    <aside className="sidebar-panel">
      <div className="sidebar-header">
        <div className="sidebar-title">Investigation Queue ({filteredThreats.length})</div>

        <input
          type="text"
          className="search-field"
          placeholder="Filter queue by ID, IP..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <div className="filter-pills">
          {['ALL', 'BLOCKED', 'SUSPICIOUS', 'MONITOR', 'CLEAN'].map(f => (
            <button
              key={f}
              className={`filter-pill-btn ${filter === f ? 'active' : ''}`}
              onClick={() => setFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>
      </div>

      <div className="sidebar-list">
        {filteredThreats.length === 0 ? (
          <div style={{ padding: '2rem 1rem', textAlign: 'center', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
            No threats found in investigation queue.
          </div>
        ) : (
          filteredThreats.map(t => (
            <ThreatListItem
              key={t.threatId}
              threat={t}
              isSelected={selectedThreatId === t.threatId}
              onSelect={() => onSelectThreat(t.threatId)}
            />
          ))
        )}
      </div>
    </aside>
  );
}
