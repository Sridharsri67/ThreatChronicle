const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Event = require('../../src/models/Event');
const ThreatState = require('../../src/models/ThreatState');
const AuditRecord = require('../../src/models/AuditRecord');

describe('Event Ingestion & Deduplication API Integration', () => {
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

  test('POST /api/events should accept valid security event and create ThreatState v1', async () => {
    const payload = {
      eventId: 'evt_test_01',
      source: 'alienvault',
      timestamp: '2026-08-16T10:00:00.000Z',
      type: 'ioc',
      indicator: { type: 'ip', value: '198.51.100.50' },
      threatLevel: 'high',
      confidence: 0.85
    };

    const res = await request(app)
      .post('/api/events')
      .send(payload)
      .expect(201);

    expect(res.body.accepted).toBe(true);
    expect(res.body.duplicate).toBe(false);
    expect(res.body.threatId).toBe('ip_198.51.100.50');
    expect(res.body.stateVersion).toBe(1);
    expect(res.body.decision).toBe('BLOCKED');
  });

  test('POST /api/events should reject duplicate event and keep state version unchanged', async () => {
    const payload = {
      eventId: 'evt_dup_test',
      source: 'alienvault',
      timestamp: '2026-08-16T10:00:00.000Z',
      type: 'ioc',
      indicator: { type: 'ip', value: '198.51.100.50' },
      threatLevel: 'high',
      confidence: 0.85
    };

    // First ingestion
    await request(app).post('/api/events').send(payload).expect(201);

    // Duplicate ingestion
    const res = await request(app)
      .post('/api/events')
      .send(payload)
      .expect(200);

    expect(res.body.accepted).toBe(false);
    expect(res.body.duplicate).toBe(true);
    expect(res.body.stateVersion).toBe(1);
  });
});
