import type { Prisma } from '@prisma/client'
import type { UserPayload } from '~/types/models'

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

export const extend = {
  admin,
}
