import { NextResponse } from 'next/server';
import jwt from 'jsonwebtoken';

const JWT_SECRET = process.env.JWT_SECRET!; // simpan di .env
const JWT_EXPIRES_IN = '1d'; // default 1 jam

export async function POST(req: Request) {
  const { email, password } = await req.json();

  // Validasi login (dummy check)
  if (email === 'test@example.com' && password === '123456') {
    // generate token
    const token = jwt.sign({ email }, JWT_SECRET, { expiresIn: JWT_EXPIRES_IN });

    // simpan ke cookie httpOnly
    const response = NextResponse.json({ success: true });
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    });

    return response;
  }

  return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 });
}
