import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import prisma from '@services/db/prisma'
import { generateAuthenticationOptions } from '@simplewebauthn/server'

type Body = {
  username: string
}

export const loginRequest: MyMiddleware = async (ctx) => {
  const body = ctx.request.body as Body
  const user = await prisma.user.findFirst({
    where: { username: body.username },
    include: { authenticators: true },
  })
  if (!user || !user.authenticators.length) {
    return ctx.throw(404)
  }
  const options = generateAuthenticationOptions({
    // Require users to use a previously-registered authenticator
    allowCredentials: user.authenticators.map((authenticator) => ({
      id: Buffer.from(authenticator.credentialId, 'base64url'),
      type: 'public-key',
      // Optional
      transports: authenticator.transports
        ? JSON.parse(authenticator.transports)
        : [],
    })),
    timeout: 60000,
    userVerification: 'preferred',
  })
  console.log('login request', body)
  redis.set(`challenge:${user.id}`, options.challenge, 'PX', 60000)
  ctx.set('content-type', 'application/json')
  ctx.body = options
}
