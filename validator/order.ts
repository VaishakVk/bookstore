import { body } from 'express-validator'

export const orderValidator = () => {
  return [
    body('bookId').isNumeric().withMessage('bookId should be a number'),
    body('quantity').isNumeric().withMessage('quantity should be a number'),
  ]
}
