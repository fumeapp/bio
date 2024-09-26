import type { Round } from '@prisma/client'
import { createRouter, useBase } from 'h3'
import type { Token, User } from '~/types/models'
import logout from '../controllers/logout'
import { appleHandler, appleRedirectHandler, githubHandler, googleHandler } from '../controllers/oauth'
import round from '../controllers/round'
import test from '../controllers/test'
import token from '../controllers/token'
import user from '../controllers/user'
import { withApiUtils } from '../lib/api'

const router = withApiUtils(createRouter())

router.get('/**', defineEventHandler(event => metapi().notFound(event)))
router.get('/me', defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const dbUser = await usePrisma(event).user.update({ where: { id: user.id }, data: { updatedAt: new Date() } }) as unknown as User
  dbUser.hash = user.hash
  await replaceUserSession(event, { user: dbUser })
  return metapi().render(dbUser)
}))

if (useRuntimeConfig().appEnv === 'test')
  router.post('/test/session', test.create)

router.get('/oauth/google', googleHandler)
router.get('/oauth/redirect/apple', appleRedirectHandler)
router.post('/oauth/apple', appleHandler)
// router.get('/oauth/facebook', facebookHandler)
// router.get('/oauth/instagram', instagramHandler)
// router.get('/oauth/x', xHandler)
// router.get('/oauth/microsoft', microsoftHandler)
router.get('/oauth/github', githubHandler)
router.get('/logout', logout)

router.apiResource<{ token: Token }>('/token', token)
router.apiResource<{ user: User, round: Round }>('/user/{user}/round', round)
router.apiResource<{ user: User }>('/all/user', user)
router.get('/rounds', round.all)

export default useBase('/api', router.handler)
