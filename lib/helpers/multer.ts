import multer from 'multer'
import { MulterFileSize } from '../../constants'

const storage = multer.memoryStorage()

export const singleFileUpload = multer({
  storage: storage,
  limits: { fileSize: MulterFileSize },
}).single('image')
