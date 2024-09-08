import { PrismaD1 } from '@prisma/adapter-d1'
import { PrismaClient } from '@prisma/client'
import { createRouter, useBase } from 'h3'
import type { Cartridge, Pen, Shot, Token, User } from '~/types/models'
import cartridge from '../controllers/cartridge'
import logout from '../controllers/logout'
import { facebookHandler, githubHandler, googleHandler, microsoftHandler } from '../controllers/oauth'
import pen from '../controllers/pen'
import shot from '../controllers/shot'
import test from '../controllers/test'
import token from '../controllers/token'
import user from '../controllers/user'
import { withApiUtils } from '../lib/api'

const router = withApiUtils(createRouter())

router.get('/**', defineEventHandler(event => metapi().notFound(event)))
router.get('/me', defineEventHandler(async (event) => {
  const { user } = await requireUserSession(event)
  const dbUser = await prisma.user.update({ where: { id: user.id }, data: { updatedAt: new Date() } }) as unknown as User
  dbUser.hash = user.hash
  await replaceUserSession(event, { user: dbUser })
  const { cloudflare } = event.context
  console.log('cf', cloudflare.env.DB)
  const adapter = new PrismaD1(cloudflare.env.DB)
  console.log('adapter', adapter)
  /*
  const pma = new PrismaClient({ adapter })
  const users = await pma.user.findMany()
  console.log('users', users)
  const db = hubDatabase()
  const statement = db.prepare('SELECT * FROM users').all()
  console.log('db is', statement)
  */
  return metapi().render(user)
}))

if (useRuntimeConfig().appEnv === 'test')
  router.post('/test/session', test.create)

router.get('/oauth/google', googleHandler)
router.get('/oauth/facebook', facebookHandler)
router.get('/oauth/github', githubHandler)
router.get('/oauth/microsoft', microsoftHandler)
router.get('/logout', logout)

router.apiResource<{ token: Token }>('/token', token)
router.apiResource<{ user: User, pen: Pen }>('/user/{user}/pen', pen)
router.apiResource<{ user: User, cartridge: Cartridge }>('/user/{user}/cartridge', cartridge)
router.apiResource<{ user: User, shot: Shot }>('/user/{user}/shot', shot)
router.apiResource<{ user: User }>('/all/user', user)

export default useBase('/api', router.handler)
