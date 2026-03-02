export default eventHandler(async event => {
  const body = await readBody(event)

  // Validate request body using schemas
  schemas.accounts.register.parse(body)

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
