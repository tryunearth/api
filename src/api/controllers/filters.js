const { SuccessResponse } = require('../../core/api-response')
const { BadRequestError } = require('../../core/api-error')
const { FiltersRepo } = require('../../database/repositories')

const getFilters = async (req, res, next) => {
  const { user } = res.locals
  const subreddits = await FiltersRepo.browseSubreddits(user.id)
  const tags = await FiltersRepo.browseTags(user.id)
  new SuccessResponse({ filters: { subreddits, tags } }).send(res)
}

module.exports = { getFilters }
