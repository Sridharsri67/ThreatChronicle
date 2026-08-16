const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../../src/app');
const Event = require('../../src/models/Event');
const ThreatState = require('../../src/models/ThreatState');
const AuditRecord = require('../../src/models/AuditRecord');

describe('Performance Benchmark Test (>100 events/sec local target)', () => {
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

  test('should process 150 events locally in under 1.5 seconds (>100 events/sec)', async () => {
    const EVENT_COUNT = 150;
    const events = [];

    for (let i = 0; i < EVENT_COUNT; i++) {
      const threatNum = i % 10;
      events.push({
        eventId: `evt_bench_${i}`,
        source: i % 3 === 0 ? 'alienvault' : (i % 3 === 1 ? 'virus_total' : 'ai_report'),
        timestamp: new Date(Date.now() - (EVENT_COUNT - i) * 1000).toISOString(),
        type: 'benchmark_telemetry',
        indicator: { type: 'ip', value: `192.168.10.${threatNum}` },
        threatLevel: i % 2 === 0 ? 'high' : 'medium',
        confidence: 0.8
      });
    }

    const startTime = Date.now();

    // Ingest events in batches of 30
    const batchSize = 30;
    for (let i = 0; i < events.length; i += batchSize) {
      const chunk = events.slice(i, i + batchSize);
      await request(app).post('/api/events').send(chunk);
    }

    const durationMs = Date.now() - startTime;
    const eventsPerSec = (EVENT_COUNT / (durationMs / 1000));

    console.log(`[Benchmark Performance] Processed ${EVENT_COUNT} events in ${durationMs}ms => ${eventsPerSec.toFixed(2)} events/sec`);

    expect(eventsPerSec).toBeGreaterThan(100);
  });
});
