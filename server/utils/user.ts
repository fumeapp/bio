import type { H3Event } from 'h3'
import { usePrisma } from '~/../server/utils/prisma'
import type { User } from '~/types/models'
import type { TokenLocation, UserInfo } from '~/types/oauth'

export const userFromEmail = async (email: string): Promise<User> => await usePrisma().user.findUnique({
  where: {
    email,
  },
}) as User

const getCoordinate = (event?: H3Event): string => {
  if (event?.node.req.headers['Cloudfront-Viewer-Latitude'] && event?.node.req.headers['Cloudfront-Viewer-Longitude'])
    return `${event.node.req.headers['Cloudfront-Viewer-Latitude']} ${event.node.req.headers['Cloudfront-Viewer-Longitude']}`

  if (event?.node.req.headers['cf-iplatitude'] && event?.node.req.headers['cf-iplongitude'])
    return `${event.node.req.headers['cf-iplatitude']} ${event.node.req.headers['cf-iplongitude']}`

  return '30.2423 -97.7672'
}

export const createSession = async (provider: string, user: User, event?: H3Event) => {
  const coordinate = getCoordinate(event)

  const location: TokenLocation = {
    city: event?.node.req.headers['Cloudfront-Viewer-City'] as string
      || event?.node.req.headers['cf-ipcity'] as string
      || 'Austin',
    region: event?.node.req.headers['Cloudfront-Viewer-Region-Name'] as string
      || event?.node.req.headers['cf-region-code'] as string
      || 'TX',
    country: event?.node.req.headers['Cloudfront-Viewer-Country'] as string
      || event?.node.req.headers['cf-ipcountry'] as string
      || 'US',
    timezone: event?.node.req.headers['Cloudfront-Viewer-Timezone'] as string
      || event?.node.req.headers['cf-timezone'] as string
      || 'America/Chicago',
  }

  const cfg = useRuntimeConfig(event)

  const token = await usePrisma(event).token.create({
    data: {
      userId: user.id,
      hash: `${cfg.public.prefix}_${generateHash(64)}`,
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

export const createUser = async (info: UserInfo, provider: string, oauthPayload: any, event?: H3Event): Promise<User> => {
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
    update: {
    },
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

  return createSession(provider, user, event)
}

function generateHash(length: number): string {
  const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789'
  let result = ''
  const charactersLength = characters.length
  for (let i = 0; i < length; i++)
    result += characters.charAt(Math.floor(Math.random() * charactersLength))

  return result
}
