import Router, { Middleware } from '@koa/router'
import Koa from 'koa'
import bodyParser from 'koa-bodyparser'
import cookieParser from 'koa-cookie'
import cors from '@koa/cors'
import sessionRouter from '@features/session/routes'
import classicRouter from '@features/classic/routes'
import biometricsRouter from '@features/biometrics/routes'
import mailRouter from '@features/mail/routes'
import { User } from '@prisma/client'

interface MyState extends Koa.DefaultState {
  user?: User
}

export type MyMiddleware = Middleware<MyState>

const app = new Koa<MyState>()
const router = new Router()
const allowedOrigins = [
  'http://localhost:5173',
  'https://cb17-178-132-77-106.ngrok.io',
]

app.use(async (ctx, next) => {
  const start = performance.now()
  try {
    await next()
    console.log(
      `${ctx.request.url} (${Math.round(performance.now() - start)}ms)`,
    )
  } catch (err) {
    console.log('MiddlewareLogger:', err)
    throw err
  }
})
app.use(
  cors({
    origin: (ctx) => allowedOrigins.find((x) => x === ctx.headers.origin) || '',
    credentials: true,
  }),
)
app.use(bodyParser())
app.use(cookieParser())

app.use(sessionRouter.routes()).use(sessionRouter.allowedMethods())
app.use(classicRouter.routes()).use(classicRouter.allowedMethods())
app.use(biometricsRouter.routes()).use(biometricsRouter.allowedMethods())
app.use(mailRouter.routes()).use(mailRouter.allowedMethods())
app.use(router.routes()).use(router.allowedMethods())

app.listen(3000)

router.get('/', (ctx) => {
  ctx.body = 'Hello world'
})
