import { OrderStatus, Prisma } from '@prisma/client'
import { StatusCode } from '../../constants'
import { prisma } from '../../prisma'
import { getUser } from '../auth/repo'
import { getBook } from '../books/repo'
import { OrderPayload } from './types'

export const findOneOrder = async (where: Prisma.OrderWhereInput) => {
  const orderData = await prisma.order.findFirst({ where })
  return orderData
}

export const updateOneOrder = async (
  where: Prisma.OrderWhereUniqueInput,
  data: Prisma.OrderUpdateInput
) => {
  await prisma.order.update({ where, data })
}

export const createOrder = async (
  orderPayload: OrderPayload,
  userId: number
) => {
  const userData = await getUser(userId)

  const bookData = await getBook(orderPayload.bookId)

  if (bookData.quantity < orderPayload.quantity) {
    throw {
      statusCode: StatusCode.BadRequest,
      message: 'Book is out of stock',
    }
  }

  if (bookData.coins > userData.balance) {
    throw {
      statusCode: StatusCode.BadRequest,
      message: 'balance is less',
    }
  }

  const [orderData, _, __] = await prisma.$transaction([
    prisma.order.create({
      data: {
        status: OrderStatus.Success,
        user: { connect: { id: userId } },
        created: { connect: { id: userId } },
        lastUpdated: { connect: { id: userId } },
        lines: {
          create: {
            bookId: orderPayload.bookId,
            coins: bookData.coins,
            createdBy: userId,
            lastUpdatedBy: userId,
            quantity: orderPayload.quantity,
          },
        },
      },
    }),
    // Update User balance
    prisma.user.update({
      where: { id: userId },
      data: { balance: { decrement: bookData.coins * orderPayload.quantity } },
    }),
    // Add transaction
    prisma.userTransaction.create({
      data: {
        coins: -1 * bookData.coins * orderPayload.quantity,
        userId,
        createdBy: userId,
        lastUpdatedBy: userId,
      },
    }),
    // Decrement book quantity
    prisma.book.update({
      where: { id: bookData.id },
      data: {
        quantity: { decrement: orderPayload.quantity },
        lastUpdatedBy: userId,
      },
    }),
  ])

  return orderData
}

export const cancelOrder = async (orderId: number, userId: number) => {
  const orderData = await getOrder(orderId)

  if (orderData.userId != userId) {
    throw {
      statusCode: StatusCode.Forbidden,
      message: 'Forbidden',
    }
  }
  const lineData = orderData.lines[0]

  const [___, _, __] = await prisma.$transaction([
    prisma.order.update({
      where: { id: orderId },
      data: {
        status: OrderStatus.Cancelled,
        lastUpdated: { connect: { id: userId } },
      },
    }),
    // Update User balance
    prisma.user.update({
      where: { id: userId },
      data: { balance: { increment: lineData.coins * lineData.quantity } },
    }),
    // Add transaction
    prisma.userTransaction.create({
      data: {
        coins: 1 * lineData.coins * lineData.quantity,
        userId,
        createdBy: userId,
        lastUpdatedBy: userId,
      },
    }),
    // Decrement book quantity
    prisma.book.update({
      where: { id: lineData.bookId },
      data: {
        quantity: { increment: lineData.quantity },
        lastUpdatedBy: userId,
      },
    }),
  ])

  return orderData
}

export const getOrder = async (orderId: number) => {
  const orderData = await prisma.order.findFirst({
    where: { id: orderId },
    include: {
      user: { select: { name: true, id: true } },
      lines: { include: { book: true } },
    },
  })
  if (!orderData)
    throw { statusCode: StatusCode.NotFound, message: 'Order not found' }

  return orderData
}

export const getOrders = async (where: Prisma.OrderWhereInput) => {
  const orderData = await prisma.order.findMany({
    where,
    include: {
      user: { select: { name: true, id: true } },
      lines: { include: { book: true } },
    },
  })

  return orderData
}
