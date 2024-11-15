import { IResolvers } from "@graphql-tools/utils"
import { Context } from ".."
import { UserCreationInput } from "./types"
import prisma from '../../utils/prisma-client'
import { hash } from 'bcrypt'
import { InvalidInputError, AuthenticationError } from "../../errors/ApolloCustomErrors"

export const resolvers: IResolvers<any, Context> = {
  Query: {
    hello: () => 'Hello World'
  },
  Mutation: {
    create_user: async function(parent: unknown, args: UserCreationInput, ctx: Context) {
      const user = await prisma.user.findUnique({ where: { email: args.email } })
      
      if (user) {
        throw new InvalidInputError('Email already exist')
      }

      if (ctx.user){
        throw new Error(`You can't create a user been logged on`)
      }

      const saltRounds = 11;
      const passwdHash = await hash(args.password, saltRounds);

      return await prisma.user.create({
        data: {
          name: args.name,
          email: args.email,
          password: passwdHash,
          active: true,
        }
      })
    }
  }
}