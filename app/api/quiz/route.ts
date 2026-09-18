import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizSessions } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const favoriteName = String(body.favoriteName ?? '').trim()
    const age = Number(body.age)
    if (!favoriteName || favoriteName.length > 120) {
      return NextResponse.json({ error: 'Tên điều yêu thích không hợp lệ.' }, { status: 400 })
    }
    if (!Number.isInteger(age) || age < 1900 || age > new Date().getFullYear()) {
      return NextResponse.json({ error: 'Năm sinh không hợp lệ.' }, { status: 400 })
    }

    const [session] = await db.insert(quizSessions).values({
      favoriteName,
      age,
      answers: body.answers ?? {},
      primaryResult: String(body.primaryResult ?? ''),
      secondaryResult: body.secondaryResult ? String(body.secondaryResult) : null,
    }).returning({ id: quizSessions.id })

    return NextResponse.json({ id: session.id })
  } catch (error) {
    console.error('[v0] quiz session save failed', error)
    return NextResponse.json({ error: 'Không thể lưu kết quả lúc này.' }, { status: 500 })
  }
}
