import { MyMiddleware } from '@app/*'
import { initSession } from '@services/auth/session'
import redis from '@services/cache/redis'
import prisma from '@services/db/prisma'

export const auth: MyMiddleware = async (ctx) => {
  const authString = ctx.params.authString
  if (!authString) {
    return ctx.throw(400)
  }
  const [email, password] = Buffer.from(authString, 'base64url')
    .toString()
    .split(':')
  const redisKey = `mailAuth:${email}`
  const expectedPassword = await redis.get(redisKey)
  if (password !== expectedPassword) {
    return ctx.throw(403)
  }
  const [user] = await Promise.all([
    prisma.user.upsert({
      where: { username: email },
      update: {},
      create: { username: email },
    }),
    redis.del(redisKey),
  ])
  await initSession(ctx, user.id, user.username, 'mail')
  ctx.body = { message: 'user authenticated' }
}
