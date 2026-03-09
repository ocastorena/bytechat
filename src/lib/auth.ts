import NextAuth from "next-auth"
import Credentials from "next-auth/providers/credentials"
import { comparePasswords } from "./password"
import prisma from "./prisma"
import { logInSchema } from "./validations"

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
          console.error("[AUTH]:", error)
          return null
        }
      },
    }),
  ],
  secret: process.env.NEXTAUTH_SECRET,
  session: {
    strategy: "jwt",
  },
  pages: {
    signIn: "/login",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.email = user.email
      }
      return token
    },
    async session({ session }) {
      if (session?.user?.email) {
        const dbUser = await prisma.user.findUnique({
          where: { email: session.user.email },
          select: { id: true, username: true },
        })
        if (dbUser) {
          session.user.id = dbUser.id
          session.user.name = dbUser.username
        }
      }
      return session
    },
    async redirect({ url, baseUrl }) {
      // Allow relative callback URLs
      if (url.startsWith("/")) return `${baseUrl}${url}`

      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) return url

      // Default redirect to home page
      return `${baseUrl}/home`
    },
  },
})
