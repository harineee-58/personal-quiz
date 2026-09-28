import { NextResponse } from 'next/server'
import { cookies } from 'next/headers'
import { pool } from '@/lib/db'
import { isValidAdmin } from '../login/route'

export async function GET() {
  const cookieStore = await cookies()
  if (!isValidAdmin(cookieStore.get('tarot_admin')?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const [submissions, visits] = await Promise.all([
    pool.query('select id, created_at, name, birth_year, gender from public.quiz_submissions order by created_at desc'),
    pool.query('select count(*)::int as count from public.page_visits'),
  ])
  return NextResponse.json({ submissions: submissions.rows, visits: visits.rows[0].count })
}

export async function POST(request: Request) {
  const cookieStore = await cookies()
  if (!isValidAdmin(cookieStore.get('tarot_admin')?.value)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
  const { id } = await request.json()
  const result = await pool.query('select id, created_at, name, birth_year, gender, phone, contact_time, wish, selected_card, reflection, quiz_answers from public.quiz_submissions where id = $1', [id])
  if (!result.rows[0]) return NextResponse.json({ error: 'Not found' }, { status: 404 })
  return NextResponse.json(result.rows[0])
}
