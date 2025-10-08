import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";
import * as jose from "jose";

export async function middleware(req: NextRequest) {
  const protectedRoutes = ["/dashboard"];
  const currentPath = req.nextUrl.pathname;

  const isProtectedRoute = protectedRoutes.some((path) =>
    currentPath.startsWith(path)
  );

  if (isProtectedRoute) {
    const token = req.cookies.get("token")?.value;

    if (!token) {
      return NextResponse.redirect(new URL("/", req.url));
    }

    try {
      const secret = new TextEncoder().encode(process.env.JWT_SECRET!);
      await jose.jwtVerify(token, secret);
      return NextResponse.next();
    } catch (err) {
      console.error("❌ Token inválido:", err);
      const response = NextResponse.redirect(new URL("/", req.url));
      response.cookies.delete("token");
      return response;
    }
  }

  return NextResponse.next();
}