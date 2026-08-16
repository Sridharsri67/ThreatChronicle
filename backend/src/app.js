const express = require('express');
const cors = require('cors');

const eventRoutes = require('./routes/event.routes');
const threatRoutes = require('./routes/threat.routes');
const replayRoutes = require('./routes/replay.routes');
const fixtureRoutes = require('./routes/fixture.routes');
const metricsRoutes = require('./routes/metrics.routes');

const app = express();

app.use(cors());
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/events', eventRoutes);
app.use('/api/threats', threatRoutes);
app.use('/api/threats', replayRoutes);
app.use('/api/fixtures', fixtureRoutes);
app.use('/api', metricsRoutes);

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('[Engine Error]:', err);
  res.status(err.status || 500).json({
    accepted: false,
    error: err.message || 'Internal ThreatChronicle Engine Error',
    ...(process.env.NODE_ENV === 'development' ? { stack: err.stack } : {})
  });
});

module.exports = app;
