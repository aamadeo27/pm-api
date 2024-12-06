import supertest from 'supertest'
import { apolloServer, startServer } from './server'
import { Server } from 'http'
import TestAgent from 'supertest/lib/agent'

let request: TestAgent

let app
let server: Server

beforeAll(async () => {
  app = await startServer()

  server = app.listen(0)
  
  jest.setTimeout(3000); // Set a timeout of 10 seconds for Jest

  request = supertest(app)
})

afterAll(async () => {
    apolloServer.stop()
    server.close()
})

export default function gqlPost(data: { query: string, variables?: any }) {
  return request.post('/graphql').send(data).set('Authorization', 'Bearer mockToken')
}