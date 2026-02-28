/**
 * Create a new user
 */
export const create = async (user: NewAccount) => {
  try {
    if (!user.password) {
      throw createError({ status: 400, statusText: 'Password is required' })
    }
    const hashedPassword = await hashPassword(user.password)
    user.password = hashedPassword

    const createdUser = await db.insert(schema.users)
      .values(user).onConflictDoNothing()
      .returning().get()

    if (!createdUser) {
      throw createError({
        status: 409,
        statusText: 'A user with this username already exists.'
      })
    }

    return createdUser
  }
  catch (err: unknown) {
    const error = err as Error
    if (error.message?.includes('unique constraint')) {
      throw createError({
        status: 409,
        statusText: 'A user with this username or email already exists.'
      })
    }

    throw createError({
      status: 500,
      statusText: 'Failed to create user',
      message: error.message
    })
  }
}

/**
 * Update user by ID
 */
export const update = async (id: string, data: Partial<Account>) => {
  try {
    const updatedUser = await db.update(schema.users)
      .set(data).where(eq(schema.users.id, id))
      .returning().get()

    if (!updatedUser) {
      throw createError({
        status: 404,
        statusText: 'User not found'
      })
    }

    return updatedUser
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to update user'
    })
  }
}

/**
 * Delete user by ID
 */
export const delById = async (id: string) => {
  try {
    const deletedUser = await db.delete(schema.users)
      .where(eq(schema.users.id, id))
      .returning().get()

    if (!deletedUser) {
      throw createError({
        status: 404,
        statusText: 'User not found'
      })
    }

    return deletedUser
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to delete user'
    })
  }
}

/**
 * Update user password
 */
export const updatePassword = async (id: string, newPassword: string) => {
  try {
    const hashedPassword = await hashPassword(newPassword)

    const updatedUser = await db.update(schema.users)
      .set({ password: hashedPassword })
      .where(eq(schema.users.id, id))
      .returning().get()

    if (!updatedUser) {
      throw createError({
        status: 404,
        statusText: 'User not found'
      })
    }

    return updatedUser
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to update password'
    })
  }
}

/**
 * Verify user email
 */
export const verifyEmail = async (id: string) => {
  try {
    return await db.update(schema.users)
      .set({ isEmailVerified: true })
      .where(eq(schema.users.id, id))
      .returning().get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to verify email'
    })
  }
}

/**
 * Verify user phone
 */
export const verifyPhone = async (id: string) => {
  try {
    return await db.update(schema.users)
      .set({ isPhoneVerified: true })
      .where(eq(schema.users.id, id))
      .returning().get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to verify phone'
    })
  }
}

/**
 * Update user last login timestamp
 */
export const updateLastLogin = async (id: string) => {
  try {
    return await db.update(schema.users)
      .set({ lastLogin: new Date() })
      .where(eq(schema.users.id, id))
      .returning().get()
  }
  catch {
    throw createError({
      status: 500,
      statusText: 'Failed to update last login'
    })
  }
}

/**
 * Update user profile information with validation
 */
export const updateProfile = async (id: string, data: Partial<Account>) => {
  const { username, name, email, phone } = data

  // Get current user data
  const currentUser = await db.query.users.findFirst({
    where: eq(schema.users.id, id) })

  if (!currentUser) {
    throw createError({ status: 404, statusText: 'User not found' })
  }

  // Validation checks
  if (username && username !== currentUser.username) {
    const existingUsername = await db.query.users.findFirst({
      where: and(
        eq(schema.users.username, username.trim()),
        ne(schema.users.id, id)
      )
    })
    if (existingUsername) {
      return {
        success: false,
        available: false,
        message: 'Username already in use',
        field: 'username'
      }
    }
  }

  if (email && email !== currentUser.email) {
    const normalizedEmail = email.toLowerCase().trim()
    const existingEmail = await db.query.users.findFirst({
      where: and(
        eq(schema.users.email, normalizedEmail),
        ne(schema.users.id, id)
      ) })
    if (existingEmail) {
      return {
        success: false,
        available: false,
        message: 'Email already in use',
        field: 'email'
      }
    }
  }

  if (phone && phone !== currentUser.phone) {
    const existingPhone = await db.query.users.findFirst({
      where: and(
        eq(schema.users.phone, phone),
        ne(schema.users.id, id)
      ) })
    if (existingPhone) {
      return {
        success: false,
        available: false,
        message: 'Phone number already in use',
        field: 'phone'
      }
    }
  }

  // Proceed with update
  const result = await db
    .update(schema.users)
    .set({
      username: username ? username.trim() : currentUser.username,
      name,
      email: email ? email.toLowerCase().trim() : currentUser.email,
      phone,
    })
    .where(eq(schema.users.id, id)).returning()

  return { success: true, data: result }
}

/**
 * Update user avatar
 */
export const updateAvatar = async (id: string, file: File) => {
  const existingUser = await db.query.users.findFirst({
    where: eq(schema.users.id, id)
  })

  if (!existingUser) {
    throw createError({ status: 404, statusText: 'User not found' })
  }

  let avatarPath = existingUser.avatar
  if (file && file.size > 0) {
    ensureBlob(file, { maxSize: '2MB', types: ['image'] })
    const { blob } = await import('@nuxthub/blob')
    const blobResult = await blob.put(`user-avatar/${file.name}`, file, { addRandomSuffix: true })
    avatarPath = blobResult.pathname

    if (existingUser.avatar && existingUser.avatar !== avatarPath) {
      await blob.del(existingUser.avatar.replace(/^\/+/, ''))
    }
  }

  const updatedUser = await db.update(schema.users)
    .set({ avatar: avatarPath })
    .where(eq(schema.users.id, id))
    .returning().get()

  return updatedUser
}

/**
 * Delete user avatar
 */
export const deleteAvatar = async (id: string) => {
  const user = await db.query.users.findFirst({
    where: eq(schema.users.id, id) })

  if (!user) {
    throw createError({ status: 404, statusText: 'User not found' })
  }

  const avatarPath = user.avatar
  const result = await db.update(schema.users)
    .set({ avatar: null })
    .where(eq(schema.users.id, id))
    .returning()

  if (avatarPath) {
    const { blob } = await import('@nuxthub/blob')
    try {
      await blob.delete(avatarPath)
    }
    catch {
      // Ignore blob deletion errors
    }
  }

  return result
}
