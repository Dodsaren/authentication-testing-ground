import { Middleware } from 'koa'
import crypto from 'crypto'
import prisma from '@services/db/prisma'
import { initSession } from '@services/auth/session'

type Body = {
  username: string
  password: string
}

export const register: Middleware = async (ctx) => {
  const { username, password } = <Body>ctx.request.body
  if (!username.trim() || !password.trim()) {
    return ctx.throw(400)
  }
  if (username.trim().length < 1) {
    return ctx.throw(400, 'username to short')
  }
  if (password.length < 3) {
    return ctx.throw(400, 'password to short')
  }
  const existingUser = await prisma.user.findFirst({ where: { username } })
  if (existingUser) {
    return ctx.throw(409)
  }
  const salt = crypto.randomBytes(16).toString('hex')
  const hash = crypto
    .pbkdf2Sync(password, salt, 1000, 512, 'sha512')
    .toString('hex')
  const user = await prisma.user.create({
    data: { username, password: { create: { hash, salt } } },
  })
  await initSession(ctx, user.id, user.username, 'password')
  ctx.status = 200
  ctx.body = user
}
