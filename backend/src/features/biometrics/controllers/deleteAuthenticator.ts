import { MyMiddleware } from '@app/*'
import prisma from '@services/db/prisma'

type Body = {
  credentialId: string
}

export const deleteAuthenticator: MyMiddleware = async (ctx) => {
  const { credentialId } = ctx.request.body as Body
  if (!credentialId) {
    return ctx.throw(400)
  }
  const authenticator = await prisma.authenticator.findFirst({
    where: { userId: ctx.state.user?.id, credentialId },
  })
  if (!authenticator) {
    return ctx.throw(403)
  }
  const result = await prisma.authenticator.delete({ where: { credentialId } })
  ctx.body = { credentialId: result.credentialId }
}
