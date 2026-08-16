const express = require('express');
const router = express.Router();
const { handleReplayThreat } = require('../controllers/replay.controller');

router.post('/:id/replay', handleReplayThreat);

module.exports = router;
