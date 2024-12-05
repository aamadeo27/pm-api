import { AppRole, User } from '@prisma/client'
import prisma from '../utils/prisma-client'
import gql from 'graphql-tag'
import { verifyToken } from '../middleware/jwt'
import supertest from 'supertest'
import { apolloServer, startServer } from '../server'
import { Server } from 'http'
import TestAgent from 'supertest/lib/agent'

jest.mock('../middleware/jwt', () => ({
  __esModule: true,
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
}))

const PORT = process.env.PORT
let app
let server: Server
let request: TestAgent
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

jest.mock('bcrypt', () => ({
  hash: jest.fn(),
}))

const mockUser = { 
  id: 1,
  role: AppRole.admin,
  name: 'John Doe',
  email: 'jdoe@gmail.com',
  team_id: 1 
} as User

// describe('Users resolvers', () => {
//   let team: Team
//   beforeAll(async () => {
//     jest.clearAllMocks()
//   })


//   it('create_user', async () => {
//     await jest.mocked(prisma.user.deleteMany({ where: { email: 'aamadeo-test@gmail.com'}})

//     const query = gql`
//     mutation CreateUser($args: UserCreateInput!) {
//       create_user(args: $args)
//     }`  

//     const response = await request.post('/graphql').send({
//       query: query.loc?.source.body,
//       variables: {
//         args: {
//           name: 'albert',
//           email: 'aamadeo-test@gmail.com',
//           password: 'thisismyrealpassword',
//           team_id: team.id
//         },
//       }
//     })

//     expect(response.body.data.create_user).toBe(true)
//   })

//   it(`doesn't allow to create a user if email already exists`, async () => {
//     await jest.mocked(prisma.user.upsert({
//       create: {
//         email: 'aamadeo-test-2@gmail.com',
//         name: 'albert',
//         password: '',
//         team_id: team.id
//       },
//       where: { email: 'aamadeo-test-2@gmail.com'},
//       update: {},
//     })

//     const query = gql`
//     mutation CreateUser($args: UserCreateInput!) {
//       create_user(args: $args)
//     }`

//     const response = await request.post('/graphql').send({
//       query: query.loc?.source.body,
//       variables: {
//         args: {
//           name: 'albert',
//           email: 'aamadeo-test-2@gmail.com',
//           password: 'thisismyrealpassword',
//           team_id: team.id,
//         }
//       }
//     })

//     expect(response.body.errors?.[0]).toMatchObject({
//        message: 'Bad Request: Email already exist',
//        code: 'INVALID_INPUT_ERROR',
//     })
//   })
// })


describe('GraphQL API User Resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query: current_user', () => {
    it('should return the current user if authenticated', async () => {
      const query = `
        query {
          current_user {
            id
            name
            email
            team_id
            role
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await request
        .post('/graphql')
        .send({ query })
        .set('Authorization', 'Bearer mockToken')

      expect(response.statusCode).toBe(200)
      expect(response.body.data.current_user).toEqual(mockUser)
    })

    it('should throw an AuthenticationError if not authenticated', async () => {
      const query = `
        query {
          current_user {
            id
            name
          }
        }
      `

      const response = await request.post('/graphql').send({ query })
      expect(response.body.errors[0].message).toBe(`Authorization Failed: Unauthorized access`)
    })
  })

  describe('Mutation: create_user', () => {
    it('should create a new user', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValueOnce(null)
      jest.mocked(prisma.user.create).mockResolvedValueOnce(mockUser)

      const mutation = `
        mutation CreateUser($args: UserCreateInput!) {
          create_user(args: $args)
        }
      `

      const variables = {
        args: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          team_id: 2,
        },
      }

      const response = await request.post('/graphql').send({ query: mutation, variables })
      expect(response.statusCode).toBe(200)
      expect(response.body.data.create_user).toBe(true)
    })

    it('should throw an error if the email already exists', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 1, email: 'jane@example.com' } as User)

      const mutation = `
        mutation CreateUser($args: UserCreateInput!) {
          create_user(args: $args)
        }
      `

      const variables = {
        args: {
          name: 'Jane Doe',
          email: 'jane@example.com',
          password: 'password123',
          team_id: 2,
        },
      }

      const response = await request.post('/graphql').send({ query: mutation, variables })
      expect(response.body.errors[0].message).toBe('Bad Request: Email already exist')
    })
  })

  describe('Mutation: update_user', () => {
    it(`should update a user's information`, async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 1, name: 'John Doe' } as User)
      jest.mocked(prisma.user.update).mockResolvedValueOnce({ id: 1, name: 'John Updated' } as User)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation UpdateUser($args: UserUpdateInput!) {
          update_user(args: $args) {
            id
            name
          }
        }
      `

      const variables = {
        args: {
          id: 1,
          name: 'John Updated',
        },
      }

      const response = await request
        .post('/graphql')
        .send({ query: mutation, variables })
        .set('Authorization', 'Bearer mockToken')

      expect(response.statusCode).toBe(200)
      expect(response.body.data.update_user).toEqual({
        id: 1,
        name: 'John Updated',
      })
    })
  })

  describe('Mutation: delete_user', () => {
    it('should delete a user', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValueOnce({ id: 1 } as User)
      jest.mocked(prisma.user.delete).mockResolvedValueOnce({ id: 1 } as User)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation DeleteUser($id: Int!) {
          delete_user(id: $id) {
            id
          }
        }
      `

      const variables = { id: 1 }

      const response = await request
        .post('/graphql')
        .send({ query: mutation, variables })
        .set('Authorization', 'Bearer mockToken')

      expect(response.statusCode).toBe(200)
      expect(response.body.data.delete_user).toEqual({ id: 1 })
    })
  })
})
