import { sql } from 'drizzle-orm'

export default defineEventHandler(async (event) => {
  await requireUserSession(event)

  const start = performance.now()
  const db = useDb()

  try {
    await db.execute(sql`SELECT 1`)
    const duration = Math.round(performance.now() - start)

    return {
      database: {
        status: 'connected',
        latency: duration,
      },
    }
  }
  catch (error: any) {
    return {
      database: {
        status: 'disconnected',
        error: error.message,
        latency: -1,
      },
    }
  }
})
