import NextAuth, { AuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";

export const authOptions: AuthOptions = {
  providers: [
    CredentialsProvider({
      name: "Credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials) {
        if (!credentials?.email || !credentials?.password) return null;

        try {
          const res = await fetch(`${process.env.BACKEND_API_URL}/auth/login`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              email: credentials.email,
              password: credentials.password,
            }),
          });

          if (!res.ok) return null;

          const user = await res.json(); // This maps directly to your Spring Boot UserDTO

          // Extract Set-Cookie headers from Spring Boot response
          const cookies = res.headers.getSetCookie();

          // Pass the cookies to the browser if running on an API request lifecycle
          if (cookies && cookies.length > 0) {
            const { cookies: nextCookies } = await import("next/headers");
            const cookieStore = await nextCookies();

            // NextAuth intercepts login server side. Parse cookies and assign them to Next.js cookie pipeline
            cookies.forEach((cookieStr) => {
              const [nameValue, ...options] = cookieStr.split(";");
              const [name, value] = nameValue.split("=");

              cookieStore.set({
                name: name.trim(),
                value: value.trim(),
                httpOnly: true,
                secure: true,
                sameSite: "lax",
                path: "/",
              });
            });
          }

          // Return basic details to establish local NextAuth session state
          return {
            id: user.id.toString(),
            name: user.name,
            email: user.email,
          };
        } catch (error) {
          console.error("Auth process error:", error);
          return null;
        }
      },
    }),
  ],
  callbacks: {
    async jwt({ token, user }) {
      if (user) {
        token.id = user.id;
      }
      return token;
    },
    async session({ session, token }) {
      if (session.user && token) {
        session.user.id = token.id as string;
      }
      return session;
    },
  },
  pages: {
    signIn: "/login",
  },
  secret: process.env.NEXTAUTH_SECRET,
};

const handler = NextAuth(authOptions);
export { handler as GET, handler as POST };
