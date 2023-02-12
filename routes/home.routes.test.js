// Appel des modules
const request = require('supertest')
const server = require('../app')

test('GET / - Home test', async () => {
  const response = await request(server).get('/') // Exécution de la requète
  expect(response).toBeDefined() // Attend une réponse définit
  expect(response.statusCode).toBe(200) // Code HTTP 200 attendu
  expect(response.body.message).toBe('Hello World!') // Message attendu
})

test('GET /404 - Error 404', async () => {
  const response = await request(server).get('/404') // Exécution de la requète
  expect(response).toBeDefined() // Attend une réponse définit
  expect(response.statusCode).toBe(404) // Code HTTP 200 attendu
  expect(response.body.message).toBe('page not found') // Message attendu
})
