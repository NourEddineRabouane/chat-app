// middleware.ts
import { NextResponse, type NextRequest } from "next/server";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;
  // console.log(token);
  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");
  console.log("__________________", pathname);
  // Unauthenticated user trying to access a protected page -> redirect to /login
  if (!token && !isAuthPage) {
    return NextResponse.redirect(new URL("/login", request.url));
  }

  // Already authenticated user trying to access /login or /signup -> redirect to /chat
  if (token && isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all requests except static files and API endpoints
     */
    "/((?!api|_next/static|_next/image|favicon.ico).*)",
  ],
};
