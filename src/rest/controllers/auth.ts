import { compare } from "bcrypt";
import { Request, Response } from "express";
import { generateToken } from "../../middleware/jwt";
import { CustomError } from "../../errors/CustomError";
import prisma from "../../utils/prisma-client";
import { Context } from "../../graphql";

export const login = async(req: Request, res: Response) => {
  const { email, password } = req.body

  const user = await prisma.user.findUnique({ where: { email, active: true } })
  if (!user) {
    res.status(401).send(`Invalid User or Password`)
    return
  }
  
  const validPassword = await compare(password, user.password)

  if (!validPassword) {
    res.status(401).send(`Invalid User or Password`)
    return
  }

  const token = generateToken(user)

  res.cookie('jwt-token', token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: process.env.NODE_ENV === 'production' ? 'none' : 'lax',
    maxAge: 30*24*3600000,
  })

  res.status(200).send({ jwt: token })
}

export const tokens = (req: Request<Context>, res: Response) => {
  res.status(200).send({ jwt: req.cookies['jwt-token'] })
}