import { createRouter, useBase } from 'h3'
import token from '../controllers/token'
import pen from '../controllers/pen'
import cartridge from '../controllers/cartridge'
import { withApiUtils } from '../lib/api'
import test from '../controllers/test'
import logout from '../controllers/logout'
import { githubHandler, googleHandler, microsoftHandler } from '../controllers/oauth'
import type { Cartridge, Pen, Token, User } from '~/types/models'

const router = withApiUtils(createRouter())

router.get('/**', defineEventHandler(event => metapi().notFound(event)))
router.get('/me', authedHandler(async ({ user }) => metapi().render(user)))

if (useRuntimeConfig().appEnv === 'test')
  router.post('/test/session', test.create)

router.get('/oauth/google', googleHandler)
router.get('/oauth/github', githubHandler)
router.get('/oauth/microsoft', microsoftHandler)
router.get('/logout', logout)

router.apiResource<{ token: Token }>('/token', token)

router.apiResource<{ user: User, pen: Pen }>('/user/{user}/pen', pen)
router.apiResource<{ user: User, cartridge: Cartridge }>('/user/{user}/cartridge', cartridge)

export default useBase('/api', router.handler)

/*
routing.apiResource('/shot', router, shot)
routing.apiResource('/all/user', router, user)
*/
