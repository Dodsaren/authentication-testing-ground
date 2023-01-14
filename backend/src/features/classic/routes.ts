import Router from '@koa/router'
import { login } from './controllers/login'
import { register } from './controllers/register'

const router = new Router({
  prefix: '/classic',
})

router.post('/register', register)
router.post('/login', login)

export default router
