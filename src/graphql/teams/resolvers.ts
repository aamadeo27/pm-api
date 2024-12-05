import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import prisma from '../../utils/prisma-client'
import { NotFoundError } from "../../errors/ApolloCustomErrors"

export const resolvers: IResolvers<any, Context> = {
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
      return await prisma.team.create({
        data: {
          name,
        }
      })
    },
    update_team: async function(_: unknown, args: { id: number, name: string }, ctx: Context){
      
      const team = await prisma.team.findUnique({ where: { id: args.id } })

      if (!team) {
        throw new NotFoundError(`Team ${args.id} not found`)
      }

      return await prisma.team.update({ where: { id: args.id }, data: { name: args.name } })
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