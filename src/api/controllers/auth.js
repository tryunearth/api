const {
  SuccessResponse,
  EmptySuccessResponse,
} = require('../../core/api-response')
const { BadRequestError } = require('../../core/api-error')
const { AuthRepo } = require('../../database/repositories')

const getUser = async (req, res, next) => {
  const { user } = res.locals
  const u = await AuthRepo.readUser(user.id)
  new SuccessResponse({ user: u }).send(res)
}

const patchUser = async (req, res, next) => {
  const { user } = res.locals
  const data = req.body

  // request body does not meet endpoint constraints,
  // can only update the following fields:
  //    - email
  //    - frequency
  //    - refresh-token
  //
  // TODO - `express-validator` may come in handy in these situations
  //    - https://express-validator.github.io/docs/
  //    - https://github.com/validatorjs/validator.js
  if (!data || (!data.email && !data.frequency && !data.refresh_token)) {
    throw new BadRequestError('Missing or malformed request body')
  }

  // remove all other attributes other than the updatable attributes
  for (key in data) {
    // TODO - change data structure from Array to something like a Set where
    // lookup is O(1) rather than O(n)
    const allowedAttributes = ['email', 'frequency', 'refresh_token']
    if (!allowedAttributes.includes(key.toLowerCase())) {
      delete data[key]
    }
  }

  await AuthRepo.updateUser(user.id, data)
  new EmptySuccessResponse().send(res)
}

const deleteUser = async (req, res, next) => {
  const { user } = res.locals
  await AuthRepo.removeUser(user.id)
  new EmptySuccessResponse().send(res)
}

const oauthDance = async (req, res, next) => {
  /**
   * 1. POST /api/v1/access_token
   * 2. GET /api/v1/me
   * 3. check if user exists in db:
   *    a. True: return JWT
   *    b. False:
   *      - create user account
   *      - return JWT
   */
}

module.exports = { getUser, patchUser, deleteUser, oauthDance }
