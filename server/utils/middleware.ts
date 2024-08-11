const requireAuth = () => auth.user() !== undefined
const requireAdmin = () => requireAuth() && auth.user().isAdmin

export const middleware = {
  requireAuth,
  requireAdmin,
}
