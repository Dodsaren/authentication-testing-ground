import jwt, { JwtPayload } from 'jsonwebtoken'

export type MyJwtPayload = {
  username: string
  authType: 'authenticator' | 'password' | 'mail'
}

type CombinedJwtPayload = MyJwtPayload & JwtPayload

const jwtSecret = 'my_secret'
const rftSecret = 'refresh_secret'

export function createAndSignUserToken(payload: MyJwtPayload) {
  return jwt.sign(
    { username: payload.username, authType: payload.authType },
    jwtSecret,
    {
      expiresIn: 600, // 10 minutes
    },
  )
}

export function verifyUserToken(token: string) {
  const decoded = jwt.verify(token, jwtSecret)
  if (typeof decoded === 'string') {
    throw new Error('Unexpected token')
  }
  return decoded as CombinedJwtPayload
}

export function createAndSignRefreshToken(
  payload: Pick<MyJwtPayload, 'username'>,
) {
  return jwt.sign({ username: payload.username }, rftSecret, {
    expiresIn: 7 * 24 * 60 * 60, // 1 week
  })
}

export function verifyRefreshToken(token: string) {
  const decoded = jwt.verify(token, rftSecret)
  if (typeof decoded === 'string') {
    throw new Error('Unexpected token')
  }
  return decoded as CombinedJwtPayload
}

export function decodeJwt<T>(token: string) {
  const decoded = jwt.decode(token)
  if (!decoded || typeof decoded === 'string') {
    throw new Error('Unexpected token')
  }
  return decoded as CombinedJwtPayload
}
