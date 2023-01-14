import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import { generateAuthenticationOptions } from '@simplewebauthn/server'
import { randomBytes } from 'crypto'

export const loginRequestUsernameless: MyMiddleware = async (ctx) => {
  const options = generateAuthenticationOptions({
    timeout: 60000,
    userVerification: 'required',
  })
  const transactionId = randomBytes(16).toString('hex')
  redis.set(`challenge:${transactionId}`, options.challenge, 'PX', 60000)
  ctx.set('content-type', 'application/json')
  ctx.body = { options, transactionId }
}
