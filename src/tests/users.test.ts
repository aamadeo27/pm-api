import { AppRole, User } from '@prisma/client'
import prisma from '../utils/prisma-client'
import { verifyToken } from '../middleware/jwt'
import mockServer from '../gqlPost'
import gqlPost from '../gqlPost'

jest.mock('../middleware/jwt', () => ({
  __esModule: true,
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
}))

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

      const response = await gqlPost({ query })

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

      const response = await gqlPost({ query })
      expect(response.body.errors[0].message).toBe(`Authorization Failed: Unauthorized access`)
    })
  })

  describe('Query: user', () => {
    it('should return user by id', async () => {
      jest.mocked(prisma.user.findUnique).mockResolvedValueOnce(mockUser)
      const query = `
        query GetUser($id: Int!){
          user(id: $id) {
            id
            name
            email
            team_id
            role
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query, variables: { id: 1 } })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.user).toEqual(mockUser)
    })
  })

  describe('Query: users', () => {
    it('should return users by query', async () => {
      jest.mocked(prisma.user.findMany).mockResolvedValueOnce([
        mockUser,
        { ...mockUser, id: 2 },
        { ...mockUser, id: 3 },
      ])
      const query = `
        query {
          users {
            id
            name
            email
            team_id
            role
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.users).toHaveLength(3)
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

      const response = await gqlPost({ query: mutation, variables })
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

      const response = await gqlPost({ query: mutation, variables })
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

      const response = await gqlPost({ query: mutation, variables })

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

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.delete_user).toEqual({ id: 1 })
    })
  })
})
