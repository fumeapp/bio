import type { User } from '~/types/models'

function index({ authed }: { authed: User }) {
  return authed.isAdmin
}

export const user = {
  index,
}
