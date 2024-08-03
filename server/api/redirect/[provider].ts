import { AuthorizationCode } from 'simple-oauth2'


export default defineEventHandler((event) => {

  const cfg = useRuntimeConfig(event)


  const client = new AuthorizationCode({
    client: {
        id: cfg.public.googleClientId,
        secret: cfg.private.googleClientSecret,
    },
    auth: {
        tokenHost: 'https://accounts.google.com',
        authorizePath: '/o/oauth2/auth',
        tokenPath: '/o/oauth2/token',
    },
  })

  return client.authorizeURL({
    redirect_uri: 'http://localhost:3000/api/callback/google',
    scope: 'https://www.googleapis.com/auth/userinfo.profile',
    state: '',
  });


})
