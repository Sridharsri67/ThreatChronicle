const express = require('express');
const router = express.Router();
const { handleLoadFixture } = require('../controllers/fixture.controller');

router.post('/load', handleLoadFixture);

module.exports = router;
