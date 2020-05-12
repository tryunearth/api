const {
  InternalErrorResponse,
  BadRequestResponse,
  UnauthorizedResponse,
  NotFoundResponse,
  TooManyRequestsResponse,
} = require('./api-response')

class APIError extends Error {
  /**
   * TODO
   * @param {*} type
   * @param {*} message
   */
  constructor(type, message) {
    super(message)
    this.type = type
  }

  static handle(error, res) {
    switch (error.type) {
      case APIError.ERROR_TYPE.BAD_REQUEST:
        return new BadRequestResponse(error.message).send(res)
      case APIError.ERROR_TYPE.UNAUTHORIZED:
        return new UnauthorizedResponse(error.message).send(res)
      case APIError.ERROR_TYPE.NOT_FOUND:
        return new NotFoundResponse(error.message).send(res)
      case APIError.ERROR_TYPE.TOO_MANY_REQUESTS:
        return new TooManyRequestsResponse(error.message).send(
          res,
          error.retryAfter,
        )
      case APIError.ERROR_TYPE.INTERNAL:
      default:
        let { message } = error
        if (process.env.NODE_ENV === 'production' || !message) {
          message = 'An internal server error occurred, please try again later.'
        }
        return new InternalErrorResponse(message).send(res)
    }
  }
}

APIError.ERROR_TYPE = {
  BAD_REQUEST: 'BadRequestError',
  UNAUTHORIZED: 'UnauthorizedError',
  NOT_FOUND: 'NotFoundError',
  TOO_MANY_REQUESTS: 'TooManyRequestsError',

  INTERNAL: 'InternalError',
}

class BadRequestError extends APIError {
  constructor(message = 'Bad request—check data fields and try again') {
    super(APIError.ERROR_TYPE.BAD_REQUEST, message)
  }
}

class UnauthorizedError extends APIError {
  constructor(message = 'Unauthorized request') {
    super(APIError.ERROR_TYPE.UNAUTHORIZED, message)
  }
}

class NotFoundError extends APIError {
  constructor(message = 'No resource found for the given attribute') {
    super(APIError.ERROR_TYPE.NOT_FOUND, message)
  }
}

class TooManyRequestsError extends APIError {
  constructor(message = 'Too many attempts, retry later', retryAfter) {
    super(APIError.ERROR_TYPE.TOO_MANY_REQUESTS, message)
    this.retryAfter = retryAfter
  }
}

class InternalError extends APIError {
  constructor(message = '') {
    super(APIError.ERROR_TYPE.INTERNAL, message)
  }
}

module.exports = {
  APIError,
  InternalError,
  BadRequestError,
  UnauthorizedError,
  NotFoundError,
  TooManyRequestsError,
}
