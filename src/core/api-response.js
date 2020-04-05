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

class NotFoundResponse extends BaseErrorResponse {
  constructor(message) {
    super(APIResponse.STATUS_CODE.NOT_FOUND, message)
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
  NotFoundResponse,
}
