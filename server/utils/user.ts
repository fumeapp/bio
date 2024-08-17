import crypto from 'node:crypto'
import type { Prisma } from '@prisma/client'
import type { H3Event } from 'h3'
import prisma from './prisma'
import type { User, UserPayload } from '~/types/models'
import type { TokenLocation, UserInfo } from '~/types/oauth'

export const createUser = async (info: UserInfo, provider: string, oauthPayload: any, event?: H3Event): Promise<User> => {
  let user: User | null = null

  user = await prisma.user.findUnique({
    where: {
      email: info.email,
    },
  }) as unknown as User

  if (!user)
    user = await prisma.user.create({
      data: {
        email: info.email,
        name: info.name,
        avatar: info.avatar,
        payload: (info.payload ? info.payload : ({ roles: { admin: false } } as UserPayload)) as unknown as Prisma.JsonObject,
        providers: {
          create: [
            {

              name: provider,
              avatar: info.avatar,
              payload: oauthPayload as unknown as Prisma.JsonObject,
            },

          ],
        },
      },
    }) as unknown as User
  else
    await prisma.provider.upsert({
      where: {
        userId_name: {
          userId: BigInt(user.id),
          name: provider,
        },
      },
      update: {
        avatar: info.avatar,
        payload: oauthPayload as unknown as Prisma.JsonObject,
      },
      create: {
        userId: BigInt(user.id),
        name: provider,
        avatar: info.avatar,
        payload: oauthPayload as unknown as Prisma.JsonObject,
      },
    })

  const coordinate = event
    ? `${event.node.req.headers['Cloudfront-Viewer-Latitude']} ${event.node.req.headers['Cloudfront-Viewer-Longitude']}`
    : '30.2423 -97.7672'

  const location: TokenLocation = {
    city: event?.node.req.headers['Cloudfront-Viewer-City'] as string || 'Austin',
    region: event?.node.req.headers['Cloudfront-Viewer-Region-Name'] as string || 'TX',
    country: event?.node.req.headers['Cloudfront-Viewer-Country'] as string || 'US',
    timezone: event?.node.req.headers['Cloudfront-Viewer-Timezone'] as string || 'America/Chicago',
    countryName: event?.node.req.headers['Cloudfront-Viewer-CountryName'] as string || 'United States',
  }

  const cfg = useRuntimeConfig(event)

  const token = await prisma.token.create({
    data: {
      userId: BigInt(user.id),
      hash: `${cfg.public.prefix}_${crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex')}`,
      source: `oauth:${provider}`,
      ip: event?.node.req.headers['x-forwarded-for'] as string || '127.0.0.1',
      agent: event?.node.req.headers['user-agent'] as string || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      location: location as unknown as Prisma.JsonObject,
      coordinate,
    },
  })

  user.hash = token.hash
  return user
}
