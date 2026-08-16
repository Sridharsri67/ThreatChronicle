import React, { useState } from 'react';
import { Sliders, Activity, ChevronRight, ChevronDown, Layers, ShieldAlert, Cpu } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function DashboardPage({ threats, metrics }) {
  const navigate = useNavigate();
  const [region, setRegion] = useState('EMEA');
  const [priority, setPriority] = useState('HIGH');
  const [source, setSource] = useState('SIGINT');
  const [confidence, setConfidence] = useState(75);
  const [velocity, setVelocity] = useState(45);
  const [correlation, setCorrelation] = useState(0.82);
  const [autoRefresh, setAutoRefresh] = useState(true);
  const [predictive, setPredictive] = useState(false);
  const [anomaly, setAnomaly] = useState(true);
  const [activeTab, setActiveTab] = useState('EVENTS');
  const [expandedRow, setExpandedRow] = useState(null);

  const activeTargetsCount = threats ? threats.length : 247;
  const eventsPerHourCount = metrics ? (metrics.totalEvents || 1847) : 1847;

  return (
    <div className="signet-layout">
      {/* Left Sidebar Scenario Config */}
      <aside className="scenario-config-sidebar">
        <div>
          <div className="config-section-title">
            <Sliders size={13} />
            <span>SCENARIO CONFIG</span>
          </div>

          {/* Region Selector */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>REGION</div>
            <div className="config-btn-grid">
              {['EMEA', 'APAC', 'AMER', 'MENA'].map(r => (
                <button
                  key={r}
                  className={`config-toggle-btn ${region === r ? 'active' : ''}`}
                  onClick={() => setRegion(r)}
                >
                  {r}
                </button>
              ))}
            </div>
          </div>

          {/* Priority Selector */}
          <div style={{ marginBottom: '0.85rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>PRIORITY</div>
            <div className="config-btn-grid">
              {['CRITICAL', 'HIGH', 'MEDIUM', 'LOW'].map(p => (
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

          {/* Source Selector */}
          <div style={{ marginBottom: '1rem' }}>
            <div style={{ fontSize: '0.68rem', color: 'var(--text-muted)', fontWeight: 700, marginBottom: '0.35rem' }}>SOURCE TELEMETRY</div>
            <div className="config-btn-grid">
              {[
                { id: 'SIGINT', label: 'SIGINT (AlienVault)' },
                { id: 'HUMINT', label: 'HUMINT (VirusTotal)' },
                { id: 'OSINT', label: 'OSINT (Shodan)' },
                { id: 'IMINT', label: 'IMINT (EDR)' }
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
          <div className="config-section-title">VARIABLES</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.85rem' }}>
            <div className="slider-group">
              <div className="slider-label-row">
                <span>CONFIDENCE</span>
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

            <div className="slider-group">
              <div className="slider-label-row">
                <span>VELOCITY</span>
                <span className="mono" style={{ color: 'var(--text-white)' }}>{velocity}</span>
              </div>
              <input
                type="range"
                min="0"
                max="100"
                value={velocity}
                onChange={(e) => setVelocity(parseInt(e.target.value))}
                className="tactical-slider"
              />
            </div>

            <div className="slider-group">
              <div className="slider-label-row">
                <span>CORRELATION</span>
                <span className="mono" style={{ color: 'var(--text-white)' }}>{correlation}</span>
              </div>
              <input
                type="range"
                min="0"
                max="1"
                step="0.01"
                value={correlation}
                onChange={(e) => setCorrelation(parseFloat(e.target.value))}
                className="tactical-slider"
              />
            </div>
          </div>
        </div>

        {/* Options Toggles */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem' }}>
          <div className="config-section-title">OPTIONS</div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.65rem' }}>
            <div className="switch-row">
              <span>AUTO-REFRESH</span>
              <div className={`switch-toggle ${autoRefresh ? 'active' : ''}`} onClick={() => setAutoRefresh(!autoRefresh)} />
            </div>

            <div className="switch-row">
              <span>PREDICTIVE</span>
              <div className={`switch-toggle ${predictive ? 'active' : ''}`} onClick={() => setPredictive(!predictive)} />
            </div>

            <div className="switch-row">
              <span>ANOMALY DETECT</span>
              <div className={`switch-toggle ${anomaly ? 'active' : ''}`} onClick={() => setAnomaly(!anomaly)} />
            </div>
          </div>
        </div>

        {/* Active Scenarios List */}
        <div style={{ borderTop: '1px solid var(--border-subtle)', paddingTop: '1rem', flex: 1 }}>
          <div className="config-section-title">ACTIVE SCENARIOS</div>

          <div className="scenario-card">
            <div>
              <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>SC-2847</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>ACTIVE INCIDENT</div>
            </div>
            <span className="badge-status badge-blocked">HIGH</span>
          </div>

          <div className="scenario-card">
            <div>
              <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>SC-2891</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>MONITORING FEED</div>
            </div>
            <span className="badge-status badge-suspicious">MEDIUM</span>
          </div>

          <div className="scenario-card">
            <div>
              <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>SC-2903</div>
              <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>CRITICAL CORRELATION</div>
            </div>
            <span className="badge-status badge-blocked">CRITICAL</span>
          </div>
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
            <span className="metric-label">EVENTS / HOUR</span>
            <span className="metric-value mono" style={{ color: 'var(--status-suspicious)' }}>{eventsPerHourCount}</span>
          </div>

          <div className="metric-box">
            <span className="metric-label">ACTIVE ALERTS</span>
            <span className="metric-value mono" style={{ color: 'var(--status-blocked)' }}>23</span>
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

        {/* Data Table View */}
        <div className="tactical-table-wrap">
          <table className="tactical-table">
            <thead>
              <tr>
                <th style={{ width: '30px' }}></th>
                <th>EVENT ID</th>
                <th>TIMESTAMP</th>
                <th>SOURCE</th>
                <th>ENTITY / THREAT</th>
                <th>CONF</th>
                <th>CLASS</th>
              </tr>
            </thead>
            <tbody>
              {(threats && threats.length > 0 ? threats : [
                { threatId: 'ip_185.220.101.5', decision: 'BLOCKED', confidence: 0.85, totalEvents: 5, lastEventTime: new Date().toISOString() },
                { threatId: 'domain_malicious-test.com', decision: 'BLOCKED', confidence: 0.85, totalEvents: 5, lastEventTime: new Date().toISOString() },
                { threatId: 'ip_8.8.8.8', decision: 'CLEAN', confidence: 0.05, totalEvents: 2, lastEventTime: new Date().toISOString() },
                { threatId: 'ip_203.0.113.88', decision: 'BLOCKED', confidence: 0.90, totalEvents: 4, lastEventTime: new Date().toISOString() },
                { threatId: 'hash_44d88612fea8a8f36de82e1278abb02f', decision: 'BLOCKED', confidence: 0.95, totalEvents: 2, lastEventTime: new Date().toISOString() }
              ]).map((row, idx) => (
                <React.Fragment key={row.threatId || idx}>
                  <tr style={{ cursor: 'pointer' }} onClick={() => navigate(`/threats?id=${row.threatId}`)}>
                    <td onClick={(e) => { e.stopPropagation(); setExpandedRow(expandedRow === idx ? null : idx); }}>
                      {expandedRow === idx ? <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} /> : <ChevronRight size={14} style={{ color: 'var(--text-muted)' }} />}
                    </td>
                    <td className="mono" style={{ fontWeight: 700, color: 'var(--text-white)' }}>EVT-98{471 + idx}</td>
                    <td className="mono" style={{ color: 'var(--text-muted)' }}>{new Date(row.lastEventTime || Date.now()).toLocaleTimeString()}</td>
                    <td className="mono" style={{ color: 'var(--text-secondary)' }}>SIGINT-0{idx + 1}</td>
                    <td className="mono" style={{ color: 'var(--text-white)' }}>{row.threatId}</td>
                    <td className="mono">{Math.round(row.confidence * 100)}%</td>
                    <td>
                      <span className={`badge-status badge-${row.decision.toLowerCase()}`}>
                        {row.decision}
                      </span>
                    </td>
                  </tr>

                  {/* Expanded Row Detail */}
                  {expandedRow === idx && (
                    <tr style={{ background: '#070707' }}>
                      <td colSpan="7" style={{ padding: '0.65rem 1.25rem', borderBottom: '1px solid var(--border-medium)' }}>
                        <div style={{ display: 'flex', gap: '2rem', fontSize: '0.72rem', color: 'var(--text-muted)' }}>
                          <div>LOCATION: <span className="mono" style={{ color: 'var(--text-secondary)' }}>35.6887N, 51.3875E</span></div>
                          <div>PROTOCOL: <span className="mono" style={{ color: 'var(--text-secondary)' }}>HTTPS / TLSv1.3</span></div>
                          <div>VOLUME: <span className="mono" style={{ color: 'var(--text-secondary)' }}>245KB</span></div>
                          <div>STATE VERSION: <span className="mono" style={{ color: 'var(--text-secondary)' }}>v{row.version || 1}</span></div>
                        </div>
                      </td>
                    </tr>
                  )}
                </React.Fragment>
              ))}
            </tbody>
          </table>
        </div>

        {/* Bottom Status Bar */}
        <div className="bottom-status-bar">
          <span>TOTAL: <strong style={{ color: 'var(--text-white)' }}>{activeTargetsCount}</strong></span>
          <span>FILTERED: <strong style={{ color: 'var(--text-white)' }}>5</strong></span>
          <span>SELECTED: <strong style={{ color: 'var(--text-white)' }}>{expandedRow !== null ? 1 : 0}</strong></span>
        </div>
      </main>
    </div>
  );
}
