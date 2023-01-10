import { UserType } from '@prisma/client'
import { Request } from 'express'
import * as jwt from 'jsonwebtoken'
import { StatusCode } from '../../constants'

export type IJWTPayload = {
  email: string
  id: number
  iss: string
  iat: number
  exp: number
  type: UserType
}

export const sign = (payload: IJWTPayload) => {
  return jwt.sign(payload, process.env.JWT_KEY as jwt.Secret)
}

export const decode = (token: string) => {
  if (!token) throw { message: 'Token is required' }
  return jwt.verify(token, process.env.JWT_KEY as jwt.Secret) as IJWTPayload
}

export const hasToken = (req: Request) => {
  const token = req.headers['authorization']
  if (!token)
    throw {
      statusCode: StatusCode.Unauthorized,
      message: 'Token is missing',
    }
  return decode(token.replace('Bearer', '').trim())
}
