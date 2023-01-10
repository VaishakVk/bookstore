import express, { Express, NextFunction, Request, Response } from 'express'
import dotenv from 'dotenv'
import helmet from 'helmet'
import morgan from 'morgan'
import authRoutes from './routes/auth'
import bookRoutes from './routes/book'
import orderRoutes from './routes/order'
import { errorResponse } from './lib/formatter'
import { StatusCode } from './constants'
import { UserType } from '@prisma/client'

dotenv.config()

const port = process.env.PORT
declare global {
  namespace Express {
    interface Request {
      userId: number
      userType: UserType
    }
  }
}
const app: Express = express()

app.use(helmet())
app.use(morgan(':method :url :status :date[iso] :response-time ms'))
app.use((req, res, next) => {
  res.header('Access-Control-Allow-Origin', '*')
  res.header('Access-Control-Allow-Credentials', 'true')
  res.header(
    'Access-Control-Allow-Methods',
    'GET,HEAD,PUT,PATCH,POST,DELETE,OPTIONS'
  )
  res.header('Access-Control-Expose-Headers', 'Content-Length')
  res.header(
    'Access-Control-Allow-Headers',
    'Accept, Authorization, Content-Type, X-Requested-With, Range'
  )
  if (req.method === 'OPTIONS') {
    return res.send(200)
  } else {
    return next()
  }
})

app.use(express.json({ limit: '10mb' }))
app.use(express.urlencoded({ limit: '10mb', extended: true }))

app.use('/api/auth', authRoutes)
app.use('/api/book', bookRoutes)
app.use('/api/order', orderRoutes)

app.get('/status', (req: Request, res: Response) => {
  res.status(200).json({ message: 'Aok!' })
})

app.use((err: any, req: Request, res: Response, next: NextFunction) => {
  return errorResponse(
    res,
    err.statusCode || StatusCode.InternalServerError,
    err
  )
})
app.listen(port, () => {
  console.log(`⚡️ Server is running on port ${port}`)
})
