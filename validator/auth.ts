import { body } from 'express-validator'

export const signupValidator = () => {
  return [
    body('name').isString().withMessage('name should be a string'),
    body('email').isEmail().withMessage('email should valid'),
    body('password')
      .isString()
      .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')
      .withMessage(
        'password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  ]
}

export const updateProfileValidator = () => {
  return [
    body('name').isString().withMessage('name should be a string').optional(),
  ]
}

export const loginValidator = () => {
  return [
    body('email').isEmail().withMessage('email should valid'),
    body('password')
      .isString()
      .matches('^(?=.*?[A-Z])(?=.*?[a-z])(?=.*?[0-9]).{8,32}$')
      .withMessage(
        'password must be greater than 8 and contain at least one uppercase letter, one lowercase letter, and one number'
      ),
  ]
}
