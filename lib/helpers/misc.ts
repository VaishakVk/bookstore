import { customAlphabet } from 'nanoid'
export const generateToken = (length: number) => {
  if (!length) length = 32
  const characters =
    'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  const nanoid = customAlphabet(characters, length)
  const result = nanoid()
  return result
}

export const generateOtp = (length?: number) => {
  if (!length) length = 6
  let otp = ''
  for (let i = 0; i < length; i++) {
    otp += Math.floor(Math.random() * 10)
  }
  return otp
}

export const setExpiry = (time: number) => {
  const now = new Date()
  const expTime = now.setSeconds(now.getSeconds() + time)
  return new Date(expTime)
}
