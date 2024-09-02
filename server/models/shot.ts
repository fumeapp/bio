import { Prisma } from '@prisma/client'

export const include = {
  cartridge: {
    include: {
      pen: true,
    },
  },
}

export const orderBy = {
  date: Prisma.SortOrder.asc,
}
