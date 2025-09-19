import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { jwtVerify } from 'jose';

const JWT_SECRET = new TextEncoder().encode(process.env.JWT_SECRET!);

export async function middleware(req: NextRequest) {
  const token = req.cookies.get('token')?.value;

  console.log('Middleware token:', token);

  // jika tidak ada token, redirect ke /login
  if (!token) {
    console.log('No token found, redirecting to /login');
    return NextResponse.redirect(new URL('/login', req.url));
  }

  try {
    await jwtVerify(token, JWT_SECRET);
    return NextResponse.next(); // token valid, lanjut
  } catch (err) {
    console.log('Invalid token, redirecting to /login', err);
    return NextResponse.redirect(new URL('/login', req.url));
  }
}

// Tentukan route yang butuh proteksi
export const config = {
  matcher: ['/dashboard/:path*', '/profile/:path*'],
};
