// Appel des modules
const request = require('supertest')
const server = require('../index')
const message = require('../helpers/messages')
const md = require('../models/users.model.js').User

const url = '/api/v1/users'

/* Supprimer touts les utilisateur */
function deleteAll() {
  // Requête Mongoose - https://mongoosejs.com/docs/api.html#query_Query-deleteMany
  return md
    .deleteMany({})
    .then((result) => result)
    .catch((err) => {
      console.error(err)
    })
}

beforeAll(() => {
  return deleteAll()
})

describe('Route Users', () => {
  const fakeId = '5bf8073813f82b022c2ac957'
  let id
  const user = {
    email: 'titi@toto.com',
    nom: 'toto',
    prenom: 'titi'
  }

  const user2 = {
    email: 'a@b.com',
    nom: 'a',
    prenom: 'b'
  }

  const newUser = {
    email: 'a@toto.com',
    nom: 'a',
    prenom: 'b'
  }

  test('#1 - GET / - Without data return 202', async () => {
    const response = await request(server).get(url) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(202) // Code HTTP 202 attendu
    expect(response.body.message).toBe(message.user.nothing) // Message attendu
  })

  test('#2 - POST / - Empty form return 400', async () => {
    const response = await request(server).post(url) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(400) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.emptyFields) // Message attendu
  })

  test('#3 - POST / - Bad email format', async () => {
    const response = await request(server)
      .post(url)
      .send({
        // Exécution de la requète
        email: 'a@a', // Adresse email erronnée
        nom: user.nom,
        prenom: user.prenom
      })
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(422) // Code HTTP 422 attendu
    expect(response.body.message).toBe(
      'users validation failed: email: invalid email'
    ) // Message attendu
  })

  test('#4 - POST / - Good form', async () => {
    const response = await request(server)
      .post(url)
      .send(user) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(201) // Code HTTP 201 attendu
    expect(response.body.message).toBeDefined() // Attend une réponse définit
    id = response.body.content._id // Récupération de l'id
    expect(response.body.message).toBe(message.user.created(id)) // Message attendu
  })

  test('#5 - POST / - Unique email', async () => {
    const response = await request(server)
      .post(url)
      .send(user) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(409) // Code HTTP 409 attendu
    expect(response.body.message).toBe(message.user.emailExisting) // Message attendu
  })

  test('#6 - GET / - Good', async () => {
    const response = await request(server).get(`${url}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(200) // Code HTTP 200 attendu
    expect(response.body[0].email).toBe(user.email) // Début vérification contenu
    expect(response.body[0].nom).toBe(user.nom)
    expect(response.body[0].prenom).toBe(user.prenom)
    expect(response.body[0].createdAt).toBeDefined()
    expect(response.body[0].updatedAt).toBeDefined()
    expect(response.body.createdAt).toBe(response.body.updatedAt) // Fin vérification contenu
  })

  test('#7 - GET /:id - Good', async () => {
    const response = await request(server).get(`${url}/${id}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(200) // Code HTTP 200 attendu
    expect(response.body.email).toBe(user.email) // Début vérification contenu
    expect(response.body.nom).toBe(user.nom)
    expect(response.body.prenom).toBe(user.prenom)
    expect(response.body.createdAt).toBeDefined()
    expect(response.body.updatedAt).toBeDefined()
    expect(response.body.createdAt).toBe(response.body.updatedAt) // Fin vérification contenu
  })

  test('#8 - PUT /:id - Empty form', async () => {
    const response = await request(server).put(`${url}/${id}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(400) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.emptyFields) // Message attendu
  })

  test('#9 - PUT /:id - Bad id format', async () => {
    const response = await request(server)
      .put(`${url}/aaa`)
      .send(newUser) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(400) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.idNotAnObjectId) // Message attendu
  })

  test('#10 - PUT /:id - 404 id', async () => {
    const response = await request(server)
      .put(`${url}/${fakeId}`)
      .send(newUser) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(404) // Code HTTP 404 attendu
    expect(response.body.message).toBe(message.user.notFound(fakeId)) // Message attendu
  })

  test('#11 - PUT /:id - Bad email format', async () => {
    const response = await request(server)
      .put(`${url}/${id}`)
      .send({
        // Exécution de la requète
        email: 'a@a', // Adresse email erronnée
        nom: newUser.nom,
        prenom: newUser.prenom
      })
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(422) // Code HTTP 422 attendu
    expect(response.body.message).toBe(
      'Validation failed: email: invalid email'
    ) // Message attendu
  })

  test('#12 - PUT /:id - Good form', async () => {
    const response = await request(server)
      .put(`${url}/${id}`)
      .send(newUser) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(200) // Code HTTP 200 attendu
    expect(response.body.content.email).toBe(newUser.email) // Début vérification contenu
    expect(response.body.content.nom).toBe(newUser.nom)
    expect(response.body.content.prenom).toBe(newUser.prenom) // Fin vérification contenu
    expect(response.body.message).toBe(message.user.updated(id)) // Message attendu
  })

  test('#13 - PUT /:id - Unique email', async () => {
    await request(server)
      .post(url)
      .send(user2) // Exécution de la requète (ajout d'un nouvel utilisateur)
    const response = await request(server)
      .put(`${url}/${id}`)
      .send(user2) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(409) // Code HTTP 409 attendu
    expect(response.body.message).toBe(message.user.emailExisting) // Message attendu
  })

  test('#14 - DELETE /:id - Bad id format', async () => {
    const response = await request(server).delete(`${url}/aaa`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(400) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.idNotAnObjectId) // Message attendu
  })

  test('#15 - DELETE /:id - 404 id', async () => {
    const response = await request(server).delete(`${url}/${fakeId}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(404) // Code HTTP 404 attendu
    expect(response.body.message).toBe(message.user.notFound(fakeId)) // Message attendu
  })

  test('#16 - DELETE /:id - Good', async () => {
    const response = await request(server).delete(`${url}/${id}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(200) // Code HTTP 200 attendu
    expect(response.body.message).toBe(message.user.deleted(id)) // Message attendu
  })

  test('#17 - GET /:id - Bad id format', async () => {
    const response = await request(server).get(`${url}/aaa`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(400) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.idNotAnObjectId) // Message attendu
  })

  test('#18 - GET /:id - 404 id', async () => {
    const response = await request(server).get(`${url}/${id}`) // Exécution de la requète
    expect(response).toBeDefined() // Attend une réponse définit
    expect(response.statusCode).toBe(404) // Code HTTP 400 attendu
    expect(response.body.message).toBe(message.user.notFound(id)) // Message attendu
  })
})
