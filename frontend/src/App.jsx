import React, { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route, useNavigate } from 'react-router-dom';
import Header from './components/layout/Header';
import CommandPalette from './components/layout/CommandPalette';

import DashboardPage from './pages/DashboardPage';
import ThreatsPage from './pages/ThreatsPage';
import LiveFetchPage from './pages/LiveFetchPage';
import AnalyticsPage from './pages/AnalyticsPage';

import {
  fetchThreats,
  fetchThreatDetail,
  replayThreat,
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
        setThreats(data.threats);
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
    navigate(`/threats?id=${encodeURIComponent(id)}`);
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
        onRefresh={refreshAllData}
      />

      <CommandPalette
        isOpen={isCmdOpen}
        onClose={() => setIsCmdOpen(false)}
        threats={threats}
        onSelectThreat={handleSelectThreat}
        onRunReplay={handleRunReplay}
      />

      <div className="router-workspace">
        <Routes>
          <Route path="/" element={<DashboardPage threats={threats} metrics={metrics} />} />
          <Route path="/threats" element={<ThreatsPage threats={threats} metrics={metrics} onRefreshData={refreshAllData} />} />
          <Route path="/live-fetch" element={<LiveFetchPage threats={threats} metrics={metrics} onRefreshData={refreshAllData} />} />
          <Route path="/analytics" element={<AnalyticsPage metrics={metrics} />} />
        </Routes>
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
