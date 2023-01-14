import { Middleware } from 'koa'
import redis from '@services/cache/redis'
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server'
import { randomBytes } from 'crypto'

type Body = { username?: string }

export const registerRequestPasswordless: Middleware = async (ctx) => {
  const { username } = ctx.request.body as Body
  if (!username) {
    return ctx.throw(400)
  }
  const userHandle = {
    id: randomBytes(16).toString('hex'),
    name: username,
    displayName: username,
  }
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: process.env.RP_NAME!,
    rpID: process.env.RP_ID!,
    userID: userHandle.id,
    userName: userHandle.name,
    userDisplayName: userHandle.displayName,
    timeout: 60000,
    attestationType: 'none',
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  }
  const options = generateRegistrationOptions(opts)
  ctx.set('content-type', 'application/json')
  redis.set(`challenge:${userHandle.name}`, options.challenge, 'PX', 60000)
  ctx.body = options
}
