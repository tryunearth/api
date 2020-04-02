require('dotenv').config()
const express = require('express')
const baseRouter = require('./routes')

const app = express()

app.use(express.json())
app.use('/v1', baseRouter)

app.use((err, req, res, next) => {
  console.error(err)
  const error = { status: 500, message: err }
  res.status(500).json({ error })
})

module.exports = app
