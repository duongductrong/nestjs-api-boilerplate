import * as bcrypt from "bcrypt"

const saltOrRounds = 10

export function hash(password: string): Promise<string> {
  return bcrypt.hash(password, saltOrRounds)
}

export function verify(
  password: string,
  hashPayload: string,
): Promise<boolean> {
  return bcrypt.compare(password, hashPayload)
}

export const token = {
  hash,
  verify,
}
