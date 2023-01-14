import { MyMiddleware } from '@app/*'
import prisma from '@services/db/prisma'

export const authenticators: MyMiddleware = async (ctx) => {
  ctx.set('content-type', 'application/json')
  const authenticators = await prisma.authenticator.findMany({
    where: { userId: ctx.state.user?.id },
  })
  ctx.body = authenticators.map((x) => ({
    credentialId: x.credentialId,
  }))
}
