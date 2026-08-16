const { generateEventFingerprint, generateDecisionFingerprint } = require('../../src/utils/fingerprint');

describe('Fingerprint Utility', () => {
  test('should generate identical event fingerprint for identical event inputs', () => {
    const evt1 = {
      source: 'alienvault',
      threatId: 'ip_192.168.1.1',
      timestamp: '2026-08-16T10:00:00.000Z',
      type: 'ioc',
      indicator: { type: 'ip', value: '192.168.1.1' }
    };

    const evt2 = {
      source: 'AlienVault ',
      threatId: 'IP_192.168.1.1',
      timestamp: '2026-08-16T10:00:00.000Z',
      type: 'IOC',
      indicator: { type: 'ip', value: '192.168.1.1' }
    };

    const fp1 = generateEventFingerprint(evt1);
    const fp2 = generateEventFingerprint(evt2);

    expect(fp1).toHaveLength(64); // SHA-256 hex string length
    expect(fp1).toBe(fp2);
  });

  test('should generate reproducible decision fingerprint', () => {
    const events = [{ eventId: 'evt_1', fingerprint: 'fp1', source: 'alienvault', timestamp: '2026-08-16T10:00:00.000Z' }];
    const fpA = generateDecisionFingerprint(events, 'v1.0', 'BLOCKED', 0.85);
    const fpB = generateDecisionFingerprint(events, 'v1.0', 'BLOCKED', 0.85);

    expect(fpA).toBe(fpB);
  });
});
