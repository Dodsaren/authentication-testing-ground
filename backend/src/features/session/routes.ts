import Router from '@koa/router'
import { authentication } from '@middlewares/authentication'
import { logout } from './controllers/logout'
import { verify } from './controllers/verify'

const router = new Router({
  prefix: '/session',
})

router.get('/verify', authentication, verify)
router.get('/logout', logout)

export default router
