const express = require('express')
const baseRouter = require('./routes')

const app = express()

app.use(express.json())
app.use('/api/v1', baseRouter)

module.exports = app