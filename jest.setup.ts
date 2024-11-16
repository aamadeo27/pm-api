import { startServer, apolloServer } from './src/server'
import supertest from 'supertest'

const PORT = process.env.PORT
let app
let server
global.request = null
beforeAll(async () => {
  app = await startServer()

  server = app.listen(0)
  
  jest.setTimeout(3000); // Set a global timeout of 10 seconds for Jest

  global.request = supertest(app)
})

afterAll(async () => {
    apolloServer.stop()
    server.close()
});