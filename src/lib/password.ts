import bcrypt from "bcryptjs"

export function saltAndHashPassword(password: string) {
  return bcrypt.hash(password, 10)
}

export function comparePasswords(
  userPassword: string,
  hashedPassword: string
) {
  return bcrypt.compare(userPassword, hashedPassword)
}
