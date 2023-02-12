// Appel des modules
const express = require('express')
const morgan = require('morgan')
const db = require('./config/db.config')
db.connect()

// Initialisation d'Express
const app = express()

// Activation du log des routes
app.use(morgan('combined'))
app.use(express.json())
app.use(express.urlencoded({ extended: true }))
app.use(require('./routes/index.routes'))

module.exports = app
