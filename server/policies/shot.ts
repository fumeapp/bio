import type { Shot, User } from '~/types/models'

function index({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function create({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function get({ user, shot }: { user: User, shot: Shot }) {
  return user.isAdmin || user.id === shot.userId
}

function update({ user, shot }: { user: User, shot: Shot }) {
  return user.isAdmin || user.id === shot.userId
}

function remove({ authed, shot }: { authed: User, shot: Shot }) {
  return authed.isAdmin || authed.id === shot.userId
}

export const shot = {
  index,
  create,
  get,
  update,
  remove,
}
