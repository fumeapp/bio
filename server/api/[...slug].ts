import { createRouter, useBase } from 'h3'
import logout from '../routes/logout'
import me from '../routes/me'
import token from '../routes/token'
import oauth from '../routes/oauth'
import pen from '../routes/pen'
import pens from '../routes/pens'
import cartridge from '../routes/cartridge'
import cartridges from '../routes/cartridges'
import shots from '../routes/shots'
import shot from '../routes/shot'
import user from '../routes/user'

const router = createRouter()

router.get('/**', defineEventHandler(event => metapi().notFound(event)))

router.get('/redirect/:provider', oauth.redirect)
router.get('/callback/:provider', oauth.callback)

router.get('/logout', logout)

router.get('/me', me)
routing.apiResource('token', router, token)
routing.apiResource('pen', router, pen)
routing.apiResource('cartridge', router, cartridge)
routing.apiResource('shot', router, shot)

routing.apiResource('user', router, user)
routing.apiResource('user/:user/pen', router, pens)
routing.apiResource('user/:user/cartridge', router, cartridges)
routing.apiResource('cartridge/:cartridge/shot', router, shots)

export default useBase('/api/', router.handler)
