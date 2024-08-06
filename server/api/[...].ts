import { createRouter, useBase } from 'h3'
import logout from '../routes/logout'
import me from '../routes/me'
import token from '../routes/token'
import oauth from '../routes/oauth'

const router = createRouter()

router.get('/redirect/:provider', oauth.redirect)
router.get('/callback/:provider', oauth.callback)

router.get('/logout', logout)
router.get('/me', me)

routing.apiResource('token', router, token)

export default useBase('/api', router.handler)
