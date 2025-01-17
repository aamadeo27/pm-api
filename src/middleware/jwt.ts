import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'
import { InvalidTokenError } from '../errors/CustomError'

export function generateToken(user: Pick<User,'id' | 'name' | 'email' | 'role'>){
  return jwt.sign(
    user, 
    process.env.JWT_SECRET as string, 
    { expiresIn: '1h' }
  )
}

export function verifyToken(token: string){
  try {
    return jwt.verify(token, process.env.JWT_SECRET as string)
  } catch(error) {
    throw new InvalidTokenError('Invalid or expired token')
  }
}
