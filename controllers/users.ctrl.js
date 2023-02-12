// Chargement des dépendances
const User = require('../models/users.model.js').User
const message = require('../helpers/messages')

/* Ajouter un utilisateur */
function saveOne(req, res) {
  // Stockage des données dans le constructeur
  const newUser = new User(req.body)

  // Requête Mongoose - https://mongoosejs.com/docs/api.html#document_Document-save
  return newUser
    .save()
    .then((result) => {
      res
        .status(201)
        .json({ message: message.user.created(result._id), content: result })
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).json({ message: message.user.emailExisting })
      } else if (
        err.errors &&
        Object.keys(err.errors).length > 0 &&
        err.name === 'ValidationError'
      ) {
        res.status(422).json({ message: err.message })
      } else {
        res.status(500).json(err)
      }
    })
}

/* Tous les utilisateurs */
function findAll(req, res) {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#model_Model.find
  return User.find()
    .exec()
    .then((result) => {
      if (result.length > 0) {
        res.json(result)
      } else {
        res.status(202).json({ message: message.user.nothing })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}

/* Un utilisateur via son _id */
function findById(req, res) {
  // Récupération de l'id
  const id = req.params.id

  // Requête Mongoose - https://mongoosejs.com/docs/api.html#model_Model.findById
  return User.findById(id)
    .exec()
    .then((result) => {
      if (result) {
        res.json(result)
      } else {
        res.status(404).json({ message: message.user.notFound(id) })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}

/* Modifier utilisateur via son id */
function updateById(req, res) {
  // Récupération de l'id
  const id = req.params.id

  // Requête Mongoose - https://mongoosejs.com/docs/api.html#model_Model.findByIdAndUpdate
  return User.findByIdAndUpdate(id, req.body, {
    new: true,
    runValidators: true
  })
    .then((result) => {
      if (result) {
        // Présence d'un objet de données
        res.json({ message: message.user.updated(id), content: result })
      } else {
        // Ligne non existante
        res.status(404).json({ message: message.user.notFound(id) })
      }
    })
    .catch((err) => {
      if (err.code === 11000) {
        res.status(409).json({ message: message.user.emailExisting  })
      } else if (
        err.errors &&
        Object.keys(err.errors).length > 0 &&
        err.name === 'ValidationError'
      ) {
        res.status(422).json({ message: err.message })
      } else {
        res.status(500).json(err)
      }
    })
}

/* Supprimer un utilisateur */
function deleteById(req, res) {
  // Récupération de l'id
  const id = req.params.id

  // Requête Mongoose - https://mongoosejs.com/docs/api.html#model_Model.findByIdAndRemove
  return User.findByIdAndRemove({ _id: id })
    .then((result) => {
      if (result) {
        // Présence d'un objet de données
        res.json({ message: message.user.deleted(id)  })
      } else {
        // Ligne non existante
        res.status(404).json({ message: message.user.notFound(id) })
      }
    })
    .catch((err) => {
      res.status(500).json(err)
    })
}

module.exports = {
  saveOne,
  findAll,
  findById,
  updateById,
  deleteById
}
