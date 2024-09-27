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

/*
export const appleRedirectHandler = defineEventHandler((event) => {
  return sendRedirect(event, 'https://appleid.apple.com/auth/authorize?response_type=code&state=state&client_id=fume.bio&redirect_uri=https%3A%2F%2Ffume.bio%2Fapi%2Foauth%2Fapple&scope=openid+email+name&response_mode=form_post')
})

export const appleHandler = defineEventHandler(async (event) => {
  const body = await readBody(event)
  const config = useRuntimeConfig(event)
  const clientSecret = appleSignin.getClientSecret({
    clientID: 'fume.bio',
    teamID: config.apple.teamId,
    privateKey: `-----BEGIN PRIVATE KEY-----
${config.apple.privateKey.split(':BR:').join('\n')}
-----END PRIVATE KEY-----`,
    keyIdentifier: config.apple.keyIdentifier,
  })

  const options = {
    clientID: 'fume.bio',
    redirectUri: 'https://fume.bio/api/oauth/apple',
    clientSecret,
    scope: 'email name',
  }
  const tokenResponse = await appleSignin.getAuthorizationToken(body.code, options)
  const user = await appleSignin.verifyIdToken(tokenResponse.id_token)
  let dbUser
  if (body.user)
    dbUser = await signIn(event, JSON.parse(body.user), 'apple')
  else
    dbUser = await createSession('apple', await userFromEmail(user.email), event)

  await setUserSession(event, { user: dbUser })
  return sendRedirect(event, '/')
})
  */
