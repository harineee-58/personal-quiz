import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { quizViews } from '@/lib/schema'

export async function POST() {
  try {
    await db.insert(quizViews).values({})
    return NextResponse.json({ ok: true })
  } catch (error) {
    console.error('[v0] view save failed', error)
    return NextResponse.json({ error: 'View tracking unavailable.' }, { status: 500 })
  }
}
