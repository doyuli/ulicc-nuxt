export default defineNuxtRouteMiddleware((to) => {
  const { loggedIn } = useUserSession()

  if (!loggedIn.value) {
    const fullPath = encodeURIComponent(to.fullPath)
    return navigateTo(`/admin/login?redirect=${fullPath}`)
  }
})
