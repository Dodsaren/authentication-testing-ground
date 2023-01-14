import redis from '../cache/redis'
import { Context } from 'koa'
import {
  createAndSignRefreshToken,
  createAndSignUserToken,
  MyJwtPayload,
} from './jwtService'

export const initSession = async (
  ctx: Context,
  userId: number,
  username: string,
  authType: MyJwtPayload['authType'],
) => {
  const jwt = createAndSignUserToken({ username, authType })
  const rft = createAndSignRefreshToken({ username })
  await redis.set(`rft:${userId}`, rft, 'EX', 7 * 24 * 60 * 60)
  ctx.cookies.set('jwt', jwt)
  ctx.cookies.set('rft', rft)
}
