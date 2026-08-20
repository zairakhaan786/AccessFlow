import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default withAuth(
  function middleware(req) {
    const { token } = req.nextauth;
    const path = req.nextUrl.pathname;

    // Route-level role enforcement
    if (path.startsWith("/admin") && token?.role !== "BOARD_ADMIN") {
      return NextResponse.redirect(new URL("/", req.url));
    }

    return NextResponse.next();
  },
  {
    secret: process.env.NEXTAUTH_SECRET || "accessflow-super-secret-key-32-chars-long-min-prod",
    callbacks: {
      authorized: ({ token }) => !!token,
    },
    pages: {
      signIn: "/login",
    },
  }
);

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|login|signup).*)"],
};
