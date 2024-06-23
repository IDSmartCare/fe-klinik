import { User, Session } from "next-auth"

declare module "next-auth" {
    interface User {
        role: string
        username: string
        idFasyankes?: string
        profile?: {
            namaLengkap: string
            profesi: string
            unit?: string
        }

    }

    interface Session {
        user: {
            role: string
            username: string
            idFasyankes?: string
            profile?: {
                namaLengkap: string
                profesi: string
                unit?: string
            }
        } & DefaultSession["user"]
    }

}