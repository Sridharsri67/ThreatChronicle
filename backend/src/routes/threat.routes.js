const express = require('express');
const router = express.Router();
const { handleListThreats, handleGetThreat, handleDownloadReport } = require('../controllers/threat.controller');
const { handleReplayThreat } = require('../controllers/replay.controller');

router.get('/', handleListThreats);
router.get('/:id', handleGetThreat);
router.get('/:id/report', handleDownloadReport);
router.post('/:id/replay', handleReplayThreat);

module.exports = router;
