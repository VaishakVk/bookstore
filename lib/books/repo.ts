import { Prisma } from '@prisma/client'
import { StatusCode } from '../../constants'
import { prisma } from '../../prisma'

export const findOneBook = async (where: Prisma.BookWhereInput) => {
  const bookData = await prisma.book.findFirst({ where })
  return bookData
}

export const updateOneBook = async (
  where: Prisma.BookWhereUniqueInput,
  data: Prisma.BookUpdateInput
) => {
  await prisma.book.update({ where, data })
}

export const createBook = async (
  name: string,
  coins: number,
  quantity: number,
  image: string,
  sellerId: number
) => {
  const bookData = await prisma.book.create({
    data: {
      name,
      coins: Number(coins),
      quantity: Number(quantity),
      seller: { connect: { id: sellerId } },
      created: { connect: { id: sellerId } },
      lastUpdated: { connect: { id: sellerId } },
      image,
    },
  })

  return bookData
}

export const getBook = async (bookId: number) => {
  const bookData = await prisma.book.findFirst({
    where: { id: bookId },
    include: { seller: { select: { name: true, id: true } } },
  })
  if (!bookData)
    throw { statusCode: StatusCode.NotFound, message: 'Book not found' }

  return bookData
}

export const getBooks = async (where: Prisma.BookWhereInput) => {
  const bookData = await prisma.book.findMany({
    where,
    include: { seller: { select: { name: true, id: true } } },
  })

  return bookData
}
