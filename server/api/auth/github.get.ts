export default defineOAuthGitHubEventHandler({
  async onSuccess(event, { user }) {
    await setUserSession(event, {
      user: {
        role: 'authorized_visitor',
        type: 'github',
        githubId: user.id,
        avatar: user.avatar_url,
        username: user.name,
      },
      loggedInAt: new Date().toISOString(),
    })
    return sendRedirect(event, '/chat')
  },
  onError(event) {
    return sendRedirect(event, '/')
  },
})
