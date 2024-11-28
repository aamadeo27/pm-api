import { Request, Response } from "express"
import { verifyToken } from "./jwt"

export default async function({ req, res }: { req: Request, res: Response }){
  const token = req.headers.authorization ?? '';

  let user = null
  if (token) {
    user = verifyToken(token.replace('Bearer ', '')) as any
  }

  return { user }
}


