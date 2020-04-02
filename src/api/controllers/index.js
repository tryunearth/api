const authController = require('./auth')
const healthCheckController = require('./health-check')
const tagsController = require('./tags')
const thingsController = require('./things')

module.exports = {
  auth: authController,
  healthCheck: healthCheckController,
  tags: tagsController,
  things: thingsController,
}
