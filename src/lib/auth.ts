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
          console.log("[AUTH]:", error)
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
      console.log("🔄 Redirect callback:", { url, baseUrl })

      // Allow relative callback URLs
      if (url.startsWith("/")) {
        console.log("✅ Redirecting to relative:", `${baseUrl}${url}`)
        return `${baseUrl}${url}`
      }

      // Allow callback URLs on the same origin
      if (new URL(url).origin === baseUrl) {
        console.log("✅ Redirecting to same origin:", url)
        return url
      }

      // Default redirect to home page
      console.log("✅ Default redirect to home")
      return `${baseUrl}/home`
    },
  },
})
