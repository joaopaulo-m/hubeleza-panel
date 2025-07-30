import { NextRequest, NextResponse } from 'next/server'

// Páginas que não requerem autenticação
const PUBLIC_PATHS = ['/auth']

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const apiKey = request.cookies.get('api-key')?.value

  const isPublicPath = PUBLIC_PATHS.includes(pathname)

  // Se não estiver autenticado e tentando acessar uma página privada
  if (!apiKey && !isPublicPath) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  // Se estiver autenticado e tentar acessar /auth, redirecionar para /dashboard
  if (apiKey && pathname === '/auth') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  // Se acessar / e estiver autenticado, redirecionar para /dashboard
  if (pathname === '/') {
    return NextResponse.redirect(new URL('/dashboard', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/((?!_next/static|_next/image|favicon.ico).*)'],
}
