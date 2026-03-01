// import { count as drizzleCount, desc, eq, sql } from 'drizzle-orm'

// /**
//  * Find a single account by criteria
//  */
// export const get = async (where: Partial<typeof schema.accounts.$inferSelect>) => {
//   try {
//     let query = db.select().from(schema.accounts)

//     // Dynamically add where conditions
//     for (const [key, value] of Object.entries(where)) {
//       query = query.where(sql`${sql.identifier(key)} = ${value}`)
//     }

//     const account = await query.limit(1).get()
//     return account || null
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to find account'
//     })
//   }
// }

// /**
//  * Find account by ID
//  */
// export const getById = async (id: string) => {
//   try {
//     return await db.select()
//       .from(schema.accounts)
//       .where(eq(schema.accounts.id, id))
//       .get()
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to find account by ID'
//     })
//   }
// }

// /**
//  * Find account by email
//  */
// export const getByEmail = async (email: string) => {
//   try {
//     return await db.select()
//       .from(schema.accounts)
//       .where(eq(schema.accounts.email, email))
//       .get()
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to find account by email'
//     })
//   }
// }

// /**
//  * Find account by username
//  */
// export const getByUsername = async (username: string) => {
//   try {
//     return await db.select()
//       .from(schema.accounts)
//       .where(eq(schema.accounts.username, username))
//       .get()
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to find account by username'
//     })
//   }
// }

// /**
//  * Count total accounts
//  */
// export const countTotal = async () => {
//   try {
//     const result = await db.select({ value: drizzleCount() })
//       .from(schema.accounts)

//     return result[0]?.value ?? 0
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to count accounts'
//     })
//   }
// }

// /**
//  * List all accounts with pagination
//  */
// export const all = async (options: { page?: number, limit?: number } = {}) => {
//   const { page = 1, limit = 50 } = options
//   const offset = (page - 1) * limit

//   try {
//     return await db.select()
//       .from(schema.accounts)
//       .orderBy(desc(schema.accounts.createdAt))
//       .limit(limit)
//       .offset(offset)
//       .all()
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to list accounts'
//     })
//   }
// }

// /**
//  * Get account profile by ID
//  */
// export const getProfile = async (accountId: string) => {
//   const account = await db
//     .select()
//     .from(schema.accounts)
//     .where(eq(schema.accounts.id, accountId))
//     .get()

//   if (!account) {
//     throw createError({ status: 404, statusText: 'Account not found' })
//   }

//   return account
// }
