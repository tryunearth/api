class APIResponse {
  /**
   * TODO
   * @param {*} status
   * @param {*} payload
   */
  constructor(status, payload) {
    this.status = status
    this.payload = payload
  }

  prepare(res, response) {
    return res.status(this.status).json(response)
  }

  send(res) {
    return this.prepare(res, this)
  }
}

APIResponse.STATUS_CODE = {
  SUCCESS: 200,
  CREATED: 201,
  NO_CONTENT: 204,

  BAD_REQUEST: 400,
  UNAUTHORIZED: 401,
  NOT_FOUND: 404,
  TOO_MANY_REQUESTS: 429,

  INTERNAL_ERROR: 500,
}

class SuccessResponse extends APIResponse {
  constructor(data) {
    super(APIResponse.STATUS_CODE.SUCCESS, data)
  }
}

class EmptySuccessResponse extends APIResponse {
  constructor() {
    super(APIResponse.STATUS_CODE.NO_CONTENT)
  }
}

class CreatedSuccessResponse extends APIResponse {
  constructor(data) {
    super(APIResponse.STATUS_CODE.CREATED, data)
  }
}

class BaseErrorResponse extends APIResponse {
  constructor(status, message) {
    super(status)
    this.message = message
  }

  send(res) {
    return res.status(this.status).json({ error: this })
  }
}

class BadRequestResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.BAD_REQUEST, message)
  }
}

class UnauthorizedResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.UNAUTHORIZED, message)
  }

  /**
   * HTTP 401's must contain the `WWW-Authenticate` header in the response
   * per the spec: https://tools.ietf.org/html/rfc7235#section-4.1
   */
  send(res) {
    res.set('WWW-Authenticate', 'Bearer realm="Unearth API"')
    super.send(res)
  }
}

class NotFoundResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.NOT_FOUND, message)
  }
}

class TooManyRequestsResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.TOO_MANY_REQUESTS, message)
  }

  /**
   * HTTP 429's should contain the `Retry-After` header in the response, per the
   * spec: https://tools.ietf.org/html/rfc6585#section-4
   * @param {Number} retryAfter Integer denoting how many seconds to wait before
   *                            making a follow-up request.
   */
  send(res, retryAfter) {
    res.set('Retry-After', retryAfter)
    res.set('Access-Control-Expose-Headers', 'Retry-After')
    super.send(res)
  }
}

class InternalErrorResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.INTERNAL_ERROR, message)
  }
}

module.exports = {
  SuccessResponse,
  EmptySuccessResponse,
  CreatedSuccessResponse,

  InternalErrorResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  NotFoundResponse,
  TooManyRequestsResponse,
}
