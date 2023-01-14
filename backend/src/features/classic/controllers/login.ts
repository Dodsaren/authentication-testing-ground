import { Middleware } from 'koa'
import crypto from 'crypto'
import prisma from '@services/db/prisma'
import { initSession } from '@services/auth/session'

type Body = {
  username: string
  password: string
}

export const login: Middleware = async (ctx) => {
  const { username, password } = ctx.request.body as Body
  const user = await prisma.user.findFirst({
    where: { username },
    include: { password: true },
  })
  if (!user || !user.password) {
    ctx.status = 400
    return
  }
  const { hash, salt } = user.password
  const incomingHash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex')
  const isValidPassword = crypto.timingSafeEqual(
    Buffer.from(hash),
    Buffer.from(incomingHash),
  )
  if (!isValidPassword) {
    ctx.status = 400
    return
  }
  await initSession(ctx, user.id, user.username, 'password')
  ctx.status = 200
  ctx.body = user
}
