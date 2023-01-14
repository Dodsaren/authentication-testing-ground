import redis from '@services/cache/redis'
import { verifyRegistrationResponse } from '@simplewebauthn/server'
import prisma from '@services/db/prisma'
import { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types'
import { MyMiddleware } from '@app/*'

type Body = RegistrationCredentialJSON

export const registerResponseAuthenticated: MyMiddleware = async (ctx) => {
  const user = await prisma.user.findFirst({
    where: { id: ctx.state.user?.id },
    include: { authenticators: true },
  })
  if (!user) {
    ctx.status = 400
    return
  }
  console.log('user identified', user)
  const expectedChallenge = await redis.get(`challenge:${user.id}`) // remove key after usage
  if (!expectedChallenge) {
    ctx.statu = 500
    return
  }
  const expectedOrigin = ctx.get('Origin')
  const expectedRPID = process.env.RP_ID!
  const body = ctx.request.body as Body
  const verification = await verifyRegistrationResponse({
    credential: body,
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
  const transports = JSON.stringify(body.transports)
  const credentialIdBase64url = Buffer.from(credentialID).toString('base64url')
  if (
    !user.authenticators.find((x) => x.credentialId === credentialIdBase64url)
  ) {
    const updated = await prisma.user.update({
      where: { id: user.id },
      data: {
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
    console.log('authenticator added', updated)
  }
  ctx.status = 200
  ctx.body = verification.verified
}
