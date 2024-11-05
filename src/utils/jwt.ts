import jwt from 'jsonwebtoken'

export function generateToken(user: { id: string, email: string }){
  return jwt.sign(
    { userId: user.id, email: user.email }, 
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
