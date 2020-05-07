const {
  SuccessResponse,
  EmptySuccessResponse,
  CreatedSuccessResponse,
} = require('../../core/api-response')
const {
  BadRequestError,
  NotFoundError,
  TooManyRequestsError,
} = require('../../core/api-error')
const {
  AuthRepo,
  ThingsRepo,
  RedditRepo,
} = require('../../database/repositories')

const getThings = async (req, res, next) => {
  const { user } = res.locals

  // TODO - handle include param (e.g. `?include=tags`)
  //        used to connect related resources
  // const { include } = req.query
  const filters = req.query

  const things = await ThingsRepo.browseThings(user.id, filters)
  new SuccessResponse({ things }).send(res)
}

const postThing = async (req, res, next) => {
  const { user } = res.locals
  const data = req.body
  // TODO - check thing properties here
  const thing = await ThingsRepo.createThing(user.id, data)
  new CreatedSuccessResponse({ thing }).send(res)
}

const patchThing = async (req, res, next) => {
  const { user } = res.locals
  const { id } = req.params
  const data = req.body

  // request body does not meet endpoint constraints
  if (!data || typeof data.surfaced !== 'boolean') {
    throw new BadRequestError('Missing or malformed request body')
  }

  // remove all other attributes other than `surfaced`
  for (key in data) {
    if (key.toLowerCase() !== 'surfaced') {
      delete data[key]
    }
  }

  const updated = await ThingsRepo.updateThing(user.id, id, data)
  if (!updated) {
    throw new NotFoundError('No thing found with the given id')
  }
  new EmptySuccessResponse().send(res)
}

const deleteThing = async (req, res, next) => {
  const { user } = res.locals
  const { id } = req.params
  const deleted = await ThingsRepo.removeThing(user.id, id)
  if (!deleted) {
    throw new NotFoundError('No thing found with the given id')
  }
  new EmptySuccessResponse().send(res)
}

/**
 * Utility function to check whether or not a given timestamp is within the
 * range of now minus one hour. Used to restrict the number of Reddit syncs.
 * @param {Number} lastSyncTime Integer representing a Unix timestamp in seconds.
 * @returns {Object} Object minimally containing an `isAllowed` property
 *            of type Boolean denoting whether or not syncing should continue.
 *            If not, then a second property `retryAfter` is also provided to be
 *            sent along in the header of the HTTP 429 status code.
 */
const isAllowedToSync = (lastSyncTime) => {
  const ONE_HOUR_SECS = 60 * 60 * 1
  const ONE_HOUR_PREV_PERIOD = Math.round(Date.now() / 1000) - ONE_HOUR_SECS
  const status = {}
  if (lastSyncTime <= ONE_HOUR_PREV_PERIOD) {
    status['isAllowed'] = true
  } else {
    status['isAllowed'] = false
    status['retryAfter'] = lastSyncTime - ONE_HOUR_PREV_PERIOD
  }
  return status
}

const syncThings = async (req, res, next) => {
  const { user } = res.locals
  if (!user.has_completed_onboarding) {
    await RedditRepo.fetchAllSaves(user, { initialSync: true })
    new EmptySuccessResponse().send(res)
  }

  const userSyncStatus = isAllowedToSync(user.last_sync_time)
  if (userSyncStatus.isAllowed) {
    const parity = await RedditRepo.fetchAllSaves(user)
    new SuccessResponse({ parity }).send(res)
  } else {
    throw new TooManyRequestsError(
      'Cannot sync at this time, try again later',
      userSyncStatus['retryAfter'],
    )
  }
}

module.exports = { getThings, postThing, patchThing, deleteThing, syncThings }
