import { MyMiddleware } from '@app/*'
import prisma from '@services/db/prisma'
import { JsonWebTokenError } from 'jsonwebtoken'
import {
  createAndSignUserToken,
  decodeJwt,
  verifyRefreshToken,
  verifyUserToken,
} from '@services/auth/jwtService'

export const authentication: MyMiddleware = async (ctx, next) => {
  const jwToken = ctx.cookies.get('jwt')
  if (!jwToken) {
    return ctx.throw(401, { error: 'no token' })
  }
  try {
    const decoded = verifyUserToken(jwToken)
    const user = await prisma.user.findFirst({
      where: { username: decoded.username },
    })
    if (!user) {
      return ctx.throw(401, { error: 'invalid user' })
    }
    ctx.state.user = user
    await next()
  } catch (error) {
    if (
      !(error instanceof JsonWebTokenError) ||
      error.name !== 'TokenExpiredError'
    ) {
      return ctx.throw(401, { error })
    }
    const refreshToken = ctx.cookies.get('rft')
    if (!refreshToken) {
      return ctx.throw(401, { error: 'no refresh token' })
    }
    const { refreshedJwt, json } = refresh(refreshToken, jwToken)
    const user = await prisma.user.findFirst({
      where: { username: json.username },
    })
    if (!user) {
      return ctx.throw(401, { error: 'invalid user' })
    }
    ctx.state.user = user
    ctx.cookies.set('jwt', refreshedJwt)
    await next()
  }
}

function refresh(
  refreshToken: string,
  jwToken: string,
): {
  refreshedJwt: string
  json: {
    username: string
    authType: string
  }
} {
  const decoded = decodeJwt(jwToken)
  const decodedRefreshToken = verifyRefreshToken(refreshToken)
  if (!decodedRefreshToken.username || !decoded.authType) {
    throw new Error('Unexpected error')
  }
  // check if refreshToken is revoked in redis before using it to issue new jwt
  const json = {
    username: decodedRefreshToken.username,
    authType: decoded.authType,
  }
  const refreshedJwt = createAndSignUserToken(json)
  // revoke old refresh token, and issue a new?
  return { refreshedJwt, json }
}
