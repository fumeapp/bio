import { Prisma } from '@prisma/client'

export const include = {
  user: true,
}
export const orderBy = {
  updatedAt: Prisma.SortOrder.asc,
}
