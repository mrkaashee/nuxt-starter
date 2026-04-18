import sgMail from '@sendgrid/mail'

export default defineEventHandler(async event => {
  const { email } = await readBody(event)

  if (!email) {
    throw createError({ status: 400, message: 'Email is required' })
  }

  const user = await db
    .select()
    .from(schema.users)
    .where(eq(schema.users.email, email))
    .get()

  // Always return success to avoid user enumeration
  if (!user) {
    return { message: 'If that email exists, an OTP has been sent' }
  }

  // Generate 6-digit OTP
  const otp = Math.floor(100000 + Math.random() * 900000).toString()
  const expiresAt = new Date(Date.now() + 10 * 60 * 1000) // 10 minutes

  const hashedOtp = await hashPassword(otp)

  await db
    .update(schema.users)
    .set({ otpToken: hashedOtp, otpExpiresAt: expiresAt })
    .where(eq(schema.users.email, email))

  const config = useRuntimeConfig()
  sgMail.setApiKey(config.sendgridApiKey)

  await sgMail.send({
    to: email,
    from: config.sendgridFromEmail,
    subject: 'Your password reset OTP',
    text: `Your OTP is: ${otp}\n\nIt expires in 10 minutes.`,
    html: `
      <p>Your password reset OTP is:</p>
      <h2 style="letter-spacing: 4px;">${otp}</h2>
      <p>It expires in <strong>10 minutes</strong>. Do not share it with anyone.</p>
    `,
  })

  return { message: 'If that email exists, an OTP has been sent' }
})
