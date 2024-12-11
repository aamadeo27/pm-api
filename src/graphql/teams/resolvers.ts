import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import prisma from '../../utils/prisma-client'
import { AuthorizationError, InvalidInputError, NotFoundError } from "../../errors/ApolloCustomErrors"
import { TeamUpdateInput } from "./types"
import { AppRole, Team } from "@prisma/client"

export const resolvers: IResolvers<any, Context> = {
  Team: {
    members: async (team: Team) => {
      return prisma.team.findUnique({ where: { id: team.id }}).members()
    },
    projects: async (team: Team) => {
      return prisma.team.findUnique({ where: { id: team.id }}).projects()
    },
  },
  Query: {
    team: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      const team = await prisma.team.findUnique({ where: { id } })

      return team
    },
    teams: async (_: unknown, { name }: { name: string }) => {
      return await prisma.team.findMany({ where: { name: { contains: name }}})
    }
  },
  Mutation: {
    create_team: async function(parent: unknown, { name }: { name: string }, ctx: Context) {
      const team = await prisma.team.findFirst({ where: { name } })

      if (team) {
        throw new InvalidInputError(`Team ${name} already exist`)
      }

      return await prisma.team.create({
        data: {
          name,
        }
      })
    },
    update_team: async function(_: unknown, { args }: { args: TeamUpdateInput }, ctx: Context){
      
      if ( ctx.user!.role === AppRole.project_manager && args.id !== ctx.user?.team_id ) {
        throw new AuthorizationError(`Only admins and the team manager can update this team`)
      }

      const team = await prisma.team.findUnique({ where: { id: args.id } })

      if (!team) {
        throw new NotFoundError(`Team ${args.id} not found`)
      }

      const { id, ...data } = args

      return await prisma.team.update({ where: { id }, data })
    },
    delete_team: async function(_: unknown, args: { id: number }, ctx: Context){
      const team = await prisma.team.findUnique({ where: { id: args.id } })

      if (!team) {
        throw new NotFoundError(`Team ${args.id} not found`)
      }

      return await prisma.team.delete({ where: { id: args.id }})
    },
  }
}