import { neon } from '@neondatabase/serverless'
import { drizzle } from 'drizzle-orm/neon-http'
import { customAlphabet } from 'nanoid'
import * as schema from '../db/schema'

export function useDb() {
  const config = useRuntimeConfig()
  const sql = neon(config.databaseUrl)
  return drizzle(sql, { schema })
}

export const nanoid = customAlphabet('abcdefghijklmnopqrstuvwxyz0123456789')
