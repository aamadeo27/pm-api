import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import { UserCreationInput, UsersQueryInput, UserUpdateInput } from "./types"
import prisma from '../../utils/prisma-client'
import { hash } from 'bcrypt'
import { InvalidInputError, AuthenticationError, AuthorizationError } from "../../errors/ApolloCustomErrors"
import { AppRole } from "@prisma/client"

const SALT_ROUNDS = 11

export const resolvers: IResolvers<any, Context> = {
  Query: {
    current_user: (_: unknown, __: unknown, { user }: Context) => {
      if (!user) {
        throw new AuthenticationError(`You're not an authenticated user`)
      }

      return user
    },
    user: (_: unknown, { id }:{ id: number }) => {
      return prisma.user.findUnique({ where: { id }})
    },
    users: (_: unknown, args: UsersQueryInput) => {
      let where: any = args
      if (where.name) {
        where.name = { contains: args.name }
      }

      return prisma.user.findMany({ where })
    },
  },
  Mutation: {
    create_user: async function(parent: unknown, { args }: { args: UserCreationInput }, ctx: Context) {
      const user = await prisma.user.findUnique({ where: { email: args.email } })
      
      if (user) {
        throw new InvalidInputError('Email already exist')
      }

      if (ctx.user){
        throw new Error(`You can't signed up as logged in user`)
      }

      const passwdHash = await hash(args.password, SALT_ROUNDS);

      await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: passwdHash,
          active: true,
          team_id: args.team_id,
          role: AppRole.team_member,
        }
      })

      return true
    },
    update_user: async function(_: unknown, { args } : { args: UserUpdateInput }, ctx: Context){
      if ( ctx.user!.id !== args.id && ctx.user!.role !== AppRole.admin) {
        throw new AuthorizationError(`User with id:${ctx.user!.id} can't update user with id:${args.id}`)
      }

      const user = await prisma.user.findUnique({ where: { id: args.id } })

      if (!user) {
        throw new InvalidInputError(`User ${args.id} doesn't exist`)
      }

      if (args.team_id && ctx.user!.role !== AppRole.admin) {
        throw new AuthorizationError(`Only an admin can move a user to another team`)
      }

      if (args.role && ctx.user!.role !== AppRole.admin) {
        throw new AuthorizationError(`Only an admin can change the role of a user`)
      }

      const { id, ...data } = args

      if (data.password) {
        data.password = await hash(data.password, SALT_ROUNDS);
      }

      return await prisma.user.update({ where: { id }, data })
    },
    delete_user: async function(_: unknown, args: { id: number }, ctx: Context){
      if ( ctx.user!.id !== args.id && ctx.user!.role !== AppRole.admin) {
        throw new AuthorizationError(`User with id:${ctx.user!.id} can't delete user with id:${args.id}`)
      }

      const user = await prisma.user.findUnique({ where: { id: args.id } })

      if (!user) {
        throw new InvalidInputError(`User ${args.id} doesn't exist`)
      }

      return await prisma.user.delete({ where: { id: args.id }})
    },
  }
}