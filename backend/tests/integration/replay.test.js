const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Event = require('../../src/models/Event');
const ThreatState = require('../../src/models/ThreatState');
const AuditRecord = require('../../src/models/AuditRecord');

describe('Deterministic Replay Engine API Integration', () => {
  beforeAll(async () => {
    const mongoUri = process.env.TEST_MONGO_URI || process.env.MONGO_URI || 'mongodb://127.0.0.1:27017/threatchronicle';
    await mongoose.connect(mongoUri);
  });

  afterEach(async () => {
    await Event.deleteMany({});
    await ThreatState.deleteMany({});
    await AuditRecord.deleteMany({});
  });

  afterAll(async () => {
    await mongoose.connection.close();
  });

  test('POST /api/threats/:id/replay should successfully verify decision against stored fingerprint', async () => {
    const events = [
      {
        eventId: 'evt_rp_1',
        source: 'alienvault',
        timestamp: '2026-08-16T10:00:00.000Z',
        type: 'ioc',
        indicator: { type: 'ip', value: '198.51.100.77' },
        threatLevel: 'high',
        confidence: 0.90
      },
      {
        eventId: 'evt_rp_2',
        source: 'virus_total',
        timestamp: '2026-08-16T11:00:00.000Z',
        type: 'scan',
        indicator: { type: 'ip', value: '198.51.100.77' },
        threatLevel: 'medium',
        confidence: 0.70
      }
    ];

    for (const evt of events) {
      await request(app).post('/api/events').send(evt);
    }

    const res = await request(app)
      .post('/api/threats/ip_198.51.100.77/replay')
      .expect(200);

    expect(res.body.success).toBe(true);
    expect(res.body.replay.match).toBe(true);
    expect(res.body.replay.verificationStatus).toBe('VERIFIED_MATCH');
    expect(res.body.replay.stored.decision).toBe(res.body.replay.replayed.decision);
    expect(res.body.replay.stored.fingerprint).toBe(res.body.replay.replayed.fingerprint);
  });
});
