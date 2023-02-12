// Appel des modules
const express = require('express')
const router = express.Router()

// Endpoint des utilisateurs
router.use('/api/v1/users', require('./users.routes'))

// Route d'accueil
router.get('/', (req, res) => {
  res.json({ message: 'Hello World!' })
})

// Routes non définies = 404
router.all('/*', (req, res) => {
  res.status(404).json({ message: 'page not found' })
})

module.exports = router
