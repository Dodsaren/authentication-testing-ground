import Router from '@koa/router'
import { send } from './controllers/send'
import { auth } from './controllers/auth'

const router = new Router({
  prefix: '/mail',
})

router.get('/send', send)
router.get('/auth/:authString', auth)

export default router
