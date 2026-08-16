const { deterministicSort } = require('../../src/engine/ordering');

describe('Deterministic Event Ordering', () => {
  test('should sort events chronologically by timestamp ASC', () => {
    const events = [
      { eventId: 'evt_2', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.8 },
      { eventId: 'evt_1', timestamp: '2026-08-16T10:00:00Z', source: 'virus_total', confidence: 0.8 }
    ];

    const sorted = deterministicSort(events);
    expect(sorted[0].eventId).toBe('evt_1');
    expect(sorted[1].eventId).toBe('evt_2');
  });

  test('should break timestamp tie using Source Reliability Rank (AlienVault > VT > AI Report)', () => {
    const events = [
      { eventId: 'evt_ai', timestamp: '2026-08-16T12:00:00Z', source: 'ai_report', confidence: 0.9 },
      { eventId: 'evt_av', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.8 },
      { eventId: 'evt_vt', timestamp: '2026-08-16T12:00:00Z', source: 'virus_total', confidence: 0.85 }
    ];

    const sorted = deterministicSort(events);
    expect(sorted[0].eventId).toBe('evt_av'); // AlienVault (Rank 3)
    expect(sorted[1].eventId).toBe('evt_vt'); // VirusTotal (Rank 2)
    expect(sorted[2].eventId).toBe('evt_ai'); // AI Report (Rank 1)
  });

  test('should break timestamp and source rank tie using Confidence DESC', () => {
    const events = [
      { eventId: 'evt_low_conf', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.5 },
      { eventId: 'evt_high_conf', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.95 }
    ];

    const sorted = deterministicSort(events);
    expect(sorted[0].eventId).toBe('evt_high_conf');
    expect(sorted[1].eventId).toBe('evt_low_conf');
  });

  test('should use eventId string comparison as ultimate deterministic tie-breaker', () => {
    const events = [
      { eventId: 'evt_z', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.8 },
      { eventId: 'evt_a', timestamp: '2026-08-16T12:00:00Z', source: 'alienvault', confidence: 0.8 }
    ];

    const sorted = deterministicSort(events);
    expect(sorted[0].eventId).toBe('evt_a');
    expect(sorted[1].eventId).toBe('evt_z');
  });
});
