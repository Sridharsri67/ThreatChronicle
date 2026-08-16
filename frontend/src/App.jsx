import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import CommandPalette from './components/layout/CommandPalette';

import DashboardPage from './pages/DashboardPage';
import ThreatsPage from './pages/ThreatsPage';
import AnalyticsPage from './pages/AnalyticsPage';
import ReportsPage from './pages/ReportsPage';

import {
  fetchThreats,
  fetchThreatDetail,
  replayThreat,
  fetchLiveIntelligence,
  fetchMetrics,
  fetchHealth
} from './services/api';

function MainAppShell() {
  const navigate = useNavigate();
  const [threats, setThreats] = useState([]);
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
        if (data.threats.length === 0) {
          // Auto-seed initial live threat indicators if database is fresh
          await fetchLiveIntelligence('185.220.101.5', 'ip');
          await fetchLiveIntelligence('44d88612fea8a8f36de82e1278abb02f', 'hash');
          const reFetch = await fetchThreats();
          if (reFetch.success) setThreats(reFetch.threats);
        } else {
          setThreats(data.threats);
        }
      }
    } catch (err) {
      console.error('Failed to load threats:', err);
    }
  };

  const refreshAllData = async () => {
    await loadThreats();
    await loadMetrics();
    await loadHealth();
  };

  useEffect(() => {
    refreshAllData();
  }, []);

  const handleSelectThreat = (id) => {
    navigate(`/incidents?id=${encodeURIComponent(id)}`);
  };

  const handleRunReplay = async (id) => {
    const data = await replayThreat(id);
    return data ? data.replay : null;
  };

  // Real Threat & Suspicious Only Filter for Threats Queue
  const activeThreatsList = threats.filter(t => t.decision === 'BLOCKED' || t.decision === 'SUSPICIOUS');
  const allRealThreats = activeThreatsList.length > 0 ? activeThreatsList : threats;

  return (
    <div className="app-container">
      {/* Main Content Area (No Left Sidebar) */}
      <div className="soc-body-container">
        <Header />

        <CommandPalette
          isOpen={isCmdOpen}
          onClose={() => setIsCmdOpen(false)}
          threats={threats}
          onSelectThreat={handleSelectThreat}
          onRunReplay={handleRunReplay}
        />

        <div className="router-workspace">
          <Routes>
            <Route path="/" element={<DashboardPage threats={threats} metrics={metrics} onRefreshData={refreshAllData} />} />
            <Route path="/threats" element={<ThreatsPage threats={allRealThreats} metrics={metrics} onRefreshData={refreshAllData} />} />
            <Route path="/incidents" element={<ThreatsPage threats={threats} metrics={metrics} onRefreshData={refreshAllData} />} />
            <Route path="/reports" element={<ReportsPage threats={threats} />} />
            <Route path="/analytics" element={<AnalyticsPage metrics={metrics} />} />
          </Routes>
        </div>
      </div>
    </div>
  );
}

export default function App() {
  return (
    <BrowserRouter>
      <MainAppShell />
    </BrowserRouter>
  );
}
