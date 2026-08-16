const mongoose = require('mongoose');

const EventSchema = new mongoose.Schema({
  eventId: {
    type: String,
    required: true,
    index: true
  },
  fingerprint: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  source: {
    type: String,
    required: true,
    enum: ['alienvault', 'virus_total', 'edr', 'ai_report', 'generic'],
    index: true
  },
  timestamp: {
    type: Date,
    required: true,
    index: true
  },
  receivedAt: {
    type: Date,
    default: Date.now,
    index: true
  },
  type: {
    type: String,
    required: true
  },
  threatId: {
    type: String,
    required: true,
    index: true
  },
  indicator: {
    type: {
      type: String,
      enum: ['ip', 'domain', 'hash', 'url', 'endpoint'],
      required: true
    },
    value: {
      type: String,
      required: true
    }
  },
  threatLevel: {
    type: String,
    enum: ['critical', 'high', 'medium', 'low', 'clean', 'info', 'unknown'],
    default: 'unknown'
  },
  confidence: {
    type: Number,
    min: 0,
    max: 1,
    required: true,
    default: 0.5
  },
  data: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  normalizedData: {
    type: mongoose.Schema.Types.Mixed,
    default: {}
  },
  schemaVersion: {
    type: Number,
    default: 1
  }
}, {
  timestamps: true
});

// Compound index for threat timeline querying and deterministic sorting
EventSchema.index({ threatId: 1, timestamp: 1 });
EventSchema.index({ threatId: 1, receivedAt: 1 });

module.exports = mongoose.model('Event', EventSchema);
