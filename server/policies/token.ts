import type { Token, User } from '~/types/models'

function get({ authed, token }: { authed: User, token: Token }) {
  return authed.isAdmin || authed.id === token.userId
}

function remove({ authed, token }: { authed: User, token: Token }) {
  return authed.isAdmin || authed.id === token.userId
}

export const token = {
  get,
  remove,
}
