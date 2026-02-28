import { sql } from 'drizzle-orm'
import { int, text } from 'drizzle-orm/sqlite-core'
import { v7 as uuid7 } from 'uuid'

const now = sql`(strftime('%Y-%m-%dT%H:%M:%fZ','now'))`

export const _id = {
  get id() { return int().primaryKey({ autoIncrement: true }) },
}

export const _uuid = {
  get id() { return text('id').primaryKey().$defaultFn(() => uuid7()) },
}

export const _timestamps = {
  get createdAt() { return text('created_at').default(now) },
  get updatedAt() {
    return text('updated_at').default(now).$onUpdate(() => now)
  },
}
