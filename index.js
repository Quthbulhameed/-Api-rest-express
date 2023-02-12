// Appel des modules
const app = require('./app')

// Variables d'environnement
const host = process.env.API_HOST || '0.0.0.0'
const port = process.env.API_PORT || 3000

// Démarrage du serveur
app.listen(port, host, () => {
  console.log(
    `Running on http://${host}:${port} - Environnement : ${process.env.NODE_ENV}`
  )
})

module.exports = app
