import express from 'express'
import {
  createBookHandler,
  getAllBooksHandler,
  getBookHandler,
} from '../lib/books'
import { singleFileUpload } from '../lib/helpers/multer'
import isAuthenticated from '../middleware/isAuthenticated'
import isSeller from '../middleware/isSeller'

const router = express.Router()

router.post('/', isAuthenticated, isSeller, singleFileUpload, createBookHandler)
router.get('/:id', isAuthenticated, getBookHandler)
router.get('/', isAuthenticated, getAllBooksHandler)

export default router
