const path = require('path');
const fs = require('fs');
const { ingestEvent } = require('../services/ingestion.service');

const FIXTURES_DIR = path.resolve(__dirname, '../../../fixtures');

async function handleLoadFixture(req, res, next) {
  try {
    const { name } = req.body;
    if (!name) {
      return res.status(400).json({
        success: false,
        error: 'Fixture name is required. Options: duplicate, late-event, conflict, same-timestamp, out-of-order, invalidation, ai-report, mixed-incident, or all'
      });
    }

    let filesToLoad = [];
    if (name === 'all') {
      filesToLoad = fs.readdirSync(FIXTURES_DIR).filter(f => f.endsWith('.json'));
    } else {
      const targetFile = name.endsWith('.json') ? name : `${name}.json`;
      if (!fs.existsSync(path.join(FIXTURES_DIR, targetFile))) {
        return res.status(404).json({
          success: false,
          error: `Fixture file '${targetFile}' not found in ${FIXTURES_DIR}`
        });
      }
      filesToLoad = [targetFile];
    }

    const results = [];
    for (const file of filesToLoad) {
      const content = JSON.parse(fs.readFileSync(path.join(FIXTURES_DIR, file), 'utf-8'));
      const payload = Array.isArray(content) ? content : [content];
      for (const item of payload) {
        const res = await ingestEvent(item);
        results.push({ fixture: file, result: res });
      }
    }

    return res.status(200).json({
      success: true,
      message: `Loaded ${filesToLoad.length} fixture file(s)`,
      totalEventsProcessed: results.length,
      results
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleLoadFixture
};
