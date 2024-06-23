import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials"
import prisma from "./db";

export const authOption: NextAuthOptions = {
    providers: [
        Credentials({
            name: "username",
            credentials: {
                username: { label: "Username", type: "text" },
                password: { label: "Password", type: "password" }
            },
            async authorize(credentials) {
                const user: any = await prisma.user.findFirst({
                    where: {
                        username: credentials?.username,
                        password: credentials?.password,
                        isAktif: true
                    },
                    include: {
                        profile: {
                            select: {
                                namaLengkap: true,
                                profesi: true,
                                unit: true
                            }
                        }
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
                token.idFasyankes = user.idFasyankes
                token.username = user.username
                token.name = user.profile?.namaLengkap ?? "Administrator"
                token.unit = user.profile?.unit ?? "admin"
                token.profesi = user.profile?.profesi ?? "Admin"
            }
            return token
        },
        async session({ session, token }) {
            session.user.id = token.id
            session.user.role = token.role
            session.user.idFasyankes = token.idFasyankes
            session.user.username = token.username
            session.user.name = token.name
            session.user.unit = token.unit
            session.user.profesi = token.profesi
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