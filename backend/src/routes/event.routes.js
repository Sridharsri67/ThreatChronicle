const express = require('express');
const router = express.Router();
const { handleIngestEvent, handleFetchLiveEvents, handleGetEvents } = require('../controllers/event.controller');
const { validateEventIngestion } = require('../validators/event.validator');

router.post('/', validateEventIngestion, handleIngestEvent);
router.post('/fetch-live', handleFetchLiveEvents);
router.get('/', handleGetEvents);

module.exports = router;
