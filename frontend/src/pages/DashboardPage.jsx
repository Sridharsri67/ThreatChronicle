import React from 'react';
import { Shield, Activity, Lock, AlertTriangle, ShieldCheck, ChevronDown, Maximize2, Grid, MoreHorizontal } from 'lucide-react';
import GlobalThreatMap from '../components/dashboard/GlobalThreatMap';
import ThreatSeverityWidget from '../components/dashboard/ThreatSeverityWidget';
import AiDetectionWidget from '../components/dashboard/AiDetectionWidget';
import NetworkStatusWidget from '../components/dashboard/NetworkStatusWidget';
import AttackVectorsWidget from '../components/dashboard/AttackVectorsWidget';
import LiveAttackFeedWidget from '../components/dashboard/LiveAttackFeedWidget';
import CriticalAlertBanner from '../components/dashboard/CriticalAlertBanner';

export default function DashboardPage({ threats, metrics }) {
  const realThreats = threats || [];

  const activeIncidents = metrics ? (metrics.totalThreats || realThreats.length) : realThreats.length;
  const blockedAttacks = realThreats.filter(t => t.decision === 'BLOCKED').length || 3842;
  const suspiciousIps = realThreats.filter(t => t.decision === 'SUSPICIOUS').length || 1289;

  return (
    <div className="dashboard-grid-canvas">
      {/* Top Header Controls Bar */}
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <div className="soc-header-title">
          <Shield size={20} style={{ color: 'var(--crimson-accent)' }} />
          <span>Threat Intelligence Overview</span>
        </div>

        <div style={{ display: 'flex', alignItems: 'center', gap: '0.75rem' }}>
          {/* Time Range Dropdown */}
          <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.35rem 0.75rem', fontSize: '0.75rem', color: 'var(--text-secondary)', display: 'flex', alignItems: 'center', gap: '0.5rem', cursor: 'pointer' }}>
            <span>Last 24 Hours</span>
            <ChevronDown size={14} style={{ color: 'var(--text-muted)' }} />
          </div>

          <div style={{ display: 'flex', gap: '0.35rem' }}>
            <button style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Maximize2 size={14} />
            </button>
            <button style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <Grid size={14} />
            </button>
            <button style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.4rem', color: 'var(--text-muted)', cursor: 'pointer' }}>
              <MoreHorizontal size={14} />
            </button>
          </div>
        </div>
      </div>

      {/* Top 4 KPI Metrics Row */}
      <div className="kpi-row">
        {/* Risk Score Card */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">RISK SCORE</span>
            <span style={{ fontSize: '0.65rem', fontWeight: 700, color: 'var(--status-critical)' }}>High Risk</span>
          </div>

          <div className="kpi-value-row">
            <span className="kpi-num mono" style={{ color: 'var(--text-white)' }}>85</span>
            {/* SVG Red Sparkline */}
            <svg viewBox="0 0 60 20" style={{ width: '60px', height: '20px', marginLeft: 'auto' }}>
              <path d="M 0 15 L 10 12 L 20 18 L 30 8 L 40 14 L 50 4 L 60 9" fill="none" stroke="#FF2A4B" strokeWidth="2" />
            </svg>
          </div>
        </div>

        {/* Active Incidents Card */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">ACTIVE INCIDENTS</span>
          </div>

          <div className="kpi-value-row">
            <span className="kpi-num mono">{activeIncidents > 0 ? activeIncidents : 247}</span>
            <span className="kpi-trend up-red mono">+18</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>vs last 24h</span>
          </div>
        </div>

        {/* Blocked Attacks Card */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">BLOCKED ATTACKS</span>
          </div>

          <div className="kpi-value-row">
            <span className="kpi-num mono">{blockedAttacks.toLocaleString()}</span>
            <span className="kpi-trend up-green mono">+23%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>vs last 24h</span>
          </div>
        </div>

        {/* Suspicious IPs Card */}
        <div className="kpi-card">
          <div className="kpi-card-header">
            <span className="kpi-title">SUSPICIOUS IPS</span>
          </div>

          <div className="kpi-value-row">
            <span className="kpi-num mono">{suspiciousIps.toLocaleString()}</span>
            <span className="kpi-trend up-red mono">+11%</span>
            <span style={{ fontSize: '0.65rem', color: 'var(--text-muted)', marginLeft: 'auto' }}>vs last 24h</span>
          </div>
        </div>
      </div>

      {/* Middle Section (Global Map + Right Stack) */}
      <div className="middle-grid">
        <GlobalThreatMap />

        <div className="widget-stack">
          <ThreatSeverityWidget />
          <AiDetectionWidget />
          <NetworkStatusWidget />
        </div>
      </div>

      {/* Bottom Grid Row */}
      <div className="bottom-grid">
        {/* Incident Timeline */}
        <div className="widget-card">
          <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.4rem' }}>
            <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>INCIDENT TIMELINE</span>
          </div>

          <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem', fontSize: '0.75rem' }}>
            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>10:34 AM</span>
              <div>
                <div style={{ color: 'var(--text-white)', fontWeight: 600 }}>Brute Force Attempt Detected</div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>US East • 200.0.113.45</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>10:21 AM</span>
              <div>
                <div style={{ color: 'var(--text-white)', fontWeight: 600 }}>Malware Communication Blocked</div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>DE • 185.220.101.16</div>
              </div>
            </div>

            <div style={{ display: 'flex', gap: '0.6rem', alignItems: 'flex-start' }}>
              <span className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)', flexShrink: 0 }}>10:18 AM</span>
              <div>
                <div style={{ color: 'var(--text-white)', fontWeight: 600 }}>Suspicious Login Detected</div>
                <div className="mono" style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>SG • 45.77.232.11</div>
              </div>
            </div>
          </div>
        </div>

        {/* Top Attack Vectors */}
        <AttackVectorsWidget />

        {/* Live Attack Feed */}
        <LiveAttackFeedWidget threats={realThreats} />
      </div>

      {/* Critical Alert Floating Banner */}
      <CriticalAlertBanner threatId={realThreats.length > 0 ? realThreats[0].threatId : '203.0.113.45'} />
    </div>
  );
}
