import { AppRole, Project, User } from '@prisma/client'
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
  role: AppRole.project_manager,
  name: 'John Doe',
  avatar_url: null,
  email: 'jdoe@gmail.com',
  team_id: 1,
  project_id: 1,
  password: '',
  active: true,
  created_at: new Date(),
} as User

const mockProject = {
  id: 1,
  name: 'A Project',
  team_id: 1,
} as Project

describe('GraphQL API Project Resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query: project', () => {
    it('should return the project by id', async () => {
      const query = `
        query GetProject($id: Int!){
          project(id: $id) {
            id
            name
            team_id
          }
        }
      `

      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce(mockProject)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query, variables: { id: 1 } })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.project).toEqual(mockProject)
    })
  })

  describe('Query: projects', () => {
    it('should return projects by query', async () => {
      jest.mocked(prisma.project.findMany).mockResolvedValueOnce([
        mockProject,
        { ...mockProject, id: 2 },
        { ...mockProject, id: 3 },
      ])
      const query = `
        query {
          projects {
            id
            name
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.projects).toHaveLength(3)
    })
  })

  describe('Mutation: create_project', () => {
    it('should create a new project', async () => {
      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce(null)
      jest.mocked(prisma.project.create).mockResolvedValueOnce(mockProject)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation CreateProject($name: String!) {
          create_project(name: $name) {
            id
            name
            team_id
          }
        }
      `

      const variables = {
        name: 'Crazy Project',
      }

      const response = await gqlPost({ query: mutation, variables })
      expect(response.statusCode).toBe(200)
      expect(response.body.data.create_project).toMatchObject(mockProject)
    })

    it('should throw an error if the email already exists', async () => {
      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce(mockProject)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation CreateProject($name: String!) {
          create_project(name: $name) {
            id
            name
            team_id
          }
        }
      `

      const variables = {
        name: 'Cloned Sheep',
      }

      const response = await gqlPost({ query: mutation, variables })
      expect(response.body.errors[0].message).toBe('Bad Request: Project Cloned Sheep already exist.')
    })
  })

  describe('Mutation: update_project', () => {
    it(`should update a project's information`, async () => {
      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce({ id: 1, name: 'Project X', team_id: 1 } as Project)
      jest.mocked(prisma.project.update).mockResolvedValueOnce({ id: 1, name: 'Project Updated' } as Project)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation UpdateProject($args: ProjectUpdateInput!) {
          update_project(args: $args) {
            id
            name
            thumbnail
          }
        }
      `

      const variables = {
        args: {
          id: 1,
          name: 'Project Updated',
        }
      }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.update_project).toEqual({
        id: 1,
        name: 'Project Updated',
        thumbnail: null
      })
    })
  })

  describe('Mutation: delete_project', () => {
    it('should delete a project', async () => {
      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce({ id: 1, team_id: 1 } as Project)
      jest.mocked(prisma.project.delete).mockResolvedValueOnce({ id: 1 } as Project)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation DeleteProject($id: Int!) {
          delete_project(id: $id) {
            id
          }
        }
      `

      const variables = { id: 1 }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.delete_project).toEqual({ id: 1 })
    })
  })
})
