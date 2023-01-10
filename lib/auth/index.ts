import { UserType } from '@prisma/client'
import { Request, Response } from 'express'

import { validationResult } from 'express-validator'
import { StatusCode } from '../../constants'
import { errorResponse, successResponse } from '../formatter'
import * as authRepo from './repo'

/**
 * @description Handler to signup
 * @param req
 * @param res
 * @returns
 */
export const signupHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }
    const { name, email, password } = req.body
    const result = await authRepo.createUser(
      name,
      email,
      password,
      UserType.Customer
    )
    return successResponse(res, StatusCode.Created, {
      message: 'User created successfully',
      result: result.id,
    })
  } catch (err: any) {
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Handler to signup
 * @param req
 * @param res
 * @returns
 */
export const sellerSignupHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }
    const { name, email, password } = req.body
    const result = await authRepo.createUser(
      name,
      email,
      password,
      UserType.Seller
    )
    return successResponse(res, StatusCode.Created, {
      message: 'Seller created successfully',
      result: result.id,
    })
  } catch (err: any) {
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Login
 * @param req
 * @param res
 * @returns
 */
export const loginHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }
    const { email, password } = req.body
    const { token, refreshToken } = await authRepo.loginWithEmail(
      email,
      password
    )
    return successResponse(res, StatusCode.Ok, {
      token,
      refreshToken,
    })
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Update user
 * @param req
 * @param res
 * @returns
 */
export const updateUserHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }
    await authRepo.udpateUser(req.userId, req.body.name)
    return successResponse(res, StatusCode.Ok, 'User updated successfully')
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Get user data
 * @param req
 * @param res
 * @returns
 */
export const getUserHandler = async (req: Request, res: Response) => {
  try {
    const userData = await authRepo.getUser(req.userId)
    return successResponse(res, StatusCode.Ok, userData)
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}
