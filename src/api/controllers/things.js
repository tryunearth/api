const {
  createThing,
  browseThings,
  updateThing,
  removeThing,
} = require('../../services/things-service')

const getThings = async (req, res, next) => {
  const user = { id: 'xmeax' }

  // TODO - handle include param (e.g. `?include=tags`)
  //        used to connect related resources
  // const { include } = req.query

  try {
    const things = await browseThings(user.id)
    res.status(200).json({ things })
  } catch (error) {
    return next(error.toString())
  }
}

const postThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  try {
    const data = req.body
    // check thing attributes here

    const thing = await createThing(user.id, data)
    res.status(201).json({ thing })
    return next()
  } catch (error) {
    return next(error.toString())
  }
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

  try {
    const updated = await updateThing(user.id, id, data)
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
  } catch (error) {
    return next(error.toString())
  }
}

const deleteThing = async (req, res, next) => {
  const user = { id: 'xmeax' }
  const { id } = req.params

  try {
    const deleted = await removeThing(user.id, id)
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
  } catch (error) {
    return next(error.toString())
  }
}

module.exports = { getThings, postThing, patchThing, deleteThing }
