import { mergeTypeDefs, mergeResolvers } from '@graphql-tools/merge'


import { typeDefs as userTypes, resolvers as userResolvers } from './users'
import { typeDefs as teamTypes, resolvers as teamResolvers } from './teams'
import { typeDefs as projectTypes, resolvers as projectResolvers } from './projects'
import { typeDefs as taskTypes, resolvers as taskResolvers } from './tasks'
import { typeDefs as scalarTypes, resolvers as scalarResolvers } from './scalars'
import { AppRole } from '@prisma/client'

export interface Context {
  user?: { id: number, email: string, role: AppRole, team_id: number }
}

export const resolvers = mergeResolvers([scalarResolvers, userResolvers, teamResolvers, projectResolvers, taskResolvers])
export const typeDefs = mergeTypeDefs([scalarTypes, userTypes, teamTypes, projectTypes, taskTypes])