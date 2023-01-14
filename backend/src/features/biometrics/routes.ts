import Router from '@koa/router'
import { authentication } from '@middlewares/authentication'
import { authenticators } from './controllers/authenticators'
import { deleteAuthenticator } from './controllers/deleteAuthenticator'
import { loginRequest } from './controllers/loginRequest'
import { loginRespone } from './controllers/loginResponse'
import { loginRequestUsernameless } from './controllers/loginRequestUsernameless'
import { loginResponseUsernameless } from './controllers/loginResponseUsernameless'
import { registerRequestAuthenticated } from './controllers/registerRequestAuthenticated'
import { registerRequestPasswordless } from './controllers/registerRequestPasswordless'
import { registerRequestUsernameless } from './controllers/registerRequestUsernameless'
import { registerResponseAuthenticated } from './controllers/registerResponseAuthenticated'
import { registerResponsePasswordless } from './controllers/registerResponsePasswordless'
import { registerResponseUsernameless } from './controllers/registerResponseUsernameless'

const router = new Router({
  prefix: '/biometrics',
})

router.get('/authenticators', authentication, authenticators)
router.delete('/authenticator', authentication, deleteAuthenticator)

// Let authenticated users register credentials/authenticators
router.post(
  '/registerRequestAuthenticated',
  authentication,
  registerRequestAuthenticated,
)
router.post(
  '/registerResponseAuthenticated',
  authentication,
  registerResponseAuthenticated,
)

// Register new user passwordless
router.post('/registerRequestPasswordless', registerRequestPasswordless)
router.post('/registerResponsePasswordless', registerResponsePasswordless)

// Register new user usernameless
router.post('/registerRequestUsernameless', registerRequestUsernameless)
router.post('/registerResponseUsernameless', registerResponseUsernameless)

// Login without entering username
router.post('/loginRequestUsernameless', loginRequestUsernameless)
router.post('/loginResponseUsernameless', loginResponseUsernameless)

// Login with username in payload
router.post('/loginRequest', loginRequest)
router.post('/loginResponse', loginRespone)

export default router
