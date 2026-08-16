import React, { useState } from 'react';
import { FileText, Download, Shield, CheckCircle2, Clock } from 'lucide-react';
import { downloadReport } from '../services/api';

export default function ReportsPage({ threats }) {
  const sanitizeId = (id) => (id || '').replace(/[\/\\]+$/, '').trim();

  const [downloadHistory, setDownloadHistory] = useState([
    { id: 'REP-185.220.101.5', threatId: 'ip_185.220.101.5', format: 'PDF', generatedAt: new Date().toISOString(), decision: 'BLOCKED' },
    { id: 'REP-44D88612FEA8A8F3', threatId: 'hash_44d88612fea8a8f36de82e1278abb02f', format: 'PDF', generatedAt: new Date(Date.now() - 3600000).toISOString(), decision: 'BLOCKED' }
  ]);
  const [loadingId, setLoadingId] = useState(null);

  const realThreats = (threats || []).map(t => ({
    ...t,
    threatId: sanitizeId(t.threatId)
  }));

  const handleDownload = async (threatId, format = 'pdf') => {
    const cleanId = sanitizeId(threatId);
    setLoadingId(cleanId);
    try {
      await downloadReport(cleanId, format);
      const newEntry = {
        id: `REP-${cleanId.replace(/[^a-zA-Z0-9]/g, '_').slice(0, 16).toUpperCase()}`,
        threatId: cleanId,
        format: format.toUpperCase(),
        generatedAt: new Date().toISOString(),
        decision: realThreats.find(t => t.threatId === cleanId)?.decision || 'BLOCKED'
      };
      setDownloadHistory(prev => [newEntry, ...prev.filter(item => item.threatId !== cleanId)]);
    } catch (err) {
      console.error('Download failed:', err);
    } finally {
      setLoadingId(null);
    }
  };

  return (
    <div className="inspector-canvas" style={{ flex: 1, padding: '1.5rem 2rem' }}>
      {/* Top Header Card */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-medium)', borderRadius: '8px', padding: '1.25rem', marginBottom: '1.25rem' }}>
        <div style={{ display: 'flex', alignItems: 'center', justifyBetween: 'space-between', gap: '0.5rem', marginBottom: '0.4rem' }}>
          <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem' }}>
            <FileText size={20} style={{ color: 'var(--crimson-accent)' }} />
            <h2 style={{ fontSize: '1.15rem', fontWeight: 800, color: 'var(--text-white)' }}>Downloaded Executive Security Reports</h2>
          </div>
        </div>
        <p style={{ fontSize: '0.78rem', color: 'var(--text-muted)' }}>
          Manage, generate, and download tamper-proof PDF Executive Security Reports and TXT Audit Ledgers generated for threat entities.
        </p>
      </div>

      {/* Available Threats Report Generator Section */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.1rem', marginBottom: '1.25rem' }}>
        <div className="card-heading" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.85rem' }}>
          GENERATE & DOWNLOAD NEW EXECUTIVE REPORTS
        </div>

        <div style={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(260px, 1fr))', gap: '0.75rem' }}>
          {realThreats.map(t => (
            <div key={t.threatId} style={{ background: 'var(--bg-darkest)', border: '1px solid var(--border-subtle)', borderRadius: '6px', padding: '0.75rem', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
              <div style={{ overflow: 'hidden', paddingRight: '0.5rem' }}>
                <div className="mono" style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--text-white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{t.threatId}</div>
                <div style={{ fontSize: '0.65rem', color: 'var(--text-muted)' }}>{t.totalEvents} evidence source(s) | v{t.version}</div>
              </div>

              <div style={{ display: 'flex', gap: '0.35rem', flexShrink: 0 }}>
                <button
                  className="btn-replay"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.68rem' }}
                  disabled={loadingId === t.threatId}
                  onClick={() => handleDownload(t.threatId, 'pdf')}
                >
                  <Download size={12} />
                  <span>PDF</span>
                </button>
                <button
                  className="btn-replay"
                  style={{ padding: '0.3rem 0.6rem', fontSize: '0.68rem', background: 'var(--bg-elevated)', color: 'var(--text-secondary)', border: '1px solid var(--border-subtle)' }}
                  disabled={loadingId === t.threatId}
                  onClick={() => handleDownload(t.threatId, 'txt')}
                >
                  <Download size={12} />
                  <span>TXT</span>
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Download History Table */}
      <div style={{ background: 'var(--bg-surface)', border: '1px solid var(--border-subtle)', borderRadius: '8px', padding: '1.1rem' }}>
        <div className="card-heading" style={{ fontSize: '0.8rem', fontWeight: 700, color: 'var(--text-white)', marginBottom: '0.85rem' }}>
          DOWNLOADED REPORTS LEDGER ({downloadHistory.length})
        </div>

        <table className="tactical-table">
          <thead>
            <tr>
              <th style={{ width: '220px' }}>REPORT ID</th>
              <th style={{ width: '240px' }}>THREAT ENTITY</th>
              <th style={{ width: '90px' }}>FORMAT</th>
              <th style={{ width: '190px' }}>GENERATED TIMESTAMP</th>
              <th style={{ width: '110px' }}>VERDICT STATUS</th>
              <th style={{ width: '120px' }}>ACTION</th>
            </tr>
          </thead>
          <tbody>
            {downloadHistory.length === 0 ? (
              <tr>
                <td colSpan="6" style={{ textAlign: 'center', padding: '2.5rem', color: 'var(--text-muted)', fontSize: '0.78rem' }}>
                  No reports downloaded yet. Click PDF or TXT above to generate an executive report.
                </td>
              </tr>
            ) : (
              downloadHistory.map(rep => (
                <tr key={rep.id}>
                  <td className="mono" style={{ fontWeight: 700, color: 'var(--text-white)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.id}</td>
                  <td className="mono" style={{ color: 'var(--text-secondary)', overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>{rep.threatId}</td>
                  <td>
                    <span className="mono" style={{ fontSize: '0.68rem', color: 'var(--crimson-accent)', background: 'rgba(255,42,75,0.1)', padding: '0.15rem 0.4rem', borderRadius: '3px', border: '1px solid rgba(255,42,75,0.2)' }}>
                      {rep.format}
                    </span>
                  </td>
                  <td className="mono" style={{ color: 'var(--text-muted)' }}>{new Date(rep.generatedAt).toLocaleString()}</td>
                  <td>
                    <span className={`badge-status badge-${rep.decision.toLowerCase()}`}>
                      {rep.decision}
                    </span>
                  </td>
                  <td>
                    <button
                      className="btn-replay"
                      style={{ padding: '0.25rem 0.55rem', fontSize: '0.65rem' }}
                      onClick={() => handleDownload(rep.threatId, rep.format.toLowerCase())}
                    >
                      <Download size={11} />
                      <span>Re-download</span>
                    </button>
                  </td>
                </tr>
              ))
            )}
          </tbody>
        </table>
      </div>
    </div>
  );
}
