import { ApolloServer } from "@apollo/server"
import { typeDefs, resolvers, Context } from './graphql'
import formatError from "./utils/format-error"
import cors from "cors"
import express, { NextFunction, Request, Response, json} from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import csrf from "csrf"
import { expressMiddleware } from "@apollo/server/express4"
import 'dotenv/config'
import { errorHandler } from "./middleware/errorHandler"
import contextMiddleware from "./middleware/contextMiddleware"
import restRoutes from "./rest/routes/v1"

export const apolloServer = new ApolloServer<Context>({
  typeDefs: typeDefs,
  resolvers: resolvers,
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
  
  const csrfProtection = new csrf()
  app.use((req: Request,res: Response, next: NextFunction) => {

    let csrfToken = req.cookies['csrf-token']

    if (!csrfToken){
      csrfToken = csrfProtection.create(process.env.CSRF_SECRET ?? 'shouldexist')
      res.cookie('csrf-token', csrfToken, {
        httpOnly: true,
        secure: false,
        sameSite: 'lax',
        path: '/'
      })
    }

    ;(req as any).csrfToken = csrfToken
    next()
  })
  
  app.use('/graphql', json(), expressMiddleware(apolloServer, {
    context: contextMiddleware(csrfProtection)
  }))
  
  app.use('/v1', restRoutes)

  app.use(errorHandler)

  return app
}