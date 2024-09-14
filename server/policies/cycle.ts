import type { User } from '~/types/models'

function index({ authed }: { authed: User }) {
  return authed.isAdmin
}

function create({ authed }: { authed: User }) {
  return authed.isAdmin
}

function get({ authed }: { authed: User }) {
  return authed.isAdmin
}

function update({ authed }: { authed: User }) {
  return authed.isAdmin
}

function remove({ authed }: { authed: User }) {
  return authed.isAdmin
}

export const cycle = {
  index,
  create,
  get,
  update,
  remove,
}
