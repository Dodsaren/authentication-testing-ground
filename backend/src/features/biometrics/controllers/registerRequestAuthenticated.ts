import redis from '@services/cache/redis'
import {
  generateRegistrationOptions,
  GenerateRegistrationOptionsOpts,
} from '@simplewebauthn/server'
import prisma from '@services/db/prisma'
import { MyMiddleware } from '@app/*'
import { randomBytes } from 'crypto'

export const registerRequestAuthenticated: MyMiddleware = async (ctx) => {
  const user = await prisma.user.findFirst({
    where: { id: ctx.state.user?.id },
    include: { authenticators: true },
  })
  if (!user) {
    return ctx.throw(400)
  }
  const opaqueUserId = randomBytes(16).toString('hex')
  const opts: GenerateRegistrationOptionsOpts = {
    rpName: process.env.RP_NAME!,
    rpID: process.env.RP_ID!,
    userID: opaqueUserId,
    userName: user.username,
    timeout: 60000,
    attestationType: 'none',
    excludeCredentials: user.authenticators.map((x) => ({
      id: Buffer.from(x.credentialId, 'base64url'),
      type: 'public-key',
      transports: x.transports ? JSON.parse(x.transports) : [],
    })),
    authenticatorSelection: {
      authenticatorAttachment: 'platform',
      userVerification: 'required',
    },
    supportedAlgorithmIDs: [-7, -257],
  }
  const options = generateRegistrationOptions(opts)
  ctx.set('content-type', 'application/json')
  redis.set(`challenge:${user.id}`, options.challenge, 'PX', 60000)
  redis.set(`opaqueUserId:${user.id}`, opaqueUserId, 'PX', 60000)
  ctx.body = options
}
