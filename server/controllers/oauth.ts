import type { EventHandlerRequest, H3Event } from 'h3'
import type { User } from '~/types/models'
import type { GithubUserInfo, GoogleUserInfo, MicrosoftUserInfo, TokenLocation, UserInfo } from '~/types/oauth'

const signIn = async (event: H3Event<EventHandlerRequest>, oauthPayload: any, provider: string): Promise<User> => {
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

  const user = await createUser(info, provider, oauthPayload, event)
  return user
}

export const googleHandler = oauthGoogleEventHandler({
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
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    const dbUser = await signIn(event, user, 'github')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/home')
  },
})

export const facebookHandler = oauthFacebookEventHandler({
  async onSuccess(event: H3Event<EventHandlerRequest>, { user }: { user: any }) {
    console.log('facebook', user)
    const dbUser = await signIn(event, user, 'facebook')
    await setUserSession(event, { user: dbUser })
    return sendRedirect(event, '/home')
  },
})
