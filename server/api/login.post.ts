import { USER_ROLE_ENUM } from '~~/server/constants'

export default defineEventHandler(async (event) => {
  const { code } = await readBody(event)
  const config = useRuntimeConfig()

  await new Promise(resolve => setTimeout(resolve, 1000))

  if (code === config.siteAccessCode.toString()) {
    await setUserSession(event, {
      user: {
        role: USER_ROLE_ENUM.AUTHORIZED_VISITOR,
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
