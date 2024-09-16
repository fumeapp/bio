import type { Round } from '@prisma/client'
import type { User } from '~/types/models'

function index({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function create({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function get({ user, round }: { user: User, round: Round }) {
  return user.isAdmin || user.id === round.userId
}

function update({ authed, round }: { authed: User, round: Round }) {
  return authed.isAdmin || authed.id === round.userId
}

function remove({ authed, round }: { authed: User, round: Round }) {
  return authed.isAdmin || authed.id === round.userId
}

function all({ authed }: { authed: User }) {
  return authed.isAdmin
}

export const round = {
  index,
  create,
  get,
  update,
  remove,
  all,
}
