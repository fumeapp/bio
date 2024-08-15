import { z } from 'zod'
import type { User } from '~/types/models'
import { eventModelHandler } from '~~/server/utils/handlers'

const index = defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  if (!user.isAdmin) return metapi().notFound(event)
  return metapi().render(
    await prisma.user.findMany({
      include: {
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
      },
    }),
  )
})

const get = eventModelHandler<User>(async ({ user, event, model }) => {
  return metapi().renderNullError(event, model)
}, { admin: true, bindUser: false })

export default {
  index,
  get,
}
