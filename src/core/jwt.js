const jwt = require('jsonwebtoken')
const { UnauthorizedError } = require('./api-error')
const asyncHandler = require('../api/helpers/async-handler')

const SECRET = process.env.SECRET || 'some-secret-key'

/**
 * Usage: `new JWT({ id: 123, username: 'bob' }).sign()`
 *
 * Helper class wrapping the `jsonwebtoken` library. Constructor accepts 1
 * argument, `user`, which acts as the JWT payload.
 *
 * Also included is the static `authorize` method to be used as middleware for,
 * well, authorizing protected endpoints.
 */
class JWT {
  /**
   *
   * @param {Object} user User object from db which *must* contain the user id
   */
  constructor(user) {
    if (!user.hasOwnProperty('id')) {
      throw new TypeError('not enough arguments: missing required `id`')
    } else if (!!user.id === false) {
      throw new TypeError('invalid value for required argument `id`')
    }
    this.payload = user
  }

  sign() {
    return jwt.sign(this.payload, SECRET)
  }

  static authorize = asyncHandler(async (req, res, next) => {
    const token = req.headers.authorization
      ? req.headers.authorization.split(' ')[1]
      : null
    if (!token) {
      throw new UnauthorizedError('Missing token from `Authorization` header')
    }
    jwt.verify(token, SECRET, (error, decoded) => {
      if (error) {
        throw new UnauthorizedError(`[${error.name}] ${error.message}`)
      } else {
        res.locals.user = decoded
        return next()
      }
    })
  })
}

module.exports = { JWT }
