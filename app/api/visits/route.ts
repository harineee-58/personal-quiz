import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST() {
  await pool.query('insert into public.page_visits default values')
  return NextResponse.json({ ok: true })
}
