import { withAuth } from "next-auth/middleware";
import { NextResponse } from "next/server";

export default function middleware(req: any, event: any) {
  // Edge runtime polyfill for Vercel
  if (!process.env.NEXTAUTH_URL) {
    process.env.NEXTAUTH_URL = `https://${process.env.VERCEL_URL || "accessflow-demo.vercel.app"}`;
  }

  const authMiddleware = withAuth(
    function onSuccess(req) {
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

  return (authMiddleware as any)(req, event);
}

export const config = {
  matcher: ["/((?!api/auth|_next/static|_next/image|favicon.ico|screenshots|login|signup|forgot-password|reset-password|about|projects|.*\\.(?:png|jpg|jpeg|gif|svg|webp)$|$).*)"],
};
