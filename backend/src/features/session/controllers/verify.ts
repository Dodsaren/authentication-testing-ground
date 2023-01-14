import { MyMiddleware } from '@app/*'
import { decodeJwt } from '@services/auth/jwtService'

export const verify: MyMiddleware = (ctx) => {
  const jwt = ctx.cookies.get('jwt') || 'unauthorized'
  const decoded = decodeJwt(jwt)
  ctx.status = 200
  console.log('decoded', decoded)
  ctx.body = decoded
}
