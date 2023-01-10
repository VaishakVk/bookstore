import { Request, Response, NextFunction } from 'express'
import { StatusCode } from '../constants'
import { UserType } from '@prisma/client'

export default async (req: Request, res: Response, next: NextFunction) => {
  try {
    if (req.userType === UserType.Seller) next()
    else next({ statusCode: StatusCode.Forbidden, message: 'Forbidden' })
  } catch (err) {
    return next(err)
  }
}
