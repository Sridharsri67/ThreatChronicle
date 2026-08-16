const { resolveConflicts } = require('../../src/engine/resolver');

describe('Conflict Resolution Engine', () => {
  test('should prioritize AlienVault over VirusTotal and AI Report when conflicting', () => {
    const events = [
      { eventId: 'evt_ai', source: 'ai_report', threatLevel: 'critical', confidence: 0.99, timestamp: '2026-08-16T12:10:00Z' },
      { eventId: 'evt_av', source: 'alienvault', threatLevel: 'high', confidence: 0.80, timestamp: '2026-08-16T12:00:00Z' },
      { eventId: 'evt_vt', source: 'virus_total', threatLevel: 'low', confidence: 0.95, timestamp: '2026-08-16T12:05:00Z' }
    ];

    const result = resolveConflicts(events);

    expect(result.hasConflict).toBe(true);
    expect(result.winningCandidate.source).toBe('alienvault');
    expect(result.winningCandidate.eventId).toBe('evt_av');
    expect(result.resolutionSteps.length).toBeGreaterThan(2);
  });
});
