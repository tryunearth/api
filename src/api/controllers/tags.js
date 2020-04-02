const {
  createTag,
  browseTags,
  readTagById,
  removeTag,
} = require('../../services/tags-service')

const getTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { id } = req.params

  try {
    const tag = await readTagById(user.id, id)
    if (!tag) {
      const error = {
        status: 404,
        message:
          'Could not find any tag with the given id associated with the authorized user.',
      }
      res.status(error.status).json({ error })
      return next()
    }
    res.status(200).json({ tag })
    return next()
  } catch (error) {
    return next(error.toString())
  }
}

const getTags = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  try {
    const tags = await browseTags(user.id)
    res.status(200).json({ tags })
    return next()
  } catch (error) {
    return next(error.toString())
  }
}

const postTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { name } = req.body

  if (!name || name.length > 32) {
    const error = {
      status: 400,
      message:
        'Field `name` is required and cannot be empty and must not exceed 32 characters.',
    }
    res.status(error.status).json({ error })
    return next()
  }

  try {
    const tag = await createTag(user.id, name)
    res.status(201).json({ tag })
    return next()
  } catch (error) {
    return next(error.toString())
  }
}

const deleteTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { id } = req.params

  try {
    const deleted = await removeTag(user.id, id)
    if (!deleted) {
      const error = {
        status: 404,
        message:
          'Could not find any tag with the given id associated with the authorized user.',
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

module.exports = {
  getTag,
  getTags,
  postTag,
  deleteTag,
}
