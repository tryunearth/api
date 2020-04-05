const {
  SuccessResponse,
  EmptySuccessResponse,
  CreatedSuccessResponse,
} = require('../../core/api-response')
const { BadRequestError, NotFoundError } = require('../../core/api-error')
const { TagsRepo } = require('../../database/repositories')

const getTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { id } = req.params

  const tag = await TagsRepo.readTagById(user.id, id)
  if (!tag) {
    throw new NotFoundError('No tag found with the given id')
  }
  new SuccessResponse({ tag }).send(res)
}

const getTags = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const tags = await TagsRepo.browseTags(user.id)
  new SuccessResponse({ tags }).send(res)
}

const postTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { name } = req.body
  if (!name || name.length > 32) {
    throw new BadRequestError(
      '`name` required and must be between 1 - 32 characters',
    )
  }
  const tag = await TagsRepo.createTag(user.id, name)
  new CreatedSuccessResponse({ tag }).send(res)
}

const deleteTag = async (req, res, next) => {
  // DEBUG
  const user = { id: 'xmeax' }
  req.user = user

  const { id } = req.params

  const deleted = await TagsRepo.removeTag(user.id, id)
  if (!deleted) {
    throw new NotFoundError('No tag found with the given id')
  }
  new EmptySuccessResponse().send(res)
}

module.exports = {
  getTag,
  getTags,
  postTag,
  deleteTag,
}
