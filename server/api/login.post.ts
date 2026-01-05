export default defineEventHandler(async (event) => {
  const { code } = await readBody(event)
  const config = useRuntimeConfig()

  if (code === config.siteAccessCode) {
    await setUserSession(event, {
      user: {
        role: 'authorized_visitor',
      },
      loggedInAt: new Date().toISOString(),
    })
    return { success: true }
  }

  throw createError({
    statusCode: 401,
    message: '验证失败，请检查代码是否正确',
  })
})
