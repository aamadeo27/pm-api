import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'


import { typeDefs as userTypes, resolvers as userResolvers } from './users'
import { typeDefs as teamTypes } from './teams'
import { typeDefs as projectTypes } from './projects'
import { typeDefs as taskTypes } from './tasks'
import { typeDefs as scalarTypes, resolvers as scalarResolvers } from './scalars'
import { AppRole } from '@prisma/client'

export interface Context {
  user?: { id: string, email: string, role: AppRole }
}

export const resolvers = mergeResolvers([scalarResolvers, userResolvers])
export const typeDefs = mergeTypeDefs([scalarTypes, userTypes, teamTypes, projectTypes, taskTypes])