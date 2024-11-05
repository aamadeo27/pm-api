import { ApolloServer } from "@apollo/server"
import { typeDefs, resolvers, Context } from './graphql'
import formatError from "./utils/formatError"
import cors from "cors"
import express, { NextFunction, Request, Response, json} from "express"
import helmet from "helmet"
import cookieParser from "cookie-parser"
import csrf from "csrf"
import { expressMiddleware } from "@apollo/server/express4"
import 'dotenv/config'
import { verifyToken } from "./utils/jwt"
import { errorHandler } from "./middleware/errorHandler"

export const apolloServer = new ApolloServer<Context>({
  typeDefs: typeDefs,
  resolvers: resolvers,
  formatError,
})

export async function startServer(){
  const app = express()
  app.use(cors())
  app.use(helmet())
  app.use(express.json())
  app.use(cookieParser())
  
  
  await apolloServer.start()
  
  const csrfProtection = new csrf()
  app.use((req: Request,res: Response, next: NextFunction) => {
    const csrfToken = csrfProtection.create(process.env.CSRF_SECRET ?? 'shouldexist')
    res.cookie('csrf-token', csrfToken, { httpOnly: true })
    ;(req as any).csrfToken = csrfToken
    next()
  })
  
  app.use('/graphql', json(), expressMiddleware(apolloServer, {
    context: async ({ req }) => {
      const verifyCSRFToken = req.body.query?.startsWith('mutation')
        
      if (verifyCSRFToken){
        const csrfToken = req.cookies['csrf-token']
        const clientToken = req.headers['csrf-token'] as string

        if( !csrfToken || 
            !clientToken ||
            !csrfProtection.verify(process.env.CSRF_SECRET as string, clientToken)
          ){
          throw new Error('Invalid CSRF Token')
        }
      }

      const token = req.headers.authorization ?? '';
      let user = null;
  
      if (token) {
        const decodedToken = verifyToken(token.replace('Bearer ', '')) as any
        if (decodedToken) {
          user = { id: decodedToken.userId, email: decodedToken.email }
        }
      }

      console.log('Returning')

      return { user }
    }
  }))
  
  app.get('/csrf-token', (req: Request, res: Response) => {
    console.log(req.csrfToken)

    res.send({ csrfToken: req.csrfToken })
  })

  app.use(errorHandler)

  return app
}