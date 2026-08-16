const Event = require('../models/Event');
const ThreatState = require('../models/ThreatState');
const AuditRecord = require('../models/AuditRecord');

async function handleGetMetrics(req, res, next) {
  try {
    const totalEvents = await Event.countDocuments();
    const totalThreats = await ThreatState.countDocuments();
    const totalAudits = await AuditRecord.countDocuments();

    const decisionBreakdown = await ThreatState.aggregate([
      { $group: { _id: '$decision', count: { $sum: 1 } } }
    ]);

    const breakdownMap = { BLOCKED: 0, SUSPICIOUS: 0, MONITOR: 0, CLEAN: 0 };
    decisionBreakdown.forEach(item => {
      if (item._id) breakdownMap[item._id] = item.count;
    });

    const sourceBreakdown = await Event.aggregate([
      { $group: { _id: '$source', count: { $sum: 1 } } }
    ]);

    return res.json({
      success: true,
      metrics: {
        totalEvents,
        totalThreats,
        totalAudits,
        decisions: breakdownMap,
        sources: sourceBreakdown.reduce((acc, curr) => {
          acc[curr._id] = curr.count;
          return acc;
        }, {}),
        engineVersion: '1.0.0',
        ruleVersion: 'v1.0',
        uptimeSeconds: process.uptime()
      }
    });
  } catch (err) {
    next(err);
  }
}

async function handleGetHealth(req, res, next) {
  return res.json({
    status: 'HEALTHY',
    service: 'ThreatChronicle Engine',
    timestamp: new Date().toISOString()
  });
}

module.exports = {
  handleGetMetrics,
  handleGetHealth
};
