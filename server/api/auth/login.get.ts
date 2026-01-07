import { AUTH_REDIRECT_COOKIE } from '~~/server/constants'
import { AUTH_LOGIN_TYPE } from '~~/shared/constants'

export default defineEventHandler(async (event) => {
  const { redirect, type = AUTH_LOGIN_TYPE.GITHUB } = getQuery(event)

  setCookie(event, AUTH_REDIRECT_COOKIE, (redirect as string), {
    maxAge: 300,
    httpOnly: true,
  })

  switch (type) {
    case AUTH_LOGIN_TYPE.GITHUB:
      return sendRedirect(event, '/api/auth/github')
    default:
      return sendRedirect(event, '/')
  }
})
