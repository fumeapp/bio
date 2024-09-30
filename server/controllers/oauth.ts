import type { EventHandlerRequest, H3Event } from 'h3'
import type { User } from '~/types/models'
import type { AppleUserInfo, GithubUserInfo, GoogleUserInfo, MicrosoftUserInfo, TokenLocation, UserInfo } from '~/types/oauth'

const signIn = async (event: H3Event<EventHandlerRequest>, oauthPayload: any, provider: string): Promise<User> => {
  let userPayload: GithubUserInfo | GoogleUserInfo | MicrosoftUserInfo | AppleUserInfo | null = null
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
  if (provider === 'apple') {
    userPayload = oauthPayload as AppleUserInfo
    info.email = userPayload.email
    info.name = `${userPayload.name.firstName} ${userPayload.name.lastName}`
    info.avatar = ''
  }

  if (provider === 'facebook')
    console.log('facebook payload', oauthPayload)

  if (provider === 'instagram')
    console.log('instagarm payload', oauthPayload)

  if (provider === 'x')
    console.log('x payload', oauthPayload)

  const user = await createUser(info, provider, oauthPayload, event)
  return user
}

export const googleHandler = oauthGoogleEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'google')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})

export const microsoftHandler = oauthMicrosoftEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'microsoft')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})

export const githubHandler = oauthGitHubEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'github')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})

export const facebookHandler = oauthFacebookEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'facebook')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})

export const instagramHandler = oauthInstagramEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'instagram')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})

export const xHandler = oauthXEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'x')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/')
  },
})
export const appleRedirectHandler = defineEventHandler((event) => {
  const config = useRuntimeConfig(event).apple
  return sendRedirect(event, apple.getAuthURL(config))
})

export const appleHandler = defineEventHandler(async (event) => {
  const config = useRuntimeConfig(event).apple
  const body = await readBody(event)
  const token = await apple.getAuthToken(config, body.code)
  const verified = apple.verifyIdToken(token.id_token)

  let dbUser
  if (body.user)
    dbUser = await signIn(event, JSON.parse(body.user), 'apple')
  else
    dbUser = await createSession('apple', await userFromEmail(verified.email), event)

  await setUserSession(event, { user: dbUser })
  return sendRedirect(event, '/')
})
