import { auth } from '@/config/auth'
import { NextResponse } from 'next/server'

const authRoutes = ['/login']
const publicRoutes = ['/public', '/review']

const apiAuthPrefix = '/api/auth'

export default auth((req) => {
  const { nextUrl } = req
  const isLoggedIn = !!req.auth

  if (nextUrl.pathname.startsWith(apiAuthPrefix)) {
    return NextResponse.next()
  }

  if (isLoggedIn && authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/dashboard', nextUrl))
  }

  if (
    publicRoutes.includes(nextUrl.pathname) ||
    nextUrl.pathname.startsWith('/public') ||
    nextUrl.pathname.startsWith('/review')
  ) {
    return NextResponse.next()
  }

  if (!isLoggedIn && !authRoutes.includes(nextUrl.pathname)) {
    return NextResponse.redirect(new URL('/login', nextUrl))
  }
  return NextResponse.next()
})

export const config = {
  matcher: ['/((?!.*\\..*|_next).*)', '/', '/(api|trpc)(.*)']
}
