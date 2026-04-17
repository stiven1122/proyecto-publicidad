const express = require('express')
const app = express()

const clienteRoutes = require('./routes/clienteRoutes')

app.use(express.json())

app.use('/api', clienteRoutes)

module.exports = app