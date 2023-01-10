import { Response } from 'express'
import { StatusCode } from '../../constants'
/**
 * @description Handler to format success response
 * @param {Express.Response} res
 * @param {number} statusCode
 * @param {any} data
 */
export const successResponse = (
  res: Response,
  statusCode: number,
  data: any
) => {
  res.status(statusCode).send({
    success: true,
    code: statusCode,
    message: data,
  })
}

/**
 * @description Handler to format error response
 * @param {Express.Response} res
 * @param {number} statusCode
 * @param {any} error
 */
export const errorResponse = (res: Response, statusCode: number, err: any) => {
  res.status(statusCode || StatusCode.InternalServerError).send({
    success: false,
    code: statusCode || StatusCode.InternalServerError,
    message: Array.isArray(err)
      ? err.map((e) => e.msg).join(',')
      : err.message || err,
  })
}

module.exports = {
  successResponse,
  errorResponse,
}
