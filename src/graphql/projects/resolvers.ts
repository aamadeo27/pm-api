import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import prisma from '../../utils/prisma-client'
import { ProjectQueryInput, ProjectUpdateInput } from "./types"
import { AuthorizationError, NotFoundError } from "../../errors/ApolloCustomErrors"

const SALT_ROUNDS = 11

export const resolvers: IResolvers<any, Context> = {
  Query: {
    project: (_: unknown, { id }: { id: number }, ctx: Context) => {
      return prisma.project.findUnique({ where: { id } })
    },
    projects: async (_: unknown, args: ProjectQueryInput, ctx: Context) => {
      let where: any = args

      if (where.name !== undefined) {
        where = { name: { contains: where.name } }
      }

      console.log({ where })

      return await prisma.project.findMany({ where })
    }
  },
  Mutation: {
    create_project: async function(parent: unknown, { name }: { name: string }, ctx: Context) {
      return await prisma.project.create({
        data: {
          name,
          team_id: ctx.user!.team_id,
        }
      })
    },
    update_project: async function(_: unknown, args: ProjectUpdateInput, ctx: Context){
      
      const project = await prisma.project.findUnique({ where: { id: args.id } })

      if(!project) {
        throw new NotFoundError(`Project ${args.id} not found`)
      }

      if (project?.team_id !== ctx.user!.team_id) {
        throw new AuthorizationError(`This project belongs to a different team`)
      }

      return await prisma.project.update({ where: { id: args.id }, data: { name: args.name } })
    },
    delete_project: async function(_: unknown, args: { id: number }, ctx: Context){
      const project = await prisma.project.findUnique({ where: { id: args.id } })

      if(!project) {
        throw new NotFoundError(`Project ${args.id} not found`)
      }

      if (project?.team_id !== ctx.user!.team_id) {
        throw new AuthorizationError(`This project belongs to a different team`)
      }

      return await prisma.project.delete({ where: { id: args.id }})
    },
  }
}