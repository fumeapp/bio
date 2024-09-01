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

function update({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

function remove({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

export const policies = {
  pen: {
    index,
    create,
    get,
    update,
    remove,
  },
}
