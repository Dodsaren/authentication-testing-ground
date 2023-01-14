import { MyMiddleware } from '@app/*'
import redis from '@services/cache/redis'
import { mailer } from '@services/mail'
import { randomBytes } from 'crypto'

type Body = {
  email?: string
}

export const send: MyMiddleware = async (ctx) => {
  const { email = 'barfoo@barfoo.se' } = ctx.request.body as Body
  if (!email) {
    return ctx.throw(400)
  }
  const password = randomBytes(16).toString('hex')
  await redis.set(`mailAuth:${email}`, password, 'PX', 5 * 60 * 1000)
  const authString = Buffer.from(`${email}:${password}`).toString('base64url')
  mailer.sendMail({
    from: 'app@hackz.se',
    to: email,
    subject: 'Your login',
    text: `http://localhost:5173/mailAuth/${authString}`,
  })
  ctx.body = 'OK'
}
