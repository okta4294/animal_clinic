// file: src/app/api/auth/login/route.ts
import { NextResponse } from 'next/server'
import prisma from '@/lib/prisma'           // sesuaikan path prisma kamu
import bcrypt from 'bcryptjs'
import jwt from 'jsonwebtoken'

const JWT_SECRET = process.env.JWT_SECRET!
const JWT_EXPIRES_IN = '1d' // token berlaku 1 hari

export async function POST(req: Request) {
  try {
    const { email, password } = await req.json()

    // cari user berdasarkan email
    const user = await prisma.user.findUnique({
      where: { email },
    })

    if (!user) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // cek password pakai bcrypt
    const isPasswordValid = await bcrypt.compare(password, user.password)
    if (!isPasswordValid) {
      return NextResponse.json({ error: 'Invalid credentials' }, { status: 401 })
    }

    // generate token jwt
    const token = jwt.sign({ id: user.id, email: user.email }, JWT_SECRET, {
      expiresIn: JWT_EXPIRES_IN,
    })

    // simpan token di cookie httpOnly
    const response = NextResponse.json({ success: true, user: { id: user.id, email: user.email, name: user.name } })
    response.cookies.set('token', token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === 'production',
      path: '/',
    })

    return response
  } catch (error) {
    console.error(error)
    return NextResponse.json({ error: 'Something went wrong' }, { status: 500 })
  }
}
