import crypto from 'node:crypto'
import fs from 'node:fs'
import { Buffer } from 'node:buffer'
import type { EventHandlerRequest, H3Event } from 'h3'
import type { User } from '~/types/models'
import type { GithubUserInfo, GoogleUserInfo, MicrosoftUserInfo, TokenLocation, UserInfo } from '~/types/oauth'

const signIn = async (event: H3Event<EventHandlerRequest>, oauthPayload: any, provider: string): Promise<User> => {
  let user: User | null = null

  let userPayload: GithubUserInfo | GoogleUserInfo | MicrosoftUserInfo | null = null
  userPayload = oauthPayload as GithubUserInfo
  const info: UserInfo = { email: '', name: '', avatar: '' }

  if (provider === 'google') {
    userPayload = oauthPayload as GoogleUserInfo
    info.email = userPayload.email
    info.name = userPayload.name
    info.avatar = userPayload.picture
  }

  if (provider === 'github') {
    userPayload = oauthPayload as GithubUserInfo
    info.email = userPayload.email
    info.name = userPayload.name
    info.avatar = userPayload.avatar_url
  }

  if (provider === 'microsoft') {
    userPayload = oauthPayload as MicrosoftUserInfo
    info.email = userPayload.mail
    info.name = userPayload.displayName
    info.avatar = ''
  }

  console.log(info)
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
        payload: ({ roles: { admin: false } } as UserPayload) as unknown as Prisma.JsonObject,
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

  const coordinate = `${event.node.req.headers['Cloudfront-Viewer-Latitude']} ${event.node.req.headers['Cloudfront-Viewer-Longitude']}`

  const location: TokenLocation = {
    city: event.node.req.headers['Cloudfront-Viewer-City'] as string || 'Austin',
    region: event.node.req.headers['Cloudfront-Viewer-Region-Name'] as string || 'TX',
    country: event.node.req.headers['Cloudfront-Viewer-Country'] as string || 'US',
    timezone: event.node.req.headers['Cloudfront-Viewer-Timezone'] as string || 'America/Chicago',
    countryName: event.node.req.headers['Cloudfront-Viewer-CountryName'] as string || 'United States',
  }

  const cfg = useRuntimeConfig(event)

  const token = await prisma.token.create({
    data: {
      userId: BigInt(user.id),
      hash: `${cfg.public.prefix}_${crypto.createHash('sha256').update(crypto.randomBytes(20).toString('hex')).digest('hex')}`,
      source: `oauth:${provider}`,
      ip: event.node.req.headers['x-forwarded-for'] as string,
      agent: event.node.req.headers['user-agent'] as string,
      location: location as unknown as Prisma.JsonObject,
      coordinate: coordinate === 'undefined undefined' ? '30.2423 -97.7672' : coordinate,
    },
  })

  user.hash = token.hash
  return user
}

export const googleHandler = oauthGoogleEventHandler({
  config: {
    authorizationParams: import.meta.dev
      ? {}
      : {
          redirect_uri: 'https://fume.bio/api/oauth/google/callback',
        },
  },
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'google')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/home')
  },
})

export const microsoftHandler = oauthMicrosoftEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'microsoft')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/home')
  },
})

export const githubHandler = oauthGitHubEventHandler({
  config: {
    authorizationParams: import.meta.dev
      ? {}
      : {
          redirect_uri: 'https://fume.bio/api/oauth/github/callback',
        },
  },
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'github')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/home')
  },
})
