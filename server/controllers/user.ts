import type { User } from '~/types/models'

const index = authedHandler(async () => {
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
}, true)

const get = authedModelHandler<User>(async ({ event, model }) => {
  return metapi().renderNullError(event, model)
}, { admin: true, bindUser: false })

export default {
  index,
  get,
}
