import type { Pen, User } from '~/types/models'

function get({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

function update({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

function remove({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

export const penPolicy = {
  get,
  update,
  remove,
}
