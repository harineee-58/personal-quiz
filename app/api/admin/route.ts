import { NextResponse } from 'next/server'
import { count, desc, eq, sql } from 'drizzle-orm'
import { db } from '@/lib/db'
import { quizFeedback, quizSessions, quizViews } from '@/lib/schema'

function authorized(request: Request) {
  const expected = process.env.ADMIN_PASSWORD
  const provided = request.headers.get('x-admin-password')
  return Boolean(expected && provided && provided === expected)
}

export async function GET(request: Request) {
  if (!authorized(request)) return NextResponse.json({ error: 'Unauthorized' }, { status: 401 })

  try {
    const url = new URL(request.url)
    const requestedPage = Number.parseInt(url.searchParams.get('page') ?? '1', 10)
    const page = Number.isFinite(requestedPage) && requestedPage > 0 ? requestedPage : 1
    const pageSize = 10
    const offset = (page - 1) * pageSize
    const [viewCount] = await db.select({ value: count() }).from(quizViews)
    const [testCount] = await db.select({ value: count() }).from(quizSessions)
    const [feedbackCount] = await db.select({ value: count() }).from(quizFeedback)
    const totalSessions = Number(testCount.value)
    const resultBreakdown = await db.select({ result: quizSessions.primaryResult, value: count() }).from(quizSessions).groupBy(quizSessions.primaryResult).orderBy(desc(count()))
    const recentSessions = await db.select().from(quizSessions).orderBy(desc(quizSessions.createdAt)).limit(pageSize).offset(offset)
    const feedback = await db.select().from(quizFeedback).orderBy(desc(quizFeedback.createdAt)).limit(30)

    return NextResponse.json({
      views: viewCount.value,
      tests: testCount.value,
      feedbackCount: feedbackCount.value,
      page,
      pageSize,
      totalSessions,
      totalPages: Math.max(1, Math.ceil(totalSessions / pageSize)),
      resultBreakdown,
      recentSessions,
      feedback,
    })
  } catch (error) {
    console.error('[v0] admin analytics failed', error)
    return NextResponse.json({ error: 'Analytics unavailable.' }, { status: 500 })
  }
}
