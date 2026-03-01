import { _timestamps, _uuid } from '../_db'
import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const accounts = sqliteTable('accounts', {
  ..._uuid,

  // Auth
  username: text().unique().notNull(),
  email: text().unique(),
  password: text(), // Nullable for OAuth users
  role: text({ enum: ['admin', 'user'] }).default('user').notNull(),
  emailVerified: integer('email_verified', { mode: 'boolean' }).default(false),

  // Profile (Kept lean)
  name: text(),
  phone: text(),
  avatar: text(),

  // Flexible storage for project-specific extras (bio, phone, preferences, etc)
  data: text({ mode: 'json' }).$type<Record<string, unknown>>().default({}),

  ..._timestamps,
})
