import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { comparePasswords } from "./utils"
import prisma from "./prisma"
import { logInSchema } from "./zod"

export const { handlers, signIn, signOut, auth } = NextAuth({
  providers: [
    Credentials({
      credentials: {
        email: {
          type: "email",
          label: "Email",
          placeholder: "johndoe@gmail.com",
        },
        password: {
          type: "password",
          label: "Password",
          placeholder: "*****",
        },
      },
      authorize: async (credentials) => {
        try {
          const { email, password } = await logInSchema.parseAsync(credentials)

          // logic to verify if the user exists
          const user = await prisma.user.findUnique({
            where: { email: email },
          })
          if (!user) {
            // No user found, so this is their first attempt to login
            // Optionally, this is also the place you could do a user registration
            throw new Error("Invalid credentials.")
          }

          const passwordsMatch = await comparePasswords(password, user.password)
          if (!passwordsMatch) {
            throw new Error("Invalid credentials")
          }

          // return user object with their profile data
          return user
        } catch (error) {
          return null
        }
      },
    }),
  ],
})
