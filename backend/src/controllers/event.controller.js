const { ingestEvent } = require('../services/ingestion.service');
const { fetchAndIngestLiveIntelligence } = require('../services/external.service');
const Event = require('../models/Event');

async function handleIngestEvent(req, res, next) {
  try {
    const payload = req.body;

    if (Array.isArray(payload)) {
      // Batch ingestion
      const results = [];
      for (const item of payload) {
        const result = await ingestEvent(item);
        results.push(result);
      }
      return res.status(201).json({
        success: true,
        batchSize: payload.length,
        results
      });
    }

    const result = await ingestEvent(payload);
    const status = result.duplicate ? 200 : 201;

    return res.status(status).json(result);
  } catch (err) {
    next(err);
  }
}

async function handleFetchLiveEvents(req, res, next) {
  try {
    const { indicator } = req.body;
    if (!indicator || !indicator.value) {
      return res.status(400).json({
        accepted: false,
        error: 'Indicator payload with value property is required (e.g. { indicator: { type: "ip", value: "8.8.8.8" } })'
      });
    }

    const value = indicator.value;
    const type = indicator.type || 'ip';

    const result = await fetchAndIngestLiveIntelligence(value, type);
    return res.json(result);
  } catch (err) {
    next(err);
  }
}

async function handleGetEvents(req, res, next) {
  try {
    const { threatId, source, type, from, to, limit = 50, page = 1 } = req.query;
    const query = {};

    if (threatId) query.threatId = threatId;
    if (source) query.source = source;
    if (type) query.type = type;
    if (from || to) {
      query.timestamp = {};
      if (from) query.timestamp.$gte = new Date(from);
      if (to) query.timestamp.$lte = new Date(to);
    }

    const skip = (Math.max(1, parseInt(page)) - 1) * Math.min(200, parseInt(limit));
    const total = await Event.countDocuments(query);
    const events = await Event.find(query)
      .sort({ timestamp: 1 })
      .skip(skip)
      .limit(Math.min(200, parseInt(limit)))
      .lean();

    return res.json({
      success: true,
      events,
      pagination: {
        total,
        page: parseInt(page),
        limit: parseInt(limit),
        pages: Math.ceil(total / parseInt(limit))
      }
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleIngestEvent,
  handleFetchLiveEvents,
  handleGetEvents
};
