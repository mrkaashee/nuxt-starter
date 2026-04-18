import { sqliteTable, text, integer } from 'drizzle-orm/sqlite-core'

export const users = sqliteTable('users', {
  id: integer().primaryKey({ autoIncrement: true }),
  name: text(),
  email: text().notNull().unique(),
  password: text(),
  googleId: text(),
  avatar: text(),
  createdAt: integer({ mode: 'timestamp' }),
  otpToken: text(),
  otpExpiresAt: integer({ mode: 'timestamp' }),
})
