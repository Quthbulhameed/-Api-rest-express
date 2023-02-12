// Appel des modules
const mongoose = require('mongoose')

// Chargement des variables d'environnement
const host = process.env.MONGO_HOST || '0.0.0.0'
const port = process.env.MONGO_PORT || 27017
const username = process.env.MONGO_INITDB_ROOT_USERNAME
const password = process.env.MONGO_INITDB_ROOT_PASSWORD
const database = process.env.MONGO_INITDB_DATABASE

const connect = () => {
  mongoose.connect(
    `mongodb://${username}:${password}@${host}:${port}/${database}?authSource=admin`,
    {
      useNewUrlParser: true,
      useFindAndModify: false,
      useCreateIndex: true,
      useUnifiedTopology: true
    },
    function(err) {
      if (err) {
        throw err
      }
    }
  )
}

module.exports = {
  connect
}
