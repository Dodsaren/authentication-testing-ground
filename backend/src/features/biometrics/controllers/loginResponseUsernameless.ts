import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import prisma from '@services/db/prisma'
import { verifyAuthenticationResponse } from '@simplewebauthn/server'
import { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types'
import { initSession } from '@services/auth/session'

type Body = {
  options: AuthenticationCredentialJSON
  transactionId: string
}

export const loginResponseUsernameless: MyMiddleware = async (ctx) => {
  const { transactionId, options } = ctx.request.body as Body
  console.log(options)
  const authenticator = await prisma.authenticator.findFirst({
    where: { credentialId: options.id },
  })
  if (!authenticator) {
    return ctx.throw(400)
  }
  const expectedChallenge = await redis.get(`challenge:${transactionId}`)
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
    const user = await prisma.user.findFirstOrThrow({
      include: { authenticators: true },
      where: {
        authenticators: {
          some: {
            credentialId: options.id,
          },
        },
      },
    })
    console.log('login user', user)
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
