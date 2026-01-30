import { AUTH_REDIRECT_COOKIE, USER_ROLE_ENUM } from '~~/server/constants'
import { AUTH_LOGIN_TYPE } from '~~/shared/constants'

export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    const rawAllowed = useRuntimeConfig().oauthGithubAllowedUsernames || ''

    const allowedUsernames = rawAllowed
      .split(',')
      .map(v => v.trim())
      .filter(Boolean)

    const isAllowed = allowedUsernames.length === 0 || allowedUsernames.includes(user.login)

    if (!isAllowed)
      return sendRedirect(event, '/admin/login?error=unauthorized')

    await setUserSession(event, {
      user: {
        role: USER_ROLE_ENUM.AUTHORIZED_VISITOR,
        type: AUTH_LOGIN_TYPE.GITHUB,
        githubId: user.id,
        avatar: user.avatar_url,
        username: user.login,
      },
      loggedInAt: new Date().toISOString(),
    })

    const redirect = getCookie(event, AUTH_REDIRECT_COOKIE) || '/'
    deleteCookie(event, AUTH_REDIRECT_COOKIE)

    return sendRedirect(event, redirect)
  },
  onError(event) {
    return sendRedirect(event, '/')
  },
})
