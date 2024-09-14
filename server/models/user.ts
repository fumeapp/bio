import type { Prisma } from '@prisma/client'
import type { UserPayload } from '~/types/models'

const payload = {
  name: 'user.payload',
  result: {
    user: {
      payload: {
        needs: {
          payload: true,
        },
        compute({ payload }: { payload: string }) {
          return JSON.parse(payload)
        },
      },
    },
  },
}

const cycles = {
  name: 'user.cycles',
  result: {
    user: {
      cycles: {
        needs: {
          payload: true,
        },
        compute({ payload }: { payload: Prisma.JsonObject }) {
          return (payload as UserPayload).cycles ?? []
        },
      },
    },
  },
}

const admin = {
  name: 'user.admin',
  result: {
    user: {
      isAdmin: {
        needs: {
          payload: true,
        },
        compute({ payload }: { payload: Prisma.JsonObject }) {
          return (payload as UserPayload).roles?.admin ?? false
        },
      },
    },

  },
}

export const include = {
  pens: {
    include: {
      cartridge: {
        include: {
          shots: {
            include: {
              cartridge: true,
            },
          },
        },
      },
    },
  },
}

export const extend = {
  payload,
  admin,
  cycles,
}
