import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizFeedback } from '@/lib/schema'

export async function POST(request: Request) {
  try {
    const body = await request.json()
    const answer = String(body.answer ?? '').trim()
    if (!answer || answer.length > 2000) {
      return NextResponse.json({ error: 'Vui lòng nhập câu trả lời hợp lệ.' }, { status: 400 })
    }

    await db.insert(quizFeedback).values({
      answer,
      sessionId: body.sessionId ? String(body.sessionId) : null,
    })

    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] feedback save failed', error)
    return NextResponse.json({ error: 'Không thể gửi câu trả lời lúc này.' }, { status: 500 })
  }
}
