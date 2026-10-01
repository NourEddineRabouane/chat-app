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

          if (cookies && cookies.length > 0) {
            const { cookies: nextCookies } = await import("next/headers");
            const cookieStore = await nextCookies();

            cookies.forEach((cookieStr) => {
              // Split by semicolon to separate the name=value pair from options
              const parts = cookieStr.split(";").map((p) => p.trim());

              // First part is always key=value
              const [name, ...valParts] = parts[0].split("=");
              const value = valParts.join("=");

              // Default configuration object
              const cookieOptions: Record<string, unknown> = {
                name: name.trim(),
                value: value.trim(),
                httpOnly: true,
                secure: process.env.NODE_ENV === "production",
                path: "/",
                sameSite: "lax",
              };

              // Parse remaining options (Max-Age, Expires, Path, SameSite, etc.)
              parts.slice(1).forEach((part) => {
                const [optKey, ...optValParts] = part.split("=");
                const optVal = optValParts.join("=");
                const keyLower = optKey.toLowerCase();

                if (keyLower === "max-age" && optVal) {
                  cookieOptions.maxAge = parseInt(optVal, 10);
                } else if (keyLower === "expires" && optVal) {
                  cookieOptions.expires = new Date(optVal);
                } else if (keyLower === "path" && optVal) {
                  cookieOptions.path = optVal;
                } else if (keyLower === "samesite" && optVal) {
                  cookieOptions.sameSite = optVal.toLowerCase() as
                    | "lax"
                    | "strict"
                    | "none";
                } else if (keyLower === "httponly") {
                  cookieOptions.httpOnly = true;
                } else if (keyLower === "secure") {
                  cookieOptions.secure = true;
                }
              });

              // Write complete cookie configuration into Next.js cookie jar
              // eslint-disable-next-line @typescript-eslint/no-explicit-any
              cookieStore.set(cookieOptions as any);
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
