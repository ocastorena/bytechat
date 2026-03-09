import bcrypt from "bcryptjs"

export async function saltAndHashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(
  userPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(userPassword, hashedPassword)
}
