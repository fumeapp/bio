import { Prisma } from '@prisma/client'

const include = {
  cartridge: {
    include: {
      shots: {
        orderBy: { date: Prisma.SortOrder.asc },
      },
    },
  },
}
const orderBy = {
  updatedAt: Prisma.SortOrder.asc,
}

export default {
  include,
  orderBy,
}
