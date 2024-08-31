import type { Pen, User } from '~/types/models'

function index({ user, userId }: { user: User, userId: number }) {
  return user.isAdmin || user.id === BigInt(userId)
}

function create({ user, userId }: { user: User, userId: number }) {
  return user.isAdmin || user.id === BigInt(userId)
}

function get({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

function update({ user, userId, pen }: { user: User, userId: bigint, pen: Pen }) {
  return user.isAdmin || userId === pen.userId
}

function remove({ user, pen }: { user: User, pen: Pen }) {
  return user.isAdmin || user.id.toString() === pen.userId.toString()
}

export const penPolicy = {
  index,
  create,
  get,
  update,
  remove,
}
