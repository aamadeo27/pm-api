import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import prisma from '../../utils/prisma-client'
import { AuthorizationError, NotFoundError } from "../../errors/ApolloCustomErrors"
import { TaskCreateInput, TaskQueryInput, TaskUpdateInput } from "./types"
import { AppRole, Task } from "@prisma/client"

const SALT_ROUNDS = 11

export const resolvers: IResolvers<any, Context> = {
  Task: {
    project: (t: Task, ctx: Context) => {
      return prisma.project.findUnique({ where: { id: t.project_id } })
    }
  },
  Query: {
    task: async (_: unknown, { id }: { id: number }, ctx: Context) => {
      const task = await prisma.task.findUnique({ where: { id }, include: { project: true } })

      if (!task) return null

      if (task.project.team_id !== ctx.user!.team_id) {
        throw new AuthorizationError(`This task is defined in a project that belongs to a different team`)
      }

      return task
    },
    tasks: async (_: unknown, args: TaskQueryInput, ctx: Context) => {
      if (args.team_id && ctx.user?.role !== AppRole.admin) {
        throw new AuthorizationError(`Only admins can search tasks by team_id`)
      }

      if (ctx.user?.role !== AppRole.admin) {
        args.team_id = ctx.user?.team_id
      }

      return await prisma.task.findMany({
        where: {
          name: args.name ? { contains: args.name } : undefined,
          description: args.description ? { contains: args.description } : undefined,
          project: {
            team_id: args.team_id,
          },
          assignee_id: args.assignee_id,
          project_id: args.project_id,
        }
      })
      
    }
  },
  Mutation: {
    create_task: async function(_: unknown, { args }: { args: TaskCreateInput }, ctx: Context) {

      const project = await prisma.project.findUnique({ where: { id: args.project_id }})

      if (!project) {
        throw new NotFoundError(`Project ${args.project_id} not found`)
      }

      if (ctx.user!.team_id !== project.team_id) {
        throw new AuthorizationError(`You can't create a task for project ${args.project_id}`)
      }

      const task = await prisma.task.create({
        data: {
          name: args.name,
          description: args.description,
          project_id: args.project_id,
          assignee_id: null,
        }
      })

      return task
    },
    update_task: async function(_: unknown, { args }: { args: TaskUpdateInput }, ctx: Context){
      
      const task = await prisma.task.findUnique({ where: { id: args.id }, include: { project: true } })

      if(!task) {
        throw new NotFoundError(`Task ${args.id} not found`)
      }

      if (task.project.team_id !== ctx.user!.team_id) {
        throw new AuthorizationError(`This task is defined in a project that belongs to a different team`)
      }

      return await prisma.task.update({ 
        where: { id: args.id },
        data: { 
          name: args.name,
          description: args.description,
          assignee_id: args.assignee_id
        } 
      })
    },
    delete_task: async function(_: unknown, args: { id: number }, ctx: Context){
      const task = await prisma.task.findUnique({ where: { id: args.id }, include: { project: true } })

      if(!task) {
        throw new NotFoundError(`Task ${args.id} not found`)
      }

      if (task?.project.team_id !== ctx.user!.team_id) {
        throw new AuthorizationError(`This task is defined in a project that belongs to a different team`)
      }

      return await prisma.task.delete({ where: { id: args.id }})
    },
  }
}