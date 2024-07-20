import * as bcrypt from "bcrypt";

const saltOrRounds = 10;

export function hash(password: string): string {
  return bcrypt.hashSync(password, saltOrRounds);
}

export function verify(password: string, hashPayload: string): boolean {
  return bcrypt.compareSync(password, hashPayload);
}

export const token = {
  hash,
  verify,
};
