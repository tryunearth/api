const { ThingsRepo } = require('../../database/repositories')

const getThings = async (req, res, next) => {
  const user = { id: 'xmeax' }

  // TODO - handle include param (e.g. `?include=tags`)
  //        used to connect related resources
  // const { include } = req.query

  const things = await ThingsRepo.browseThings(user.id)
  res.status(200).json({ things })
}

const postThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  const data = req.body
  // check thing attributes here

  const thing = await ThingsRepo.createThing(user.id, data)
  res.status(201).json({ thing })
  return next()
}

const patchThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  const { id } = req.params
  const data = req.body

  // request body does not meet endpoint constraints
  if (!data || typeof data.surfaced !== 'boolean') {
    const error = {
      status: 400,
      message:
        'Missing or malformed request body. Field `surfaced` is required!',
    }
    res.status(error.status).json({ error })
    return next()
  }

  // remove all other attributes other than `surfaced`
  for (key in data) {
    if (key.toLowerCase() !== 'surfaced') {
      delete data[key]
    }
  }

  const updated = await ThingsRepo.updateThing(user.id, id, data)
  if (!updated) {
    const error = {
      status: 404,
      message:
        'Could not find any thing with the given id associated with the authorized user.',
    }
    res.status(error.status).json({ error })
    return next()
  }
  res.status(204).end()
  return next()
}

const deleteThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  const { id } = req.params

  const deleted = await ThingsRepo.removeThing(user.id, id)
  if (!deleted) {
    const error = {
      status: 404,
      message:
        'Could not find any thing with the given id associated with the authorized user.',
    }
    res.status(error.status).json({ error })
    return next()
  }
  res.status(204).end()
  return next()
}

module.exports = { getThings, postThing, patchThing, deleteThing }
