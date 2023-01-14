import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import prisma from '@services/db/prisma'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import {
  PublicKeyCredentialUserEntityJSON,
  RegistrationCredentialJSON,
} from '@simplewebauthn/typescript-types'
import { initSession } from '@services/auth/session'

type Body = {
  credential?: RegistrationCredentialJSON
  userHandle?: PublicKeyCredentialUserEntityJSON
}

export const registerResponseUsernameless: MyMiddleware = async (ctx) => {
  const { credential, userHandle } = ctx.request.body as Body
  if (!userHandle || !credential) {
    return ctx.throw(400)
  }
  const existing = await prisma.user.findFirst({
    where: { username: userHandle?.name },
  })
  if (existing) {
    return ctx.throw(400)
  }
  const expectedChallenge = await redis.get(`challenge:${userHandle.name}`)
  if (!expectedChallenge) {
    return ctx.throw(500)
  }
  const expectedOrigin = ctx.get('Origin')
  const expectedRPID = process.env.RP_ID
  const verification = await verifyRegistrationResponse({
    credential,
    expectedChallenge,
    expectedOrigin,
    expectedRPID,
  })
  const { verified, registrationInfo } = verification
  if (!verified) {
    throw new Error('User verification failed.')
  }
  if (!registrationInfo) {
    throw new Error('unexpected null at registrationInfo')
  }
  console.log('verification successful', verification)
  const {
    credentialPublicKey,
    credentialID,
    counter,
    credentialDeviceType,
    credentialBackedUp,
  } = registrationInfo
  const transports = JSON.stringify(credential.transports)
  const credentialIdBase64url = Buffer.from(credentialID).toString('base64url')
  const user = await prisma.user.create({
    include: { authenticators: true },
    data: {
      username: userHandle.name,
      authenticators: {
        create: {
          credentialId: credentialIdBase64url,
          credentialPublicKey,
          counter,
          credentialDeviceType,
          credentialBackedUp,
          transports,
        },
      },
    },
  })
  await initSession(ctx, user.id, user.username, 'authenticator')
  ctx.status = 200
  ctx.body = {
    authentication: 'success',
  }
}
