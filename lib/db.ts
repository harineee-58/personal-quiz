import { Pool } from 'pg'

const globalForDb = globalThis as unknown as { poolV4?: Pool }

function databaseConnectionString() {
  const value = process.env.POSTGRES_URL
  if (!value) return value
  return value.replace(/([?&])sslmode=[^&]*&?/i, '$1').replace(/[?&]$/, '')
}

export const pool = globalForDb.poolV4 ?? new Pool({ connectionString: databaseConnectionString(), ssl: { rejectUnauthorized: false } })

if (process.env.NODE_ENV !== 'production') globalForDb.poolV4 = pool
