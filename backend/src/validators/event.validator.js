const { body, validationResult } = require('express-validator');

const validateEventIngestion = [
  body('source')
    .notEmpty()
    .withMessage('Event source is required')
    .isString()
    .withMessage('Event source must be a string'),

  body('timestamp')
    .notEmpty()
    .withMessage('Event timestamp is required')
    .custom((val) => {
      const d = Date.parse(val);
      if (isNaN(d)) {
        throw new Error('Invalid ISO timestamp format');
      }
      return true;
    }),

  body('type')
    .optional()
    .isString()
    .withMessage('Event type must be a string'),

  body('threatLevel')
    .optional()
    .isString(),

  body('confidence')
    .optional()
    .custom((val) => {
      const num = Number(val);
      if (isNaN(num)) {
        throw new Error('Confidence must be a valid number');
      }
      return true;
    }),

  (req, res, next) => {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(400).json({
        accepted: false,
        error: 'Schema validation failed',
        details: errors.array().map(e => ({ field: e.path, message: e.msg }))
      });
    }
    next();
  }
];

module.exports = {
  validateEventIngestion
};
