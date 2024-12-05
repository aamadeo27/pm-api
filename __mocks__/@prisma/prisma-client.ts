
const prisma_client = jest.requireActual('@prisma/client')

function modelMock() {
  return {
    findUnique: jest.fn(),
    findMany: jest.fn(),
    create: jest.fn(),
    update: jest.fn(),
    delete: jest.fn()
  }
}

const userModelMock = modelMock()

const mockPrismaClient = {
  user: modelMock(),
}

jest.mock('@prisma/client', () => ({
  ...prisma_client,
  PrismaClient: jest.fn().mockImplementation(() => mockPrismaClient)
}))