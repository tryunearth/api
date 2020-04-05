const {
  SuccessResponse,
  EmptySuccessResponse,
  CreatedSuccessResponse,
} = require('../../core/api-response')
const { BadRequestError, NotFoundError } = require('../../core/api-error')
const { ThingsRepo } = require('../../database/repositories')

const getThings = async (req, res, next) => {
  const user = { id: 'xmeax' }

  // TODO - handle include param (e.g. `?include=tags`)
  //        used to connect related resources
  // const { include } = req.query

  const things = await ThingsRepo.browseThings(user.id)
  new SuccessResponse({ things }).send(res)
}

const postThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  const data = req.body
  // check thing attributes here

  const thing = await ThingsRepo.createThing(user.id, data)
  new CreatedSuccessResponse({ thing }).send(res)
}

const patchThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
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
  const user = { id: 'xmeax' }
  const { id } = req.params

  const deleted = await ThingsRepo.removeThing(user.id, id)
  if (!deleted) {
    throw new NotFoundError('No thing found with the given id')
  }
  new EmptySuccessResponse().send(res)
}

module.exports = { getThings, postThing, patchThing, deleteThing }
