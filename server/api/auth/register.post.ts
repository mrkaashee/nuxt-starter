export default defineEventHandler(async event => {
  const { email, password } = await readBody(event)

  const hashedPassword = await hashPassword(password)

  await db.insert(schema.users)
    .values({ email, password: hashedPassword })
    .onConflictDoNothing()

  return 'success'
})
