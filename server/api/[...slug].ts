import { createRouter, useBase } from 'h3'
import { githubHandler, googleHandler, microsoftHandler } from '../controllers/oauth'
import { withApiUtils } from '../lib/api'
import token from '../controllers/token'
import pen from '../controllers/pen'
import cartridge from '../controllers/cartridge'
import shot from '../controllers/shot'
import user from '../controllers/user'
import test from '../controllers/test'
import logout from '../controllers/logout'
import type { Cartridge, Pen, Shot, Token, User } from '~/types/models'

const router = withApiUtils(createRouter())

router.get('/**', defineEventHandler(event => metapi().notFound(event)))
router.get('/me', defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  return metapi().render(user)
}))

if (useRuntimeConfig().appEnv === 'test')
  router.post('/test/session', test.create)

router.get('/oauth/google', googleHandler)
router.get('/oauth/github', githubHandler)
router.get('/oauth/microsoft', microsoftHandler)
router.get('/logout', logout)

router.apiResource<{ token: Token }>('/token', token)
router.apiResource<{ user: User, pen: Pen }>('/user/{user}/pen', pen)
router.apiResource<{ user: User, cartridge: Cartridge }>('/user/{user}/cartridge', cartridge)
router.apiResource<{ user: User, shot: Shot }>('/user/{user}/shot', shot)
router.apiResource<{ user: User }>('/all/user', user)

export default useBase('/api', router.handler)
