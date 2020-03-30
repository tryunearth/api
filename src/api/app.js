require('dotenv').config()
const express = require('express')
const baseRouter = require('./routes')

const app = express()

app.use(express.json())
app.use('/v1', baseRouter)

module.exports = app
