import { Link, useNavigate } from 'react-router-dom'
import { Button } from '../components/Button'
import { prepQuery, useQuery } from '../hooks/useQuery'
import { Authenticators } from '../components/Authenticators'
import { ReactNode } from 'react'
import { LogoutIcon } from '../components/icons/LogoutIcon'

export const Protected = () => {
  const { status } = useQuery(
    'protected',
    new URL('http://localhost:3000/session/verify'),
    undefined,
    { cacheTime: 0, retry: false },
  )
  const { refetch: logout } = prepQuery(
    'logout',
    new URL('http://localhost:3000/session/logout'),
  )
  const navigate = useNavigate()
  const onLogoutClick = async () => {
    const response = await logout()
    if (response.status === 'success') {
      navigate('/')
    }
  }

  if (status === 'loading') {
    return <>Loading...</>
  }

  if (status === 'error') {
    return (
      <>
        <h1 className='text-7xl'>acces denied</h1>
      </>
    )
  }

  return (
    <>
      <header>
        <h1 className='text-3xl font-bold'>Protected area</h1>
      </header>
      <Section>
        <Authenticators />
      </Section>
      <footer>
        <Button onClick={onLogoutClick}>
          <LogoutIcon />
          logout
        </Button>
      </footer>
    </>
  )
}

const Section = ({ children }: { children: ReactNode }) => (
  <section className='my-2 border bg-slate-50 p-2 shadow-md'>
    {children}
  </section>
)
