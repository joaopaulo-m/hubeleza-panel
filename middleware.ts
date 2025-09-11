import { NextRequest, NextResponse } from "next/server";
import { jwtVerify } from "jose";

import { AccountType } from "./types/enums/account-type";
import { logout } from "./lib/api/actions/auth";

interface JwtPayload {
  account_id: string;
  account_type: AccountType;
}

function getSecretKey() {
  const secret = process.env.JWT_SECRET;
  if (!secret) throw new Error("JWT_SECRET não definida no ambiente");
  return new TextEncoder().encode(secret);
}

const PUBLIC_PATHS = ["/auth", "/sign-up", "/define-password"];
const ADMIN_PATHS = ["/dashboard", "/forms", "/invites", "/partners", "/treatments", "/operators"];
const PARTNER_PREFIX = "/partner/";

export async function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // 1 - Rotas públicas
  if (PUBLIC_PATHS.includes(pathname)) {
    return NextResponse.next();
  }

  // 2 - Token
  const token = req.cookies.get("access-token")?.value;
  if (!token) {
    // Se não autenticado e tentar acessar / → vai para /auth
    if (pathname === "/") {
      return NextResponse.redirect(new URL("/auth", req.url));
    }
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 3 - Verificação
  let payload: JwtPayload;
  try {
    const { payload: verifiedPayload } = await jwtVerify(token, getSecretKey());
    payload = verifiedPayload as unknown as JwtPayload; // duplo cast
  } catch {
    logout()
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 4 - Regra especial para "/"
  if (pathname === "/") {
    if (payload.account_type === AccountType.ADMIN || payload.account_type === AccountType.OPERATOR) {
      return NextResponse.redirect(new URL("/dashboard", req.url));
    }
    if (payload.account_type === AccountType.PARTNER) {
      return NextResponse.redirect(new URL("/partner/home", req.url));
    }
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  // 5 - Regras de acesso por tipo
  if (ADMIN_PATHS.includes(pathname) && (payload.account_type !== AccountType.ADMIN && payload.account_type !== AccountType.OPERATOR)) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  if (pathname.startsWith(PARTNER_PREFIX) && payload.account_type !== AccountType.PARTNER) {
    return NextResponse.redirect(new URL("/auth", req.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    "/((?!_next/static|_next/image|favicon.ico|.*\\.(?:png|jpg|jpeg|svg|webp|gif|ico)$).*)",
  ],
};
