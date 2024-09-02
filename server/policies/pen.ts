import type { Pen, User } from '~/types/models'

function index({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function create({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function get({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id === pen.userId
}

function update({ authed, pen }: { authed: User, pen: Pen }) {
  return authed.isAdmin || authed.id === pen.userId
}

function remove({ authed, pen }: { authed: User, pen: Pen }) {
  return authed.isAdmin || authed.id === pen.userId
}

export const pen = {
  index,
  create,
  get,
  update,
  remove,
}
