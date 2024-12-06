import { AppRole, Project, Task, User } from '@prisma/client'
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
  email: 'jdoe@gmail.com',
  team_id: 1,
  task_id: 1,
  password: '',
  active: true,
  created_at: new Date(),
} as User

const mockTask = {
  id: 1,
  name: 'A Task',
  project_id: 1,
} as Task

describe('GraphQL API Task Resolver', () => {
  beforeEach(() => {
    jest.clearAllMocks()
  })

  describe('Query: task', () => {
    it('should return the task by id', async () => {
      const query = `
        query GetTask($id: Int!){
          task(id: $id) {
            id
            name
            project_id
          }
        }
      `

      jest.mocked(prisma.task.findUnique).mockResolvedValueOnce({ 
        ...mockTask,
        project: {
          id: 1,
          name: 'Project',
          team_id: 1,
        }
      } as Task & { project: Project })

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query, variables: { id: 1 } })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.task).toEqual(mockTask)
    })
  })

  describe('Query: tasks', () => {
    it('should return tasks by query', async () => {
      jest.mocked(prisma.task.findMany).mockResolvedValueOnce([
        mockTask,
        { ...mockTask, id: 2 },
        { ...mockTask, id: 3 },
      ])
      const query = `
        query {
          tasks {
            id
            name
          }
        }
      `

      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const response = await gqlPost({ query })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.tasks).toHaveLength(3)
    })
  })

  describe('Mutation: create_task', () => {
    it('should create a new task', async () => {
      jest.mocked(prisma.task.findUnique).mockResolvedValueOnce(null)
      jest.mocked(prisma.task.create).mockResolvedValueOnce(mockTask)
      jest.mocked(prisma.project.findUnique).mockResolvedValueOnce({ id: 1, team_id: 1, name: 'Project'} as Project)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation CreateTask($args: TaskCreateInput!) {
          create_task(args: $args) {
            id
            name
            project_id
          }
        }
      `

      const variables = {
        args: {
          name: 'Crazy Task',
          description: 'Long description',
          project_id: 1,
        }
      }

      const response = await gqlPost({ query: mutation, variables })
      expect(response.statusCode).toBe(200)
      expect(response.body.data.create_task).toMatchObject(mockTask)
    })
  })

  describe('Mutation: update_task', () => {
    it(`should update a task's information`, async () => {
      jest.mocked(prisma.task.findUnique).mockResolvedValueOnce({ 
        ...mockTask,
        project: {
          id: 1,
          name: 'Project',
          team_id: 1,
        }
      } as Task & { project: Project })
      jest.mocked(prisma.task.update).mockResolvedValueOnce({ id: 1, name: 'Task Updated', project_id: 1 } as Task)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation UpdateTask($args: TaskUpdateInput!) {
          update_task(args: $args) {
            id
            name
            project_id
          }
        }
      `

      const variables = {
        args: {
          id: 1,
          name: 'Task Updated',
        }
      }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.update_task).toEqual({
        id: 1,
        name: 'Task Updated',
        project_id: 1,
      })
    })
  })

  describe('Mutation: delete_task', () => {
    it('should delete a task', async () => {
      jest.mocked(prisma.task.findUnique).mockResolvedValueOnce({ 
        ...mockTask,
        project: {
          id: 1,
          name: 'Project',
          team_id: 1,
        }
      } as Task & { project: Project })
      jest.mocked(prisma.task.delete).mockResolvedValueOnce({ id: 1 } as Task)
      jest.mocked(verifyToken).mockReturnValueOnce(mockUser)

      const mutation = `
        mutation DeleteTask($id: Int!) {
          delete_task(id: $id) {
            id
          }
        }
      `

      const variables = { id: 1 }

      const response = await gqlPost({ query: mutation, variables })

      expect(response.statusCode).toBe(200)
      expect(response.body.data.delete_task).toEqual({ id: 1 })
    })
  })
})
