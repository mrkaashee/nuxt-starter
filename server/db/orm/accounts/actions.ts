// /**
//  * Create a new account
//  */
// export const create = async (account: typeof schema.accounts.$inferInsert) => {
//   try {
//     const createdAccount = await db.insert(schema.accounts)
//       .values(account).onConflictDoNothing()
//       .returning().get()

//     if (!createdAccount) {
//       throw createError({
//         status: 409,
//         statusText: 'An account with this username already exists.'
//       })
//     }

//     return createdAccount
//   }
//   catch (err: unknown) {
//     const error = err as Error
//     if (error.message?.includes('unique constraint')) {
//       throw createError({
//         status: 409,
//         statusText: 'An account with this username or email already exists.'
//       })
//     }

//     throw createError({
//       status: 500,
//       statusText: 'Failed to create account',
//       message: error.message
//     })
//   }
// }

// /**
//  * Update account by ID
//  */
// export const update = async (id: string, data: Partial<typeof schema.accounts.$inferInsert>) => {
//   try {
//     const updatedAccount = await db.update(schema.accounts)
//       .set(data).where(eq(schema.accounts.id, id))
//       .returning().get()

//     if (!updatedAccount) {
//       throw createError({
//         status: 404,
//         statusText: 'Account not found'
//       })
//     }

//     return updatedAccount
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to update account'
//     })
//   }
// }

// /**
//  * Delete account by ID
//  */
// export const delById = async (id: string) => {
//   try {
//     const deletedAccount = await db.delete(schema.accounts)
//       .where(eq(schema.accounts.id, id))
//       .returning().get()

//     if (!deletedAccount) {
//       throw createError({
//         status: 404,
//         statusText: 'Account not found'
//       })
//     }

//     return deletedAccount
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to delete account'
//     })
//   }
// }

// /**
//  * Verify account email
//  */
// export const verifyEmail = async (id: string) => {
//   try {
//     return await db.update(schema.accounts)
//       .set({ emailVerified: true })
//       .where(eq(schema.accounts.id, id))
//       .returning().get()
//   }
//   catch {
//     throw createError({
//       status: 500,
//       statusText: 'Failed to verify email'
//     })
//   }
// }

// /**
//  * Update account profile information with validation
//  */
// export const updateProfile = async (id: string, data: Partial<typeof schema.accounts.$inferSelect>) => {
//   const { username, name, email, phone } = data

//   // Get current account data
//   const currentAccount = await db.query.accounts.findFirst({
//     where: eq(schema.accounts.id, id) })

//   if (!currentAccount) {
//     throw createError({ status: 404, statusText: 'Account not found' })
//   }

//   // Validation checks
//   if (username && username !== currentAccount.username) {
//     const existingUsername = await db.query.accounts.findFirst({
//       where: and(
//         eq(schema.accounts.username, username.trim()),
//         ne(schema.accounts.id, id)
//       )
//     })
//     if (existingUsername) {
//       return {
//         success: false,
//         available: false,
//         message: 'Username already in use',
//         field: 'username'
//       }
//     }
//   }

//   if (email && email !== currentAccount.email) {
//     const normalizedEmail = email.toLowerCase().trim()
//     const existingEmail = await db.query.accounts.findFirst({
//       where: and(
//         eq(schema.accounts.email, normalizedEmail),
//         ne(schema.accounts.id, id)
//       ) })
//     if (existingEmail) {
//       return {
//         success: false,
//         available: false,
//         message: 'Email already in use',
//         field: 'email'
//       }
//     }
//   }

//   if (phone && phone !== currentAccount.phone) {
//     const existingPhone = await db.query.accounts.findFirst({
//       where: and(
//         eq(schema.accounts.phone, phone),
//         ne(schema.accounts.id, id)
//       ) })
//     if (existingPhone) {
//       return {
//         success: false,
//         available: false,
//         message: 'Phone number already in use',
//         field: 'phone'
//       }
//     }
//   }

//   // Proceed with update
//   const result = await db
//     .update(schema.accounts)
//     .set({
//       username: username ? username.trim() : currentAccount.username,
//       name,
//       email: email ? email.toLowerCase().trim() : currentAccount.email,
//       phone,
//     })
//     .where(eq(schema.accounts.id, id)).returning()

//   return { success: true, data: result }
// }

// /**
//  * Update account avatar
//  */
// export const updateAvatar = async (id: string, file: File) => {
//   const existingAccount = await db.query.accounts.findFirst({
//     where: eq(schema.accounts.id, id)
//   })

//   if (!existingAccount) {
//     throw createError({ status: 404, statusText: 'Account not found' })
//   }

//   let avatarPath = existingAccount.avatar
//   if (file && file.size > 0) {
//     ensureBlob(file, { maxSize: '2MB', types: ['image'] })
//     const { blob } = await import('@nuxthub/blob')
//     const blobResult = await blob.put(`account-avatar/${file.name}`, file, { addRandomSuffix: true })
//     avatarPath = blobResult.pathname

//     if (existingAccount.avatar && existingAccount.avatar !== avatarPath) {
//       await blob.del(existingAccount.avatar.replace(/^\/+/, ''))
//     }
//   }

//   const updatedAccount = await db.update(schema.accounts)
//     .set({ avatar: avatarPath })
//     .where(eq(schema.accounts.id, id))
//     .returning().get()

//   return updatedAccount
// }

// /**
//  * Delete account avatar
//  */
// export const deleteAvatar = async (id: string) => {
//   const account = await db.query.accounts.findFirst({
//     where: eq(schema.accounts.id, id) })

//   if (!account) {
//     throw createError({ status: 404, statusText: 'Account not found' })
//   }

//   const avatarPath = account.avatar
//   const result = await db.update(schema.accounts)
//     .set({ avatar: null })
//     .where(eq(schema.accounts.id, id))
//     .returning()

//   if (avatarPath) {
//     const { blob } = await import('@nuxthub/blob')
//     try {
//       await blob.delete(avatarPath)
//     }
//     catch {
//       // Ignore blob deletion errors
//     }
//   }

//   return result
// }
