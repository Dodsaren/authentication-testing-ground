import { useQuery } from 'react-query'
import { Outlet, useLocation, useRouteLoaderData } from 'react-router-dom'
import { Link } from '../components/Link'
import { LoaderPopup } from '../components/loader/PopupLoader'

function LayoutBase() {
  return (
    <div className='h-screen bg-gradient-to-r from-red-200 via-green-200 to-blue-200'>
      <main className='m-auto grid max-w-xl px-4'>
        <header className='py-1'>
          <nav className='flex justify-center gap-2'>
            <Link to='/'>login</Link>
            <Link to='/register'>register</Link>
            <Link to='/protected'>protected</Link>
          </nav>
        </header>
        <Outlet />
        <AuthenticatorStatus />
        <LoaderPopup />
      </main>
    </div>
  )
}

export default LayoutBase

const AuthenticatorStatus = () => {
  const { ok, text } = useRouteLoaderData('root') as {
    ok: boolean
    text: string
  }
  if (!ok) {
    return (
      <div className='fixed bottom-0 right-1 rounded-md bg-red-500 p-2'>
        {text}
      </div>
    )
  }

  return (
    <div className='fixed bottom-0 right-1 rounded-md bg-green-500 p-2'>
      Authenticated by: {text}
    </div>
  )
}
