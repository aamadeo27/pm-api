import { gql } from 'graphql-tag'
import { generateToken } from "../utils/jwt"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { IResolvers} from '@graphql-tools/utils'

type AuthRequest = {
  email: string
  password: string
}

export interface Context {
  csrfToken?: string;
  user?: { id: string, email: string }
}

const baseTypeDefs = gql`
  type User {
    id: String!
    email: String!
  }

  type AuthResponse {
    token: String!
    user: User
  }

  type Query {
    hello: String!
  }

  type Mutation {
    login(email: String!, password: String!): AuthResponse
  }
`

const baseResolver: IResolvers<any, Context> = {
  Query: {
    hello: () => 'Hello World'
  },
  Mutation: {
    login: async function(parent: unknown, args: AuthRequest, context: Context){
      // const user = await prisma.users.find((u) => u.email === args.email)
      // if (!user) throw new Error('User not found')
      // if(passwordInvalid(u, args.password)) throw new Error('Invalid Password')

      const token = generateToken({ id: 'aa', email: 'aa@aa.com' })

      return { token, user: { id: 'aa', email: 'aa@aa.com' } }
    }
  }
}

export const resolvers = mergeResolvers([baseResolver])
export const typeDefs = mergeTypeDefs([baseTypeDefs])