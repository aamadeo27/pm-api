import csrf from "csrf"
import { Request, Response } from "express"
import { verifyToken } from "../utils/jwt"

const csrfProtection = new csrf()
export default (csrfProtection: csrf) => async function({ req, res }: { req: Request, res: Response }){
  const verifyCSRFToken = req.body.query?.startsWith('mutation')
    
  if (verifyCSRFToken){
    const csrfToken = req.cookies['csrf-token']
    const clientToken = req.headers['x-csrf-token'] as string

    if( !csrfToken || 
        !clientToken ||
        !csrfProtection.verify(process.env.CSRF_SECRET as string, clientToken)
      ){
      throw new Error(`${csrfToken} vs ${clientToken}`)
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

  return { user, res }
}


