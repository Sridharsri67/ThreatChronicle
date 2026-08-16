const ThreatState = require('../models/ThreatState');
const AuditRecord = require('../models/AuditRecord');
const Event = require('../models/Event');

async function getThreatState(threatId) {
  const threatState = await ThreatState.findOne({ threatId }).lean();
  if (!threatState) {
    return null;
  }

  const audits = await AuditRecord.find({ threatId }).sort({ stateVersion: 1 }).lean();
  const rawEvents = await Event.find({ threatId }).sort({ timestamp: 1 }).lean();

  return {
    ...threatState,
    audits,
    rawEvents
  };
}

async function listThreatStates(filter = {}, options = {}) {
  const query = {};
  if (filter.decision) {
    query.decision = filter.decision;
  }
  if (filter.search) {
    query.threatId = { $regex: filter.search, $options: 'i' };
  }

  const page = Math.max(1, parseInt(options.page) || 1);
  const limit = Math.min(100, Math.max(1, parseInt(options.limit) || 20));
  const skip = (page - 1) * limit;

  const total = await ThreatState.countDocuments(query);
  const threats = await ThreatState.find(query)
    .sort({ updatedAt: -1 })
    .skip(skip)
    .limit(limit)
    .lean();

  return {
    threats,
    pagination: {
      total,
      page,
      limit,
      pages: Math.ceil(total / limit)
    }
  };
}

module.exports = {
  getThreatState,
  listThreatStates
};
