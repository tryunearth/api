const {
  readUser,
  updateUser,
  removeUser,
} = require('../../services/auth-service')

const getUser = async (req, res, next) => {
  const u = { id: 'xmeax' }
  const user = await readUser(u.id)
  res.status(200).json({ user })
  return next()
}

const patchUser = async (req, res, next) => {
  const u = { id: 'xmeax' }
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
    const error = {
      status: 400,
      message:
        'Missing or malformed request body. Fields qualified for updating: `email`, `frequency`, `refresh_token`',
    }
    res.status(error.status).json({ error })
    return next()
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

  await updateUser(u.id, data)
  res.status(204).end()
  return next()
}

const deleteUser = async (req, res, next) => {
  const u = { id: 'xmeax' }
  await removeUser(u.id)
  res.status(204).end()
  return next()
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
