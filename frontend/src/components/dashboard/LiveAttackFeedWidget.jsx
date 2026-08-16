import React from 'react';
import { Radio } from 'lucide-react';
import { useNavigate } from 'react-router-dom';

export default function LiveAttackFeedWidget({ threats }) {
  const navigate = useNavigate();

  const mockFeeds = [
    { flag: '🇷🇺', title: 'Malware Distribution', loc: 'Russia • 2m ago', severity: 'High', class: 'badge-high' },
    { flag: '🇩🇪', title: 'SQL Injection Attempt', loc: 'Germany • 3m ago', severity: 'High', class: 'badge-high' },
    { flag: '🇺🇸', title: 'Failed Login Attempts', loc: 'United States • 5m ago', severity: 'Medium', class: 'badge-medium' },
    { flag: '🇸🇬', title: 'Suspicious File Upload', loc: 'Singapore • 7m ago', severity: 'Medium', class: 'badge-medium' },
    { flag: '🇳🇱', title: 'Command & Control', loc: 'Netherlands • 9m ago', severity: 'High', class: 'badge-high' }
  ];

  const displayList = (threats && threats.length > 0)
    ? threats.map((t, idx) => {
        const flagList = ['🇷🇺', '🇩🇪', '🇺🇸', '🇸🇬', '🇳🇱'];
        const flag = flagList[idx % flagList.length];
        const severity = t.decision === 'BLOCKED' ? 'High' : t.decision === 'SUSPICIOUS' ? 'Medium' : 'Low';
        const badgeClass = t.decision === 'BLOCKED' ? 'badge-high' : t.decision === 'SUSPICIOUS' ? 'badge-medium' : 'badge-low';
        return {
          threatId: t.threatId,
          flag,
          title: t.threatId,
          loc: `Live Ingestion • ${new Date(t.updatedAt || Date.now()).toLocaleTimeString()}`,
          severity,
          class: badgeClass
        };
      })
    : mockFeeds;

  return (
    <div className="widget-card">
      <div className="card-heading" style={{ borderBottom: 'none', marginBottom: '0.4rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
          <Radio size={14} style={{ color: 'var(--crimson-accent)' }} />
          <span style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>LIVE ATTACK FEED</span>
        </div>
      </div>

      <div style={{ display: 'flex', flexDirection: 'column', gap: '0.35rem' }}>
        {displayList.slice(0, 5).map((item, idx) => (
          <div
            key={idx}
            className="feed-item"
            style={{ cursor: 'pointer' }}
            onClick={() => navigate(item.threatId ? `/threats?id=${encodeURIComponent(item.threatId)}` : '/threats')}
          >
            <div className="feed-left">
              <span className="flag-icon">{item.flag}</span>
              <div>
                <div className="mono" style={{ fontSize: '0.75rem', fontWeight: 700, color: 'var(--text-white)' }}>{item.title}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{item.loc}</div>
              </div>
            </div>

            <span className={`badge-status ${item.class}`}>{item.severity}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
