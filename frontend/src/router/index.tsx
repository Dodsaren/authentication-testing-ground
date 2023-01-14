import { platformAuthenticatorIsAvailable } from '@simplewebauthn/browser'
import { createBrowserRouter, redirect } from 'react-router-dom'
import LayoutBase from '../layouts/LayoutBase'
import ErrorPage from '../views/Error'
import Login from '../views/Login'
import { MailAuth } from '../views/MailAuth'
import { Protected } from '../views/Protected'
import { Register } from '../views/Register'

const router = createBrowserRouter([
  {
    id: 'root',
    path: '/',
    element: <LayoutBase />,
    loader: async () => {
      console.log('running root loader')
      const res = await fetch('http://localhost:3000/session/verify', {
        credentials: 'include',
      })
      if (!res.ok) {
        const text = await res.text()
        return { ok: false, text }
      }
      const json = await res.json()
      return { ok: true, text: json.authType }
    },
    shouldRevalidate: (params) => params.currentUrl !== params.nextUrl,
    errorElement: <ErrorPage />,
    children: [
      {
        path: '',
        element: <Login />,
        loader: platformAuthenticatorIsAvailable,
      },
      {
        path: 'register',
        element: <Register />,
      },
      {
        path: 'protected',
        element: <Protected />,
      },
      {
        path: 'mailAuth/:authString',
        loader: async ({ params }) => {
          const result = await fetch(
            `http://localhost:3000/mail/auth/${params.authString}`,
            {
              credentials: 'include',
            },
          )
          if (!result.ok) {
            throw new Error()
          }
          return redirect('/protected')
        },
      },
    ],
  },
])

export default router
