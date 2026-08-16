const { replayThreat } = require('../services/replay.service');

async function handleReplayThreat(req, res, next) {
  try {
    const { id } = req.params;
    const result = await replayThreat(id);

    if (result.error) {
      return res.status(404).json({
        success: false,
        error: result.error
      });
    }

    return res.json({
      success: true,
      replay: result
    });
  } catch (err) {
    next(err);
  }
}

module.exports = {
  handleReplayThreat
};
