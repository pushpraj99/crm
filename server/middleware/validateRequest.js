const { sendError } = require('../utils/responseHelper');

const validateRequest = (requiredFields) => {
  return (req, res, next) => {
    const missingFields = [];
    requiredFields.forEach(field => {
      if (req.body[field] === undefined || req.body[field] === null || req.body[field] === '') {
        missingFields.push(field);
      }
    });

    if (missingFields.length > 0) {
      return sendError(res, `Missing required fields: ${missingFields.join(', ')}`, 400);
    }

    next();
  };
};

module.exports = validateRequest;
