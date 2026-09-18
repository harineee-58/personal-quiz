import { sql } from 'drizzle-orm'
import { integer, jsonb, pgTable, text, timestamp, uuid } from 'drizzle-orm/pg-core'

export const quizSessions = pgTable('quiz_sessions', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  favoriteName: text('favorite_name').notNull(),
  age: integer('age'),
  answers: jsonb('answers').notNull(),
  primaryResult: text('primary_result').notNull(),
  secondaryResult: text('secondary_result'),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const quizFeedback = pgTable('quiz_feedback', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  sessionId: uuid('session_id').references(() => quizSessions.id),
  answer: text('answer').notNull(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})

export const quizViews = pgTable('quiz_views', {
  id: uuid('id').default(sql`gen_random_uuid()`).primaryKey(),
  createdAt: timestamp('created_at', { withTimezone: true }).defaultNow().notNull(),
})
