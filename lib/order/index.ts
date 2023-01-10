import { Prisma, UserType } from '@prisma/client'
import { Request, Response } from 'express'

import { validationResult } from 'express-validator'
import { StatusCode } from '../../constants'
import { errorResponse, successResponse } from '../formatter'
import * as orderRepo from './repo'

/**
 * @description Handler to create order
 * @param req
 * @param res
 * @returns
 */
export const createOrderHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }

    const result = await orderRepo.createOrder(req.body, req.userId)
    return successResponse(res, StatusCode.Created, {
      message: 'Order created successfully',
      result: result.id,
    })
  } catch (err: any) {
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Handler to cancel order
 * @param req
 * @param res
 * @returns
 */
export const cancelOrderHandler = async (req: Request, res: Response) => {
  try {
    const errors = validationResult(req)
    if (!errors.isEmpty()) {
      return errorResponse(res, StatusCode.BadRequest, errors.array())
    }

    await orderRepo.cancelOrder(Number(req.params.id), req.userId)
    return successResponse(res, StatusCode.Ok, {
      message: 'Order cancelled successfully',
    })
  } catch (err: any) {
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Get order data
 * @param req
 * @param res
 * @returns
 */
export const getOrderHandler = async (req: Request, res: Response) => {
  try {
    const bookData = await orderRepo.getOrder(Number(req.params.id))
    return successResponse(res, StatusCode.Ok, bookData)
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Get all orders data
 * @description If seller - only returns orders of the seller, if user - resturns order placed by the user
 * @param req
 * @param res
 * @returns
 */
export const getAllOrdersHandler = async (req: Request, res: Response) => {
  try {
    let where: Prisma.OrderWhereInput = {}
    if (req.userType === UserType.Seller)
      where = { lines: { some: { book: { sellerId: req.userId } } } }
    else where = { userId: req.userId }
    const booksData = await orderRepo.getOrders(where)
    return successResponse(res, StatusCode.Ok, booksData)
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}
