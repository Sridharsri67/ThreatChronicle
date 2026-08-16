const express = require('express');
const router = express.Router();
const { handleGetMetrics, handleGetHealth } = require('../controllers/metrics.controller');

router.get('/metrics', handleGetMetrics);
router.get('/health', handleGetHealth);

module.exports = router;
