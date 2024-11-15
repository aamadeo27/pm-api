import { User } from '@prisma/client'
import jwt from 'jsonwebtoken'

export function generateToken(user: Pick<User,'id' | 'name' | 'email'>){
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
    throw new Error('Invalid or expired token')
  }
}
