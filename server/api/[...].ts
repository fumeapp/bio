import { createRouter, useBase } from 'h3'
import logout from '../routes/logout'
import me from '../routes/me'
import token from '../routes/token'
import oauth from '../routes/oauth'
import pen from '../routes/pen'
import cartridge from '../routes/cartridge'

const router = createRouter()

router.get('/redirect/:provider', oauth.redirect)
router.get('/callback/:provider', oauth.callback)

router.get('/logout', logout)
router.get('/me', me)

routing.apiResource('token', router, token)
routing.apiResource('pen', router, pen)
routing.apiResource('cartridge', router, cartridge)

export default useBase('/api', router.handler)
