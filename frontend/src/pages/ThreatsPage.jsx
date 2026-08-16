import React, { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import ThreatList from '../components/threats/ThreatList';
import DecisionHero from '../components/decision/DecisionHero';
import ReplayConsole from '../components/replay/ReplayConsole';
import EventTimeline from '../components/timeline/EventTimeline';
import ConflictPanel from '../components/conflict/ConflictPanel';
import AuditTimeline from '../components/audit/AuditTimeline';
import PerformancePanel from '../components/dashboard/PerformancePanel';

import { fetchThreatDetail, replayThreat } from '../services/api';

export default function ThreatsPage({ threats, metrics, onRefreshData }) {
  const [searchParams, setSearchParams] = useSearchParams();
  const queryId = searchParams.get('id');

  const [selectedThreatId, setSelectedThreatId] = useState(queryId || (threats && threats.length > 0 ? threats[0].threatId : null));
  const [selectedThreatData, setSelectedThreatData] = useState(null);

  useEffect(() => {
    if (queryId) {
      setSelectedThreatId(queryId);
    } else if (threats && threats.length > 0 && !selectedThreatId) {
      setSelectedThreatId(threats[0].threatId);
    }
  }, [queryId, threats]);

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
    if (selectedThreatId) {
      loadThreatDetail(selectedThreatId);
    }
  }, [selectedThreatId]);

  const handleSelectThreat = (id) => {
    setSelectedThreatId(id);
    setSearchParams({ id });
  };

  const handleRunReplay = async (id) => {
    const data = await replayThreat(id);
    return data ? data.replay : null;
  };

  return (
    <div className="main-workspace">
      <ThreatList
        threats={threats}
        selectedThreatId={selectedThreatId}
        onSelectThreat={handleSelectThreat}
      />

      <div className="inspector-canvas">
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
            No threat selected. Choose a threat from the investigation queue to inspect state reconstruction and replay verification.
          </div>
        )}
      </div>
    </div>
  );
}
