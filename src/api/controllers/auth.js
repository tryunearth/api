const axios = require('axios')
const qs = require('querystring')

const {
  SuccessResponse,
  EmptySuccessResponse,
} = require('../../core/api-response')
const { JWT } = require('../../core/jwt')
const { BadRequestError } = require('../../core/api-error')
const { AuthRepo } = require('../../database/repositories')

/**
 * Axios abstraction utility.
 * TODO - move to `/utils` directory at some point in case of reuse.
 * @param {*} url
 * @param {*} method
 * @param {*} options
 */
const fetch = async (
  url,
  method = 'GET',
  options = { auth: {}, body: {}, headers: {} },
) => {
  const { data } = await axios({
    url,
    method,
    data: options.body ? options.body : null,
    ...options,
  })
  return data
}

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
  const updatedUser = await AuthRepo.readUser(user.id)
  new SuccessResponse({ user: updatedUser }).send(res)
}

const deleteUser = async (req, res, next) => {
  const { user } = res.locals
  await AuthRepo.removeUser(user.id)
  new EmptySuccessResponse().send(res)
}

/**
 * Endpoint for proxying client requests to Reddit's `/api/v1/access_token`
 * endpoint. Used to mask Reddit API keys (specifically the secret) since those
 * should not be used as environment variables in the client apps.
 *
 * References:
 *  - https://www.rockyourcode.com/secret-keys-in-react/
 *  - https://www.gatsbyjs.org/docs/environment-variables/#client-side-javascript
 *  - https://create-react-app.dev/docs/adding-custom-environment-variables/
 */
const oauthDance = async (req, res, next) => {
  const { REDDIT_CLIENT_ID, REDDIT_CLIENT_SECRET } = process.env
  const { grant_type, code, redirect_uri } = req.body

  if (!grant_type || !code || !redirect_uri) {
    throw new BadRequestError(
      'Missing one or more of the following: grant_type, code, redirect_uri',
    )
  }

  const body = qs.stringify(req.body)
  const { access_token, refresh_token } = await fetch(
    'https://www.reddit.com/api/v1/access_token',
    'POST',
    {
      body,
      auth: {
        username: REDDIT_CLIENT_ID,
        password: REDDIT_CLIENT_SECRET,
      },
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
    },
  )

  const { id, name, icon_img } = await fetch(
    'https://oauth.reddit.com/api/v1/me',
    'GET',
    {
      headers: {
        Authorization: `bearer ${access_token}`,
      },
    },
  )

  /**
   * Some URLs provided by Reddit contain the HTML entity for '&' (aka '&amp;')
   * and do not work, so we must clean them up.
   */
  const avatar_img = icon_img.replace(/(amp;)/gi, '')

  let user = await AuthRepo.readUser(id)
  if (!user) {
    const [newUser] = await AuthRepo.createUser({
      id: id,
      username: name,
      refresh_token: refresh_token,
      avatar_img,
    })
    user = newUser
  } else {
    await AuthRepo.updateUser(id, { refresh_token, avatar_img })
    user = await AuthRepo.readUser(id)
  }
  const token = new JWT(user).sign()
  new SuccessResponse({ auth: { user, token } }).send(res)
}

module.exports = { getUser, patchUser, deleteUser, oauthDance }
