import { NextAuthOptions } from "next-auth";
import Credentials from "next-auth/providers/credentials";

export const authOption: NextAuthOptions = {
  providers: [
    Credentials({
      name: "username",
      credentials: {
        username: { label: "Username", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        const user: any = await fetch(
          `${process.env.NEXT_PUBLIC_URL_BO}/access-fasyankes`,
          {
            method: "POST",
            body: JSON.stringify({
              username: credentials?.username,
              password: credentials?.password,
            }),
            headers: {
              "Content-Type": "application/json",
              Authorization: `${process.env.NEXT_PUBLIC_TOKEN_BO}`,
            },
          }
        );
        if (!user.ok) {
          return null;
        }
        const res = await user.json();
        return res.data;
      },
    }),
  ],
  session: {
    maxAge: 8 * 60 * 60,
  },
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.role = user.role;
        token.idFasyankes = String(user.fasyankes.fasyankesId);
        token.username = user.username;
        token.wfid = user.wfid;
        token.idProfile = user.id_profile;
        token.package = user.fasyankes.package;
        // token.package = "plus"
        token.type = user.fasyankes.type;
        // token.type = "Klinik";
      }
      return token;
    },
    async session({ session, token }) {
      session.user.role = token.role;
      session.user.idFasyankes = token.idFasyankes;
      session.user.username = token.username;
      session.user.wfid = token.wfid;
      session.user.idProfile = token.idProfile;
      session.user.package = token.package;
      session.user.type = token.type;
      return session;
    },
    async redirect() {
      return "/klinik";
    },
  },
  theme: {
    logo: "/logo.png",
    colorScheme: "light",
  },
};
