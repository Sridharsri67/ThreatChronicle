import React, { useState } from 'react';
import { Sliders, Activity, ChevronRight, ChevronDown, ShieldAlert, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage({ threats, metrics }) {
  const navigate = useNavigate();
  const [region, setRegion] = useState('ALL');
  const [priority, setPriority] = useState('ALL');
  const [source, setSource] = useState('ALL');
  const [confidence, setConfidence] = useState(0);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [predictive, setPredictive] = useState(false);
  const [anomaly, setAnomaly] = useState(true);
  const [activeTab, setActiveTab] = useState('EVENTS');
  const [expandedRow, setExpandedRow] = useState(null);

  const realThreats = threats || [];
  
  // Real Database Metrics
  const activeTargetsCount = metrics ? (metrics.totalThreats || realThreats.length) : realThreats.length;
  const eventsCount = metrics ? (metrics.totalEvents || 0) : 0;
  const activeAlertsCount = realThreats.filter(t => t.decision === 'BLOCKED' || t.decision === 'SUSPICIOUS').length;

  // Filter real database entities based on user selections
  const filteredThreats = realThreats.filter(t => {
    const matchesPriority = priority === 'ALL' || t.decision === priority;
    const matchesConfidence = Math.round(t.confidence * 100) >= confidence;
    const matchesSource = source === 'ALL' || (t.winningEvidence && t.winningEvidence.source.toUpperCase().includes(source));
    return matchesPriority && matchesConfidence && matchesSource;
  });

  return (
    <div className="signet-layout">
      {/* Left Sidebar Scenario Config */}
      <aside className="scenario-config-sidebar">
        <div>
          <div className="config-section-title">
            <Sliders size={13} />
            <span>SCENARIO CONTROLS</span>
          </div>

          {/* Priority / Decision Filter */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>DECISION VERDICT</div>
            <div className="config-btn-grid">
              {['ALL', 'BLOCKED', 'SUSPICIOUS', 'CLEAN'].map(p => (
                <button
                  key={p}
                  className={`config-toggle-btn ${priority === p ? 'active' : ''}`}
                  onClick={() => setPriority(p)}
                >
                  {p}
                </button>
              ))}
            </div>
          </div>

          {/* Source Filter */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>SOURCE TELEMETRY</div>
            <div className="config-btn-grid">
              {[
                { id: 'ALL', label: 'ALL SOURCES' },
                { id: 'ALIENVAULT', label: 'ALIENVAULT' },
                { id: 'VIRUS_TOTAL', label: 'VIRUSTOTAL' },
                { id: 'EDR', label: 'EDR / SHODAN' }
              ].map(s => (
                <button
                  key={s.id}
                  className={`config-toggle-btn ${source === s.id ? 'active' : ''}`}
                  onClick={() => setSource(s.id)}
                >
                  {s.id}
                </button>
              ))}
            </div>
          </div>
        </div>

        {/* Variables Sliders */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div className="config-section-title">MIN CONFIDENCE FILTER</div>

          <div className="slider-group">
            <div className="slider-label-row">
              <span>MIN CONFIDENCE</span>
              <span className="mono" style={{ color: 'var(--text-white)' }}>{confidence}%</span>
            </div>
            <input
              type="range"
              min="0"
              max="100"
              value={confidence}
              onChange={(e) => setConfidence(parseInt(e.target.value))}
              className="tactical-slider"
            />
          </div>
        </div>

        {/* Options Toggles */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div className="config-section-title">ENGINE OPTIONS</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="switch-row">
              <span>AUTO-REFRESH</span>
              <div className={`switch-toggle ${autoRefresh ? 'active' : ''}`} onClick={() => setAutoRefresh(!autoRefresh)} />
            </div>

            <div className="switch-row">
              <span>PREDICTIVE REPLAY</span>
              <div className={`switch-toggle ${predictive ? 'active' : ''}`} onClick={() => setPredictive(!predictive)} />
            </div>

            <div className="switch-row">
              <span>ANOMALY DETECT</span>
              <div className={`switch-toggle ${anomaly ? 'active' : ''}`} onClick={() => setAnomaly(!anomaly)} />
            </div>
          </div>
        </div>

        {/* Active Database Entities Summary */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', flex: 1 }}>
          <div className="config-section-title">STORED DATABASE ENTITIES</div>

          {realThreats.slice(0, 4).map(t => (
            <div key={t.threatId} className="scenario-card" style={{ cursor: 'pointer' }} onClick={() => navigate(`/threats?id=${encodeURIComponent(t.threatId)}`)}>
              <div style={{ overflow: 'hidden', paddingRight: '0.4rem' }}>
                <div className="mono" style={{ fontSize: '0.73rem', fontWeight: 700, color: 'var(--text-white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.threatId}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>v{t.version} | {t.totalEvents} evidence source(s)</div>
              </div>
              <span className={`badge-status badge-${t.decision.toLowerCase()}`}>{t.decision}</span>
            </div>
          ))}
        </div>
      </aside>

      {/* Main Monitoring Canvas */}
      <main className="monitoring-canvas">
        {/* Top Metrics Strip */}
        <div className="metrics-strip">
          <div className="metric-box">
            <span className="metric-label">ACTIVE TARGETS</span>
            <span className="metric-value mono">{activeTargetsCount}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">INGESTED EVENTS</span>
            <span className="metric-value mono" style={{ color: 'var(--status-clean)' }}>{eventsCount}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">ACTIVE ALERTS (BLOCKED/SUSPICIOUS)</span>
            <span className="metric-value mono" style={{ color: 'var(--status-blocked)' }}>{activeAlertsCount}</span>
          </div>
        </div>

        {/* View Tabs */}
        <div className="view-tabs-bar">
          {['EVENTS', 'ENTITIES', 'ALERTS'].map(tab => (
            <button
              key={tab}
              className={`view-tab-btn ${activeTab === tab ? 'active' : ''}`}
              onClick={() => setActiveTab(tab)}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Data Table View - Rendering 100% Real MongoDB Data */}
        <div className="tactical-table-wrap">
          <table className="tactical-table">
            <thead>
              <tr>
                <th style={{ width: '30px' }}></th>
                <th>THREAT ID</th>
                <th>LAST UPDATED</th>
                <th>WINNING SOURCE</th>
                <th>CONFIDENCE</th>
                <th>STATE VERSION</th>
                <th>DECISION CLASS</th>
              </tr>
            </thead>
            <tbody>
              {filteredThreats.length === 0 ? (
                <tr>
                  <td colSpan="7" style={{ textAlign: 'center', padding: '3rem', color: 'var(--text-muted)', fontSize: '0.8rem' }}>
                    No matching threat entities found in database. Use Live Fetch above or adjust scenario controls.
                  </td>
                </tr>
              ) : (
                filteredThreats.map((row, idx) => (
                  <React.Fragment key={row.threatId}>
                    <tr style={{ cursor: 'pointer' }} onClick={() => navigate(`/threats?id=${encodeURIComponent(row.threatId)}`)}>
                      <td onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === idx ? null : idx); }}>
                        {expandedRow === idx ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                      </td>
                      <td className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>{row.threatId}</td>
                      <td className="mono" style={{ color: 'var(--text-muted)' }}>{new Date(row.updatedAt || row.lastEventTime || Date.now()).toLocaleTimeString()}</td>
                      <td className="mono" style={{ color: 'var(--text-secondary)' }}>
                        {row.winningEvidence?.source ? row.winningEvidence.source.toUpperCase() : 'LIVE_TELEMETRY'}
                      </td>
                      <td className="mono">{Math.round(row.confidence * 100)}%</td>
                      <td className="mono">v{row.version}</td>
                      <td>
                        <span className={`badge-status badge-${row.decision.toLowerCase()}`}>
                          {row.decision}
                        </span>
                      </td>
                    </tr>

                    {/* Expanded Row Detail - Real MongoDB State Properties */}
                    {expandedRow === idx && (
                      <tr style={{ background: '#070707' }}>
                        <td colSpan="7" style={{ padding: '0.75rem 1.25rem', borderBottom: '1px solid var(--border-medium)' }}>
                          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.4rem', fontSize: '0.72rem' }}>
                            <div style={{ display: 'flex', gap: '2rem', color: 'var(--text-muted)' }}>
                              <div>EVIDENCE SOURCES: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{row.totalEvents}</span></div>
                              <div>RULE VERSION: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{row.ruleVersion || 'v1.0'}</span></div>
                              <div>FIRST SEEN: <span className="mono" style={{ color: 'var(--text-secondary)' }}>{new Date(row.firstSeen || Date.now()).toLocaleString()}</span></div>
                            </div>
                            <div className="mono" style={{ color: 'var(--text-muted)' }}>
                              SHA256 CHECKSUM: <span style={{ color: 'var(--text-secondary)' }}>{row.decisionFingerprint}</span>
                            </div>
                          </div>
                        </td>
                      </tr>
                    )}
                  </React.Fragment>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Bottom Status Bar - Connected 100% to Database State */}
        <div className="bottom-status-bar">
          <span>TOTAL DATABASE THREATS: <strong style={{ color: 'var(--text-white)' }}>{realThreats.length}</strong></span>
          <span>FILTERED: <strong style={{ color: 'var(--text-white)' }}>{filteredThreats.length}</strong></span>
          <span>SELECTED: <strong style={{ color: 'var(--text-white)' }}>{expandedRow !== null ? 1 : 0}</strong></span>
        </div>
      </main>
    </div>
  );
}
