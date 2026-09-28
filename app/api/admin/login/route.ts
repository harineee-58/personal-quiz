import { NextResponse } from 'next/server'
import { createHmac, timingSafeEqual } from 'crypto'

const cookieName = 'tarot_admin'
function token() { return createHmac('sha256', process.env.ADMIN_PASSWORD || '').update('tarot-admin').digest('hex') }

export async function POST(request: Request) {
  const { password } = await request.json()
  if (typeof password !== 'string' || !process.env.ADMIN_PASSWORD || password !== process.env.ADMIN_PASSWORD) return NextResponse.json({ error: 'Mật khẩu không đúng' }, { status: 401 })
  const response = NextResponse.json({ ok: true })
  response.cookies.set(cookieName, token(), { httpOnly: true, secure: process.env.NODE_ENV === 'production', sameSite: 'lax', path: '/', maxAge: 60 * 60 * 8 })
  return response
}

export function isValidAdmin(value: string | undefined) {
  if (!value) return false
  const expected = Buffer.from(token())
  const actual = Buffer.from(value)
  return expected.length === actual.length && timingSafeEqual(expected, actual)
}
