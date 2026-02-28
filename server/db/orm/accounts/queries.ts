import type { H3Event } from 'h3'
import type { User } from '#auth-utils'
import { eq, sql } from 'drizzle-orm'

/**
 * Find a single user by criteria
 */
export const get = async (where: Partial<User>) => {
  try {
    let query = db.select().from(schema.users)

    // Dynamically add where conditions
    for (const [key, value] of Object.entries(where)) {
      query = query.where(sql`${sql.identifier(key)} = ${value}`)
    }

    const user = await query.limit(1).get()
    return user || null
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to find user'
    })
  }
}

/**
 * Find user by ID
 */
export const getById = async (id: string) => {
  try {
    return await db.select()
      .from(schema.users)
      .where(eq(schema.users.id, id))
      .get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to find user by ID'
    })
  }
}

/**
 * Find user by email
 */
export const getByEmail = async (email: string) => {
  try {
    return await db.select()
      .from(schema.users)
      .where(eq(schema.users.email, email))
      .get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to find user by email'
    })
  }
}

/**
 * Find user by username
 */
export const getByUsername = async (username: string) => {
  try {
    return await db.select()
      .from(schema.users)
      .where(eq(schema.users.username, username))
      .get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to find user by username'
    })
  }
}

/**
 * Count total users
 */
export const count = async () => {
  try {
    const result = await db.select({ count: sql<number>`COUNT(*)` })
      .from(schema.users)
      .then((res: any) => res[0]?.count ?? 0)

    return result
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to count users'
    })
  }
}

/**
 * List all users with pagination
 */
export const all = async (options: { page?: number, limit?: number } = {}) => {
  const { page = 1, limit = 50 } = options
  const offset = (page - 1) * limit

  try {
    return await db.select()
      .from(schema.users)
      .limit(limit)
      .offset(offset)
      .all()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to list users'
    })
  }
}

/**
 * Get user profile by ID with session validation
 * Clears session if user not found
 */
export const getProfile = async ({ userId, event }: { userId: string, event: H3Event }) => {
  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.id, userId))
    .get()

  if (!user) {
    await clearUserSession(event)
    throw createError({ status: 404, statusText: 'User not found' })
  }

  return user
}
