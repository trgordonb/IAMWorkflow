const Log = require('../models/log.model')
const createLoggerResource = require('../features/logger/logger.resource')
const loggerConfig = require('../config/logger.config')

const LogResource = createLoggerResource({
  resource: Log,
  featureOptions: loggerConfig,
});

module.exports = LogResource