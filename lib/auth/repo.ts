import { Prisma, User, UserType } from '@prisma/client'
import { StatusCode } from '../../constants'
import { prisma } from '../../prisma'
import { comparePasword, hash } from '../helpers/bcrypt'
import { IJWTPayload, sign } from '../helpers/jwt'
import { generateToken } from '../helpers/misc'

export const findOneUser = async (where: Prisma.UserWhereInput) => {
  const userData = await prisma.user.findFirst({ where })
  return userData
}

export const findOneUserCaseInsensitiveByEmail = async (email: string) => {
  return prisma.user.findFirst({
    where: { email: { equals: email, mode: 'insensitive' } },
  })
}

export const updateOneUser = async (
  where: Prisma.UserWhereUniqueInput,
  data: Prisma.UserUpdateInput
) => {
  await prisma.user.update({ where, data })
}

export const createUser = async (
  name: string,
  email: string,
  password: string,
  userType: UserType
) => {
  const userWithEmail = await findOneUserCaseInsensitiveByEmail(email)
  if (userWithEmail)
    throw {
      statusCode: StatusCode.BadRequest,
      message: 'User already exists with the same email',
    }

  const hashedPassword = await hash(password)
  const userData = await prisma.user.create({
    data: {
      name,
      email,
      password: hashedPassword,
      balance: userType === 'Customer' ? 100 : 0,
      userType,
    },
  })

  if (userType == UserType.Customer) {
    await prisma.userTransaction.create({
      data: {
        user: { connect: { id: userData.id } },
        created: { connect: { id: userData.id } },
        lastUpdated: { connect: { id: userData.id } },
        coins: 100,
      },
    })
  }
  return userData
}

export const loginWithEmail = async (email: string, password: string) => {
  const userData = await findOneUserCaseInsensitiveByEmail(email)
  if (!userData)
    throw {
      statusCode: StatusCode.Unauthorized,
      message: 'Email or password is invalid',
    }
  const isPasswordMatch = await comparePasword(password, userData.password)
  if (!isPasswordMatch)
    throw {
      statusCode: StatusCode.Unauthorized,
      message: 'Email or password is invalid',
    }
  return getToken(userData.email, userData.id, userData.userType)
}

const getToken = async (email: string, id: number, userType: UserType) => {
  const payload: IJWTPayload = {
    email: email,
    id: id,
    iss: process.env.ISSUED_BY!,
    iat: new Date().getTime(),
    exp: new Date().getTime() + 7 * 24 * 60 * 60 * 1000,
    type: userType,
  }
  const refreshToken = generateToken(64)
  const token = await sign(payload)
  await prisma.user.update({
    where: { id },
    data: { refreshToken },
  })

  return { token, refreshToken }
}

export const getUser = async (userId: number) => {
  const userData = await prisma.user.findFirst({
    where: { id: userId },
    select: { id: true, email: true, name: true, balance: true },
  })
  if (!userData)
    throw { statusCode: StatusCode.NotFound, message: 'User not found' }

  return userData
}

export const udpateUser = async (userId: number, name: string) => {
  const userData = await findOneUser({ id: userId })
  if (!userData)
    throw { statusCode: StatusCode.NotFound, message: 'User not found' }

  await updateOneUser({ id: userId }, { name })
}
