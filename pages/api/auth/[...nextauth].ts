import NextAuth from "next-auth/next"
import { NextAuthOptions } from "next-auth"
import GithubProvider from "next-auth/providers/github"
import CredentialsProvider from "next-auth/providers/credentials";
import { PrismaAdapter } from "@auth/prisma-adapter";
import prisma from "@/lib/prisma";
import type { Adapter } from 'next-auth/adapters';

export const authOptions: NextAuthOptions = {
  // Configure one or more authentication providers
  providers: [
    CredentialsProvider({
      // The name to display on the sign in form (e.g. "Sign in with...")
      name: "credentials",
      // `credentials` is used to generate a form on the sign in page.
      // You can specify which fields should be submitted, by adding keys to the `credentials` object.
      // e.g. domain, username, password, 2FA token, etc.
      // You can pass any HTML attribute to the <input> tag through the object.
      credentials: {
        emailOrUsername: { label: "Username or Email", type: "text", placeholder: "Enter Username or Email" },
        password: { label: "Password", type: "password", placeholder: 'Password' }
      },
      async authorize(credentials, req) {
        // Add logic here to look up the user from the credentials supplied
        const res = await fetch("http://127.0.0.1:3000/api/login", {
          method: "POST",
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({ emailOrUsername: credentials?.emailOrUsername, password: credentials?.password })
        })

        const user = await res.json()
        if (user) {
          // Any object returned will be saved in `user` property of the JWT
          return user
        } else {
          // If you return null then an error will be displayed advising the user to check their details.
          return null

          // You can also Reject this callback with an Error thus the user will be sent to the error page with the error message as a query parameter
        }
      }
    }),
    GithubProvider({
      clientId: process.env.GITHUB_ID as string,
      clientSecret: process.env.GITHUB_SECRET as string,
    }),
    // ...add more providers here
  ],
  adapter: PrismaAdapter(prisma) as Adapter,
  pages: {
    signIn: '/login'
  },
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({token, user}){
      return {...token, ...user}
    },
    async session({session, token}){
      session.user = token as any
      return session
    }
  }
}

export default NextAuth(authOptions)
