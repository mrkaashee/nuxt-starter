export default defineEventHandler(async (event) => {
  const { email, password } = await readBody(event)

  const dbUser = await db.select().from(schema.users).where(eq(schema.users.email, email)).get()
  const isVerified = await verifyPassword(dbUser.password, password)

  if (isVerified) {
    await setUserSession(event, {
      user: { id: 1, email },
    })

    return "success"
  } else {
    return "Not Found"
  }
})
