import { Middleware } from 'koa'

export const logout: Middleware = (ctx) => {
  try {
    ctx.cookies.set('jwt', '')
    ctx.cookies.set('rft', '')
    // Reset redis:challenge?
    ctx.status = 200
  } catch (error) {
    ctx.status = 500
  }
}
