export default defineEventHandler(async event => {
  const { email, otp, newPassword } = await readBody(event)

  if (!email || !otp || !newPassword) {
    throw createError({ status: 400, message: 'Email, OTP, and new password are required' })
  }

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .get()

  if (!user || !user.otpToken || !user.otpExpiresAt) {
    throw createError({ status: 400, message: 'Invalid or expired OTP' })
  }

  if (new Date() > user.otpExpiresAt) {
    throw createError({ status: 400, message: 'OTP has expired' })
  }

  const isValid = await verifyPassword(user.otpToken, otp)

  if (!isValid) {
    throw createError({ status: 400, message: 'Invalid OTP' })
  }

  const hashedPassword = await hashPassword(newPassword)

  await db
    .update(schema.users)
    .set({ password: hashedPassword, otpToken: null, otpExpiresAt: null })
    .where(eq(schema.users.email, email))

  return { message: 'Password reset successfully' }
})
