import express from 'express'
import {
  cancelOrderHandler,
  createOrderHandler,
  getAllOrdersHandler,
  getOrderHandler,
} from '../lib/order'
import isAuthenticated from '../middleware/isAuthenticated'
import isCustomer from '../middleware/isCustomer'

const router = express.Router()

router.post('/', isAuthenticated, isCustomer, createOrderHandler)
router.patch('/cancel/:id', isAuthenticated, isCustomer, cancelOrderHandler)
router.get('/:id', isAuthenticated, getOrderHandler)
router.get('/', isAuthenticated, getAllOrdersHandler)

export default router
