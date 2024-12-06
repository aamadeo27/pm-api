import { ApolloServer } from "@apollo/server"
import { typeDefs, resolvers, Context } from './graphql'
import formatError from "./utils/format-error"
import cors from "cors"
import express, { json } from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import { expressMiddleware } from "@apollo/server/express4"
import 'dotenv/config'
import { errorHandler } from "./middleware/error-handler"
import contextMiddleware from "./middleware/context-middleware"
import restRoutes from "./rest/routes/v1"
import { authPlugin, rolePlugin } from "./middleware/apollo-plugins"

export const apolloServer = new ApolloServer<Context>({
  typeDefs: typeDefs,
  resolvers: resolvers,
  plugins: [rolePlugin, authPlugin],
  formatError,
})

export async function startServer(){
  const app = express()
  app.use(cors({
    credentials: true,
    origin: 'http://localhost:5173'
  }))
  app.use(helmet())
  app.use(express.json())
  app.use(cookieParser())
  
  await apolloServer.start()
  
  app.use('/graphql', expressMiddleware(apolloServer, {
    context: contextMiddleware
  }))
  
  app.use('/v1', restRoutes)

  app.use(errorHandler)

  return app
}