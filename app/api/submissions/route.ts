import { NextResponse } from 'next/server'
import { pool } from '@/lib/db'

export async function POST(request: Request) {
  const body = await request.json()
  const required = ['name', 'birthYear', 'gender', 'phone', 'contactTime', 'wish', 'selectedCard']
  if (required.some((key) => typeof body[key] !== 'string' || !body[key].trim())) {
    return NextResponse.json({ error: 'Missing required fields' }, { status: 400 })
  }
  if (!['Nam', 'Nữ', 'LGBT'].includes(body.gender)) return NextResponse.json({ error: 'Invalid gender' }, { status: 400 })
  await pool.query(
    `insert into public.quiz_submissions (name, birth_year, gender, phone, contact_time, wish, selected_card, reflection, quiz_answers) values ($1,$2,$3,$4,$5,$6,$7,$8,$9)`,
    [body.name.trim(), body.birthYear.trim(), body.gender, body.phone.trim(), body.contactTime.trim(), body.wish.trim(), body.selectedCard.trim(), body.reflection || null, JSON.stringify(body.quizAnswers || {})],
  )
  return NextResponse.json({ ok: true })
}

export async function GET() {
  return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })
}
