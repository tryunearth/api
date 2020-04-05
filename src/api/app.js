require('dotenv').config()
const express = require('express')
const baseRouter = require('./routes')
const { APIError, InternalError } = require('../core/api-error')

const app = express()

app.use(express.json())
app.use('/v1', baseRouter)

app.use((err, req, res, next) => {
  if (err instanceof APIError) {
    // known errors/exceptions that could be raised during the execution of any
    // API request handling
    APIError.handle(err, res)
  } else {
    // unknown/unexpected errors that may occur, e.g. malformed knex queries
    APIError.handle(new InternalError(), res)
  }
})

module.exports = app
