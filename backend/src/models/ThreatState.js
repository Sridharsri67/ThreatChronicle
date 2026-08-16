const mongoose = require('mongoose');

const EvidenceItemSchema = new mongoose.Schema({
  eventId: String,
  fingerprint: String,
  source: String,
  timestamp: Date,
  receivedAt: Date,
  type: String,
  threatLevel: String,
  confidence: Number,
  isLate: Boolean,
  normalizedData: mongoose.Schema.Types.Mixed
}, { _id: false });

const ThreatStateSchema = new mongoose.Schema({
  threatId: {
    type: String,
    required: true,
    unique: true,
    index: true
  },
  version: {
    type: Number,
    required: true,
    default: 1
  },
  decision: {
    type: String,
    enum: ['BLOCKED', 'SUSPICIOUS', 'MONITOR', 'CLEAN'],
    required: true,
    default: 'MONITOR'
  },
  confidence: {
    type: Number,
    required: true,
    default: 0
  },
  score: {
    type: Number,
    default: 0
  },
  winningEvidence: {
    source: String,
    eventId: String,
    threatLevel: String,
    confidence: Number
  },
  evidence: [EvidenceItemSchema],
  totalEvents: {
    type: Number,
    default: 0
  },
  firstSeen: Date,
  lastEventTime: Date,
  lastEventReceivedAt: Date,
  decisionFingerprint: {
    type: String,
    required: true
  },
  ruleVersion: {
    type: String,
    default: 'v1.0'
  }
}, {
  timestamps: true
});

module.exports = mongoose.model('ThreatState', ThreatStateSchema);
