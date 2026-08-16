const mongoose = require('mongoose');

const ResolutionStepSchema = new mongoose.Schema({
  step: Number,
  description: String,
  candidates: mongoose.Schema.Types.Mixed,
  winner: mongoose.Schema.Types.Mixed,
  reason: String
}, { _id: false });

const AuditRecordSchema = new mongoose.Schema({
  threatId: {
    type: String,
    required: true,
    index: true
  },
  stateVersion: {
    type: Number,
    required: true
  },
  decision: {
    type: String,
    enum: ['BLOCKED', 'SUSPICIOUS', 'MONITOR', 'CLEAN'],
    required: true
  },
  confidence: {
    type: Number,
    required: true
  },
  triggerEventId: String,
  triggerEventSource: String,
  triggerEventIsLate: Boolean,
  eventIds: [String],
  totalEventsConsidered: Number,
  resolutionSteps: [ResolutionStepSchema],
  rulesApplied: [String],
  previousDecision: String,
  previousVersion: Number,
  changed: {
    type: Boolean,
    default: false
  },
  changeReason: String,
  replayFingerprint: {
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

AuditRecordSchema.index({ threatId: 1, stateVersion: 1 }, { unique: true });

module.exports = mongoose.model('AuditRecord', AuditRecordSchema);
