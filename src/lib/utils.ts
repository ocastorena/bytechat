import bcrypt from "bcryptjs"
import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export async function saltAndHashPassword(password: string) {
  return await bcrypt.hash(password, 10)
}

export async function comparePasswords(
  userPassword: string,
  hashedPassword: string
) {
  return await bcrypt.compare(userPassword, hashedPassword)
}
