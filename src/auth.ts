import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import { PrismaClient } from "@prisma/client"

const prisma = new PrismaClient()
export const authOption: NextAuthOptions = {
    providers: [
        Credentials({
            name: "Email",
            credentials: {
                email: { label: "email", type: "email" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user: any = await prisma.user.findFirst({
                    where: {
                        email: credentials?.email,
                        password: credentials?.password
                    }
                })
                return user
            }
        })
    ],
    session: {
        maxAge: 8 * 60 * 60
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
            session.user.role = token.role
            return session
        },
        async redirect() {
            return "/klinik"
        }
    },
    theme: {
        logo: "/logo.png"
    }
}