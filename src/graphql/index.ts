import { gql } from 'graphql-tag'
import { generateToken } from "../utils/jwt"
import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'
import { IResolvers} from '@graphql-tools/utils'

import { typeDefs as userTypes, resolvers as userResolvers } from './users'

export interface Context {
  csrfToken?: string;
  user?: { id: string, email: string }
}

export const resolvers = mergeResolvers([userResolvers])
export const typeDefs = mergeTypeDefs([userTypes])