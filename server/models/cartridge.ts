import { Prisma } from '@prisma/client'

export const include = {
  pen: true,
  shots: {
    orderBy: { date: Prisma.SortOrder.asc },
  },
}
export const orderBy = {
  updatedAt: Prisma.SortOrder.asc,
}
