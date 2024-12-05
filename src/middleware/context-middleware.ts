import { Request, Response } from "express"
import { verifyToken } from "./jwt"
import { InvalidTokenError } from "../errors/CustomError";

export default async function({ req, res }: { req: Request, res: Response }){
  const token = (req.headers.authorization ?? '').replace('Bearer ', '');

  let user = null
  if (token) {
    try {
      user = verifyToken(token) as any
    } catch (error) {
      if (error instanceof InvalidTokenError) {
        console.warn('Invalid Token')
        user = null
      } else {
        throw error
      }
    }
  }

  return { user }
}
