import { AppRole, Team, User } from '@prisma/client'
import prisma from '../utils/prisma-client'
import { verifyToken } from '../middleware/jwt'
import gqlPost from '../gqlPost'

jest.mock('../middleware/jwt', () => ({
  __esModule: true,
  verifyToken: jest.fn(),
  generateToken: jest.fn(),
}))

const mockUser = { 
  id: 1,
  role: AppRole.admin,
  name: 'John Doe',
  email: 'jdoe@gmail.com',
  team_id: 1 
} as User

const mockTeam = {
  id: 1,
  name: 'A Team',
} as Team

describe('GraphQL API Team Resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query: team', () => {
    it('should return the team by id', async () => {
      const query = `
        query GetTeam($id: Int!){
          team(id: $id) {
            id
            name
          }
        }
      `

      jest.mocked(prisma.team.findUnique).mockResolvedValueOnce(mockTeam)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query, variables: { id: 1 } })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.team).toEqual(mockTeam)
    })
  })

  describe('Query: teams', () => {
    it('should return teams by query', async () => {
      jest.mocked(prisma.team.findMany).mockResolvedValueOnce([
        mockTeam,
        { ...mockTeam, id: 2 },
        { ...mockTeam, id: 3 },
      ])
      const query = `
        query {
          teams {
            id
            name
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.teams).toHaveLength(3)
    })
  })

  describe('Mutation: create_team', () => {
    it('should create a new team', async () => {
      jest.mocked(prisma.team.findUnique).mockResolvedValueOnce(null)
      jest.mocked(prisma.team.create).mockResolvedValueOnce(mockTeam)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation CreateTeam($name: String!) {
          create_team(name: $name) {
            id
            name
          }
        }
      `

      const variables = {
        name: 'Crazy Team',
      }

      const response = await gqlPost({ query: mutation, variables })
      expect(response.statusCode).toBe(200)
      expect(response.body.data.create_team).toMatchObject(mockTeam)
    })

    it('should throw an error if the name already exists', async () => {
      jest.mocked(prisma.team.findFirst).mockResolvedValueOnce({ id: 1, name: 'Crazy Team' } as Team)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation CreateTeam($name: String!) {
          create_team(name: $name) {
            id
            name
          }
        }
      `

      const variables = {
        name: 'Crazy Team',
      }

      const response = await gqlPost({ query: mutation, variables })
      expect(response.body.errors[0].message).toBe('Bad Request: Team Crazy Team already exist')
    })
  })

  describe('Mutation: update_team', () => {
    it(`should update a team's information`, async () => {
      jest.mocked(prisma.team.findUnique).mockResolvedValueOnce({ id: 1, name: 'Team Doe' } as Team)
      jest.mocked(prisma.team.update).mockResolvedValueOnce({ id: 1, name: 'Team Updated' } as Team)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation UpdateTeam($name: String!, $id: Int!) {
          update_team(name: $name, id: $id) {
            id
            name
          }
        }
      `

      const variables = {
        id: 1,
        name: 'Team Updated',
      }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.update_team).toEqual({
        id: 1,
        name: 'Team Updated',
      })
    })
  })

  describe('Mutation: delete_team', () => {
    it('should delete a team', async () => {
      jest.mocked(prisma.team.findUnique).mockResolvedValueOnce({ id: 1 } as Team)
      jest.mocked(prisma.team.delete).mockResolvedValueOnce({ id: 1 } as Team)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation DeleteTeam($id: Int!) {
          delete_team(id: $id) {
            id
          }
        }
      `

      const variables = { id: 1 }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.delete_team).toEqual({ id: 1 })
    })
  })
})
