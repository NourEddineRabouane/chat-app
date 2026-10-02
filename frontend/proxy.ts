import { NextResponse, type NextRequest } from "next/server";

const SESSION_COOKIE_PREFIXES = [
  "next-auth.session-token",
  "__Secure-next-auth.session-token",
];

function clearNextAuthSession(request: NextRequest, response: NextResponse) {
  for (const { name } of request.cookies.getAll()) {
    if (SESSION_COOKIE_PREFIXES.some((prefix) => name.startsWith(prefix))) {
      response.cookies.set(name, "", {
        maxAge: 0,
        path: "/",
        httpOnly: true,
        // Browsers reject a __Secure- cookie that isn't sent with the Secure flag,
        // even when it's only being deleted.
        secure: name.startsWith("__Secure-"),
      });
    }
  }
  return response;
}

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const token = request.cookies.get("accessToken")?.value;

  const isAuthPage =
    pathname.startsWith("/login") || pathname.startsWith("/signup");

  // No backend token = not authenticated. Drop the leftover NextAuth session so the UI
  // (navbar, useSession, getServerSession) stops thinking the user is logged in.
  if (!token) {
    const response = isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL("/login", request.url));
    return clearNextAuthSession(request, response);
  }

  // Already authenticated user trying to access /login or /signup
  if (isAuthPage) {
    return NextResponse.redirect(new URL("/", request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    /*
     * Match all requests except Next internals, API routes and static assets.
     * Image files are excluded so /logo.svg and /icon.svg still load on the login page
     * (before, the proxy would redirect them to /login).
     */
    "/((?!api|_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico)$).*)",
  ],
};
