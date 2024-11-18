import { gql } from 'graphql-tag'
import { generateToken } from "../middleware/jwt"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { IResolvers} from '@graphql-tools/utils'

import { typeDefs as userTypes, resolvers as userResolvers } from './users'
import { AppRole } from '@prisma/client'

export interface Context {
  user?: { id: string, email: string, role: AppRole }
}

export const resolvers = mergeResolvers([userResolvers])
export const typeDefs = mergeTypeDefs([userTypes])