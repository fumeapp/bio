import type { Cartridge, User } from '~/types/models'

function index({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function create({ user, authed }: { user: User, authed: User }) {
  return authed.isAdmin || authed.id === user.id
}

function get({ user, cartridge }: { user: User, cartridge: Cartridge }) {
  return user.isAdmin || user.id === cartridge.userId
}

function update({ user, cartridge }: { user: User, cartridge: Cartridge }) {
  return user.isAdmin || user.id.toString() === cartridge.userId.toString()
}

function remove({ user, cartridge }: { user: User, cartridge: Cartridge }) {
  return user.isAdmin || user.id.toString() === cartridge.userId.toString()
}

export const cartridge = {
  index,
  create,
  get,
  update,
  remove,
}
