/**
 * Helper function that removes the need to use `try…catch` blocks in
 * controllers and other Express middleware.
 * @param {AsyncFunction} execution Express-like middleware function that should
 *    return a Promise. Any exceptions thrown will be caught here and passed to
 *    the catch-all error handler.
 */
const asyncHandler = execution => (req, res, next) => {
  execution(req, res, next).catch(error => next(error.toString()))
}

module.exports = asyncHandler
