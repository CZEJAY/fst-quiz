import NextAuth from "next-auth";
import Google from "next-auth/providers/google";
import { prisma } from "./lib/prisma";
import { PrismaAdapter } from "@auth/prisma-adapter";

export const { handlers, signIn, signOut, auth } = NextAuth({
  adapter: PrismaAdapter(prisma),
  providers: [Google],
  // debug: process.env.NODE_ENV === "development",
  session: {
    strategy: "jwt",
  },
  callbacks: {
    async jwt({ token, user, session }) {
      // console.log("JWT CALLBACK => ", { token, user, session });
      if (user) {
        return {
          ...token,
          id: user.id,
          name: user.name,
          // @ts-ignore
          role: user.role,
        };
      }
      return token;
    },
    //@ts-ignore
    async session({ session, token, user }) {
      // console.log("SESSION CALLBACK => ", { session, token, user });
      if (token) {
        return {
          ...session,
          user: {
            ...session.user,
            id: token.id,
            name: token.name,
            role: token.role,
          },
        };
      }
      return session;
    },
  },
});
