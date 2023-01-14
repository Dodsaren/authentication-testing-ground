import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import prisma from '@services/db/prisma'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types'
import { initSession } from '@services/auth/session'

type Body = { options: AuthenticationCredentialJSON; username: string }

export const loginRespone: MyMiddleware = async (ctx) => {
  const { username, options } = ctx.request.body as Body
  const user = await prisma.user.findFirst({
    where: { username },
    include: { authenticators: true },
  })
  if (!user) {
    return ctx.throw(400)
  }
  const authenticator = user.authenticators.find(
    (x) => x.credentialId === options.id,
  )
  if (!authenticator) {
    return ctx.throw(400)
  }
  const expectedChallenge = await redis.get(`challenge:${user.id}`)
  if (!expectedChallenge) {
    return ctx.throw(500)
  }
  const expectedOrigin = ctx.get('Origin')
  const expectedRPID = process.env.RP_ID!
  let verification
  verification = await verifyAuthenticationResponse({
    credential: options,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
    authenticator: {
      credentialID: Buffer.from(authenticator.credentialId, 'base64url'),
      credentialPublicKey: authenticator.credentialPublicKey,
      counter: Number(authenticator.counter),
      transports: authenticator.transports
        ? JSON.parse(authenticator.transports)
        : [],
    },
  })
  if (verification.verified) {
    await Promise.all([
      initSession(ctx, user.id, user.username, 'authenticator'),
      prisma.authenticator.update({
        where: { credentialId: authenticator.credentialId },
        data: { counter: verification.authenticationInfo.newCounter },
      }),
    ])
  }
  ctx.set('content-type', 'application/json')
  ctx.status = 200
  ctx.body = { ok: verification.verified }
}
