import * as bcrypt from 'bcryptjs'
import { SaltRounds } from '../../constants'

export const hash = async (data: string) => {
  if (!data) throw 'Data is required'
  const salt = await bcrypt.genSalt(SaltRounds)
  const hashed = await bcrypt.hash(data, salt)
  return hashed
}

export const comparePasword = async (val: string, hash: string) => {
  if (!val || !hash) throw 'Hash and value is required'
  const compared = await bcrypt.compare(val, hash)
  return compared
}
