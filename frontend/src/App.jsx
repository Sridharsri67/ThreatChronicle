import React, { useState, useEffect } from 'react';
import Header from './components/layout/Header';
import CommandPalette from './components/layout/CommandPalette';
import ThreatList from './components/threats/ThreatList';
import DecisionHero from './components/decision/DecisionHero';
import ReplayConsole from './components/replay/ReplayConsole';
import EventTimeline from './components/timeline/EventTimeline';
import ConflictPanel from './components/conflict/ConflictPanel';
import AuditTimeline from './components/audit/AuditTimeline';
import EventInjector from './components/simulation/EventInjector';
import PerformancePanel from './components/dashboard/PerformancePanel';

import {
  fetchThreats,
  fetchThreatDetail,
  replayThreat,
  fetchMetrics,
  fetchHealth
} from './services/api';

export default function App() {
  const [threats, setThreats] = useState([]);
  const [selectedThreatId, setSelectedThreatId] = useState(null);
  const [selectedThreatData, setSelectedThreatData] = useState(null);
  const [metrics, setMetrics] = useState(null);
  const [health, setHealth] = useState(null);
  const [isCmdOpen, setIsCmdOpen] = useState(false);

  const loadMetrics = async () => {
    try {
      const data = await fetchMetrics();
      if (data.success) setMetrics(data.metrics);
    } catch (err) {
      console.error('Failed to load metrics:', err);
    }
  };

  const loadHealth = async () => {
    try {
      const data = await fetchHealth();
      setHealth(data);
    } catch (err) {
      console.error('Failed to load health:', err);
    }
  };

  const loadThreats = async () => {
    try {
      const data = await fetchThreats();
      if (data.success) {
        setThreats(data.threats);
        if (data.threats.length > 0 && !selectedThreatId) {
          setSelectedThreatId(data.threats[0].threatId);
        }
      }
    } catch (err) {
      console.error('Failed to load threats:', err);
    }
  };

  const loadThreatDetail = async (id) => {
    if (!id) return;
    try {
      const data = await fetchThreatDetail(id);
      if (data.success) {
        setSelectedThreatData(data.threat);
      }
    } catch (err) {
      console.error(`Failed to load threat detail for ${id}:`, err);
    }
  };

  useEffect(() => {
    loadMetrics();
    loadHealth();
    loadThreats();
  }, []);

  useEffect(() => {
    if (selectedThreatId) {
      loadThreatDetail(selectedThreatId);
    }
  }, [selectedThreatId]);

  const handleSelectThreat = (id) => {
    setSelectedThreatId(id);
  };

  const handleRunReplay = async (id) => {
    const data = await replayThreat(id);
    return data ? data.replay : null;
  };

  return (
    <div className="app-container">
      <Header
        metrics={metrics}
        health={health}
        onOpenCommand={() => setIsCmdOpen(true)}
        onRefresh={() => { loadMetrics(); loadThreats(); }}
      />

      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        threats={threats}
        onSelectThreat={handleSelectThreat}
        onRunReplay={handleRunReplay}
      />

      <main className="main-workspace">
        <ThreatList
          threats={threats}
          selectedThreatId={selectedThreatId}
          onSelectThreat={handleSelectThreat}
        />

        <div className="inspector-canvas">
          <EventInjector
            onRefreshData={async () => {
              await loadThreats();
              await loadMetrics();
              if (selectedThreatId) await loadThreatDetail(selectedThreatId);
            }}
          />

          {selectedThreatData ? (
            <>
              <DecisionHero threat={selectedThreatData} />

              <ReplayConsole
                threatId={selectedThreatData.threatId}
                onRunReplay={handleRunReplay}
              />

              <EventTimeline events={selectedThreatData.rawEvents} />

              {selectedThreatData.audits && selectedThreatData.audits.length > 0 && selectedThreatData.audits[selectedThreatData.audits.length - 1].resolutionSteps && (
                <ConflictPanel steps={selectedThreatData.audits[selectedThreatData.audits.length - 1].resolutionSteps} />
              )}

              <AuditTimeline audits={selectedThreatData.audits} />

              <PerformancePanel metrics={metrics} />
            </>
          ) : (
            <div style={{ padding: '4rem', textAlign: 'center', color: 'var(--text-muted)' }}>
              No threat selected. Choose a threat from the investigation queue or fetch live intelligence above.
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
