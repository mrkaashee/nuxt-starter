export default defineOAuthGoogleEventHandler({
  config: {},

  async onSuccess(event, { user }) {
    console.log({ user })

    const dbUser = await db
      .select()
      .from(schema.users)
      .where(eq(schema.users.email, user.email))
      .get()
    if (dbUser && !dbUser.googleId) {
      await db
        .update(schema.users)
        .set({ googleId: user.sub })
        .where(eq(schema.users.email, user.email))
    } else {
      await db
        .insert(schema.users)
        .values({ email: user.email, avatar: user.picture, googleId: user.sub })
        .onConflictDoNothing()
    }

    await setUserSession(event, {
      user: {
        id: 1,
        email: user.email,
        googleId: user.id,
        avatar: user.picture,
      },
    })
    return sendRedirect(event, "/")
  },

  // Optional, will return a json error and 401 status code by default
  onError(event, error) {
    console.error("Google OAuth error:", error)
    return sendRedirect(event, "/")
  },
})
