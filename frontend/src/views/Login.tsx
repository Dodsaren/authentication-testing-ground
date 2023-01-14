import { LoginPassword } from '../components/login/LoginPassword'
import { LoginAuthenticatorPasswordless } from '../components/login/LoginAuthenticatorPasswordless'
import { Section } from '../components/Section'
import { LoginAuthenticatorUsernameless } from '../components/login/LoginAuthenticatorUsernameless'
import { useLoaderData } from 'react-router-dom'
import { LoaderPopup } from '../components/loader/PopupLoader'

function Login() {
  const platformAuthenticatorAvailable = useLoaderData()
  return (
    <div>
      <Section>
        <LoginPassword />
      </Section>
      <h1>{`platform authenticator available: ${platformAuthenticatorAvailable}`}</h1>
      <Section>
        <LoginAuthenticatorPasswordless />
      </Section>
      <Section>
        <LoginAuthenticatorUsernameless />
      </Section>
    </div>
  )
}

export default Login
