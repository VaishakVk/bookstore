import { Request, Response, NextFunction } from 'express'
import { JwtPayload } from 'jsonwebtoken'
import { StatusCode } from '../constants'
import { prisma } from '../prisma'
import { hasToken, IJWTPayload } from '../lib/helpers/jwt'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    const payload = (await hasToken(req)) as IJWTPayload
    if (!payload)
      throw {
        statusCode: StatusCode.Unauthorized,
        message: 'Token is missing',
      }
    if (payload.iss != process.env.ISSUED_BY)
      throw {
        statusCode: StatusCode.Unauthorized,
        message: 'Invalid Token',
      }

    if (payload.exp! < new Date().getTime())
      throw {
        statusCode: StatusCode.Unauthorized,
        message: 'Token has expired',
      }
    const userData = await prisma.user.findFirst({
      where: { id: payload.id },
    })
    if (!userData)
      throw {
        statusCode: StatusCode.Unauthorized,
        message: 'Token is invalid',
      }
    req.userId = userData.id
    req.userType = userData.userType
    next()
  } catch (err) {
    return next(err)
  }
}
