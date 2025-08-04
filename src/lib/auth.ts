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
          if (!user) return null

          const passwordsMatch = await comparePasswords(password, user.password)
          if (!passwordsMatch) return null

          return { id: user.id, email: user.email }
        } catch (error) {
          return null
        }
      },
    }),
  ],
})
