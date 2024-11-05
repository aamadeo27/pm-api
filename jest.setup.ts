import { startServer, apolloServer } from './src/apollo-server'
import supertest from 'supertest'

const PORT = 4001
let app
let server
global.request = null
beforeAll(async () => {
  app = await startServer()

  server = app.listen(PORT, () => {
    console.log(`Test Server is running in port ${PORT}`)
  })
  
  jest.setTimeout(3000); // Set a global timeout of 10 seconds for Jest

  global.request = supertest(app)
})

afterAll(async () => {
    apolloServer.stop()
    server.close()
});