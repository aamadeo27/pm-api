import { Request, Response } from "express"
import { verifyToken } from "./jwt"

export default async function({ req, res }: { req: Request, res: Response }){
  const token = req.headers.authorization ?? '';
  let user = null;

  if (token) {
    const decodedToken = verifyToken(token.replace('Bearer ', '')) as any
    if (decodedToken) {
      user = { id: decodedToken.userId, email: decodedToken.email, role: decodedToken.role }
    }
  }

  return { user }
}


