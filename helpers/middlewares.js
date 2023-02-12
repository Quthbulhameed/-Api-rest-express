// Appel des modules
const mongoose = require('mongoose')
const message = require('../helpers/messages')

/* Vérification format de l'object id */
function checkId(req, res, next) {
  const id = req.params.id

  if (!mongoose.Types.ObjectId.isValid(id)) {
    res.status(400).json({ message: message.idNotAnObjectId })
  } else {
    next()
  }
}

/* Vérification présence de contenu */
function checkContent(req, res, next) {
  const content = req.body

  if (Object.keys(content).length === 0) {
    res.status(400).json({ message: message.emptyFields })
  } else {
    next()
  }
}

module.exports = {
  checkId,
  checkContent
}
