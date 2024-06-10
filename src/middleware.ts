export { default } from "next-auth/middleware"
export const config = { matcher: ['/klinik((?!api|_next/static|_next/image|.*\\..*).*)',] }

