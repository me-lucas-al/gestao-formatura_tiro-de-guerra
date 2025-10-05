import { NextResponse } from "next/server";
import type { NextRequest } from "next/server";

export function middleware(req: NextRequest) {
  const token = req.cookies.get("token")?.value;

  // Bloqueia acesso ao dashboard se não estiver logado
  if (!token && req.nextUrl.pathname.startsWith("/authenticated")) {
    return NextResponse.redirect(new URL("/", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/authenticated/:path*"],
};
