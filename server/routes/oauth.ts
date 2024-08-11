import crypto from 'node:crypto'
import type { Prisma, User } from '@prisma/client'
import type { OAuthPayload, TokenLocation } from '~/types/oauth'
import { cookieOptions } from '~/utils/shared'
import type { UserPayload } from '~/types/models'

const redirect = defineEventHandler(async (event) => {
  const provider = oauthProvider(event.context.params?.provider, useRuntimeConfig(event))
  if (!provider) return metapi().error(event, 'Provider not supported')
  return await sendRedirect(event, oauthClient(provider).authorizationUrl({ scope: provider.scope }), 302)
})

const callback = defineEventHandler(async (event) => {
  const cfg = useRuntimeConfig(event)
  const provider = oauthProvider(event.context.params?.provider, cfg)
  if (!provider) return metapi().error(event, 'Provider not supported')
  const userPayload = await getUser(provider, event.node.req)

  let user: User | null = null

  user = await prisma.user.findUnique({
    where: {
      email: userPayload.info.email,
    },
  })

  if (!user)
    user = await prisma.user.create({
      data: {
        email: userPayload.info.email,
        name: userPayload.info.name,
        avatar: userPayload.info.avatar,
        payload: ({ roles: { admin: false } } as UserPayload) as unknown as Prisma.JsonObject,
        providers: {
          create: [
            {

              name: provider.name,
              avatar: userPayload.info.avatar,
              payload: userPayload.payload as unknown as Prisma.JsonObject,
            },

          ],
        },
      },
    })
  else
    await prisma.provider.upsert({
      where: {
        userId_name: {
          userId: BigInt(user.id),
          name: provider.name,
        },
      },
      update: {
        avatar: userPayload.info.avatar,
        payload: userPayload.payload as unknown as Prisma.JsonObject,
      },
      create: {
        userId: BigInt(user.id),
        name: provider.name,
        avatar: userPayload.info.avatar,
        payload: userPayload.payload as unknown as Prisma.JsonObject,
      },
    })

  const coordinate = `${event.node.req.headers['Cloudfront-Viewer-Latitude']} ${event.node.req.headers['Cloudfront-Viewer-Longitude']}`

  const location: TokenLocation = {
    city: event.node.req.headers['Cloudfront-Viewer-City'] as string || 'Austin',
    region: event.node.req.headers['Cloudfront-Viewer-Region-Name'] as string || 'TX',
    country: event.node.req.headers['Cloudfront-Viewer-Country'] as string || 'US',
    timezone: event.node.req.headers['Cloudfront-Viewer-Timezone'] as string || 'America/Chicago',
    countryName: event.node.req.headers['Cloudfront-Viewer-CountryName'] as string || 'United States',
  }

  const token = await prisma.token.create({
    data: {
      userId: BigInt(user.id),
      hash: `${cfg.public.prefix}_${crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex')}`,
      source: `oauth:${provider.name}`,
      ip: event.node.req.headers['x-forwarded-for'] as string,
      agent: event.node.req.headers['user-agent'] as string,
      location: location as unknown as Prisma.JsonObject,
      coordinate: coordinate === 'undefined undefined' ? '30.2423 -97.7672' : coordinate,
    },
  })

  setCookie(event, 'token', token.hash, cookieOptions)

  event.node.res.setHeader('Content-Type', 'text/html')
  event.node.res.end(`<html><head><script> window.opener.postMessage(${JSON.stringify({ user, token: token.hash })}, '*'); window.close(); </script></head></html>`)
})

export default {
  redirect,
  callback,
}
