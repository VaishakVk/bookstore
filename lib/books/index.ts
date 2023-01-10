import { Prisma, UserType } from '@prisma/client'
import { Request, Response } from 'express'

import { StatusCode } from '../../constants'
import { errorResponse, successResponse } from '../formatter'
import * as bookRepo from './repo'

/**
 * @description Handler to create book
 * @param req
 * @param res
 * @returns
 */
export const createBookHandler = async (req: Request, res: Response) => {
  try {
    const { name, coins, quantity } = req.body
    if (!name || !coins || !quantity) {
      return errorResponse(
        res,
        StatusCode.BadRequest,
        'Name/Coins/Quantity is missing'
      )
    }

    if (!req.file) {
      return errorResponse(res, StatusCode.BadRequest, 'No file is uploaded')
    }
    const result = await bookRepo.createBook(
      name,
      coins,
      quantity,
      req.file.buffer.toString('base64'),
      req.userId
    )
    return successResponse(res, StatusCode.Created, {
      message: 'Book created successfully',
      result: result.id,
    })
  } catch (err: any) {
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Get book data
 * @param req
 * @param res
 * @returns
 */
export const getBookHandler = async (req: Request, res: Response) => {
  try {
    const bookData = await bookRepo.getBook(Number(req.params.id))
    return successResponse(res, StatusCode.Ok, bookData)
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}

/**
 * @description Get all books data
 * @description If seller - only returns books uploaded by the person
 * @param req
 * @param res
 * @returns
 */
export const getAllBooksHandler = async (req: Request, res: Response) => {
  try {
    let where: Prisma.BookWhereInput = {}
    if (req.userType === UserType.Seller) where = { sellerId: req.userId }

    const booksData = await bookRepo.getBooks(where)
    return successResponse(res, StatusCode.Ok, booksData)
  } catch (err: any) {
    console.log(err)
    return errorResponse(res, err.statusCode, err)
  }
}
