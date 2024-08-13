import { z } from 'zod'

const index = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
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

const get = defineEventHandler(async (event) => {
  if (!middleware.requireAdmin()) return metapi().notFound(event)
  const schema = z.object({ id: z.number() })
  const parsed = schema.safeParse({ id: Number.parseInt(event.context.params?.id as string) })
  if (!parsed.success) return metapi().error(event, parsed.error.issues, 403)

  const user = await prisma.user.findUnique({
    where: {
      id: parsed.data.id,
    },
  })

  return metapi().renderNullError(event, user)
})

export default {
  index,
  get,
}
