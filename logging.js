const bunyan = require('bunyan')
const logger = bunyan.createLogger({
  name: "mock",
  src: true,
  level: 'trace',
  serializers: bunyan.stdSerializers
})

logger.info('Logger created, level: %s', logger.level())

module.exports = logger