export default eventHandler(async event => {
  const body = await readBody(event)

  if (!body.email || !body.password || !body.username)
    throw createError({ statusCode: 400, statusMessage: 'Email, username, and password are required' })

  // Hash the password securely before passing to the generic ORM
  const hashedPassword = await hashPassword(body.password)

  // Create the new account
  const account = await orm.accounts.create({
    email: body.email,
    username: body.username,
    name: body.name || body.username,
    password: hashedPassword,
    role: 'user',
  })

  // Prevent sending the hashed password back to the client
  const secureAccount = { ...account, password: undefined }

  // Auto-login the user after registration
  await setUserSession(event, { user: secureAccount, loggedInAt: new Date() })

  return sendSuccess(secureAccount, { message: 'Account created successfully' })
})
