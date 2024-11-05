import { Request, Response, NextFunction } from 'express'
import { CustomError } from '../errors/CustomError'

export function errorHandler(err: Error, req: Request, res: Response, next: NextFunction): void{
  console.error(err)

  if (err instanceof CustomError) {
    res.status(err.statusCode).json({ message: err.message })
  } else {
    res.status(500).json({ message: 'Internal Server Error' })
  }
}