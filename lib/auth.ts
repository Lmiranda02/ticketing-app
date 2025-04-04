import type { NextAuthOptions, User } from "next-auth"

declare module "next-auth" {
  interface User {
    role?: string
  }

  interface Session {
    user: {
      id?: string
      role?: string
      name?: string | null
      email?: string | null
      image?: string | null
    }
  }
}
import CredentialsProvider from "next-auth/providers/credentials"
// import GoogleProvider from "next-auth/providers/google" // Comentado
import { connectToDatabase } from "@/lib/mongodb"
import { compare } from "bcrypt"

export const authOptions: NextAuthOptions = {
  providers: [
    // Comentado el proveedor de Google
    /*
    GoogleProvider({
      clientId: process.env.GOOGLE_CLIENT_ID as string,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET as string,
    }),
    */
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "email" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Credenciales incompletas")
        }

        try {
          const { db } = await connectToDatabase()
          const user = await db.collection("users").findOne({ email: credentials.email })

          if (!user || !user.password) {
            throw new Error("Usuario no encontrado")
          }

          const isPasswordValid = await compare(credentials.password, user.password)

          if (!isPasswordValid) {
            throw new Error("Contraseña incorrecta")
          }

          return {
            id: user._id.toString(),
            email: user.email,
            name: user.name,
            role: user.role,
          }
        } catch (error) {
          console.error("Error en authorize:", error)
          return null
        }
      },
    }),
  ],
  pages: {
    signIn: "/",
    error: "/",
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id
        token.role = user.role
      }
      return token
    },
    async session({ session, token }) {
      if (token && session.user) {
        session.user.id = token.id as string
        session.user.role = token.role as string
      }
      return session
    },
  },
  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
}

