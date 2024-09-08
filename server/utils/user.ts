import crypto from 'node:crypto'
import type { H3Event } from 'h3'
import type { User, UserPayload } from '~/types/models'
import type { TokenLocation, UserInfo } from '~/types/oauth'

export const createUser = async (info: UserInfo, provider: string, oauthPayload: any, event: H3Event): Promise<User> => {
  let user: User | null = null

  user = await usePrisma(event).user.upsert({
    where: { email: info.email },
    create: {
      email: info.email,
      name: info.name,
      avatar: info.avatar,
      payload: (info.payload ? JSON.stringify(info.payload) : JSON.stringify({ roles: { admin: false } })),
      providers: {
        create: [
          {

            name: provider,
            avatar: info.avatar,
            payload: JSON.stringify(oauthPayload),
          },

        ],
      },
    },
    update: {},
  }) as unknown as User

  await usePrisma(event).provider.upsert({
    where: {
      userId_name: {
        userId: user.id,
        name: provider,
      },
    },
    update: {
      avatar: info.avatar,
      payload: JSON.stringify(oauthPayload),
    },
    create: {
      userId: user.id,
      name: provider,
      avatar: info.avatar,
      payload: JSON.stringify(oauthPayload),
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

  const token = await usePrisma(event).token.create({
    data: {
      userId: user.id,
      hash: `${cfg.public.prefix}_${crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex')}`,
      source: `oauth:${provider}`,
      ip: event?.node.req.headers['x-forwarded-for'] as string || '127.0.0.1',
      agent: event?.node.req.headers['user-agent'] as string || 'Mozilla/5.0 (Macintosh; Intel Mac OS X 10_15_7) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/127.0.0.0 Safari/537.36',
      location: JSON.stringify(location),
      coordinate,
    },
  })

  user.hash = token.hash
  return user
}
