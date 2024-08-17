import { createRouter, useBase } from 'h3'
import { githubHandler, googleHandler } from '../utils/oauth'
import logout from '../controllers/logout'
import me from '../controllers/me'
import token from '../controllers/token'
import pen from '../controllers/pen'
import pens from '../controllers/pens'
import cartridge from '../controllers/cartridge'
import cartridges from '../controllers/cartridges'
import shots from '../controllers/shots'
import shot from '../controllers/shot'
import user from '../controllers/user'

const router = createRouter()

router.get('/me', me)
router.get('/**', defineEventHandler(event => metapi().notFound(event)))

router.get('/oauth/google', googleHandler)
router.get('/oauth/github', githubHandler)
router.get('/oauth/microsoft', microsoftHandler)

router.get('/logout', logout)

routing.apiResource('token', router, token)
routing.apiResource('pen', router, pen)
routing.apiResource('cartridge', router, cartridge)
routing.apiResource('shot', router, shot)

routing.apiResource('user', router, user)
routing.apiResource('user/:user/pen', router, pens)
routing.apiResource('user/:user/cartridge', router, cartridges)
routing.apiResource('user/:user/shot', router, shots)

export default useBase('/api/', router.handler)
