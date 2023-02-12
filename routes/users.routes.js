// Appel des modules
const express = require('express')
const router = express.Router()
const User = require('../controllers/users.ctrl')
const m = require('../helpers/middlewares')

/* Ajouter un utilisateur - POST - /api/v1/users */
router.post('/', m.checkContent, User.saveOne)

/* Liste des utilisateurs - GET - /api/v1/users */
router.get('/', User.findAll)

/* Utilisateur via son ID - GET - /api/v1/users/:id */
router.get('/:id', m.checkId, User.findById)

/* Modifier un utilisateur via son ID - PUT - /api/v1/users/:id */
router.put('/:id', m.checkId, m.checkContent, User.updateById)

/* Supprimer un utilisateur via son ID - DELETE - /api/v1/users/:id */
router.delete('/:id', m.checkId, User.deleteById)

module.exports = router
