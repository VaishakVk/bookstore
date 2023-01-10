import express from 'express'
import {
  getUserHandler,
  loginHandler,
  sellerSignupHandler,
  signupHandler,
  updateUserHandler,
} from '../lib/auth'
import isAuthenticated from '../middleware/isAuthenticated'
import {
  signupValidator,
  updateProfileValidator,
  loginValidator,
} from '../validator/auth'

const router = express.Router()

router.post('/signup', signupValidator(), signupHandler)
router.post('/seller-signup', signupValidator(), sellerSignupHandler)
router.get('/me', isAuthenticated, getUserHandler)
router.post('/login', loginValidator(), loginHandler)
router.patch(
  '/update-profile',
  isAuthenticated,
  updateProfileValidator(),
  updateUserHandler
)

export default router
