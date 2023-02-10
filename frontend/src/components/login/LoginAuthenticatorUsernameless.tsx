import { useMutation } from 'react-query'
import { Button } from '../Button'
import { FingerPrintIcon } from '../icons'
import { startAuthentication } from '@simplewebauthn/browser'
import {
  AuthenticationCredentialJSON,
  PublicKeyCredentialRequestOptionsJSON,
} from '@simplewebauthn/typescript-types'
import { useNavigate } from 'react-router-dom'

type LoginRequestResponse = {
  options: PublicKeyCredentialRequestOptionsJSON
  transactionId: string
}

type LoginResponseBody = {
  options: AuthenticationCredentialJSON
  transactionId: string
}

export const LoginAuthenticatorUsernameless = () => {
  const navigate = useNavigate()
  const loginRequestMutation = useMutation(
    (): Promise<LoginRequestResponse> =>
      fetch('http://localhost:3000/biometrics/loginRequestUsernameless', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
      }).then((x) => x.json()),
  )
  const loginResponseMutation = useMutation((body: LoginResponseBody) =>
    fetch('http://localhost:3000/biometrics/loginResponseUsernameless', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
      credentials: 'include',
    }).then((x) => x.json()),
  )
  const onLoginClick = async () => {
    try {
      const requestResponse = await loginRequestMutation.mutateAsync()
      const options = await startAuthentication(requestResponse.options)
      console.log('options created', options)
      const verification = await loginResponseMutation.mutateAsync({
        options,
        transactionId: requestResponse.transactionId,
      })
      if (verification.ok) {
        console.log('verficiation ok, user authenticated')
        navigate('/protected')
      } else {
        console.log('authentication failed, try again')
      }
    } catch (error) {
      console.log(error)
    }
  }
  return (
    <div>
      <h2 className='mb-5 text-2xl font-bold'>authenticator usernameless</h2>
      <Button onClick={onLoginClick}>
        <FingerPrintIcon />
        login
      </Button>
      {loginRequestMutation.isLoading ? <Loader /> : null}
    </div>
  )
}

const Loader = () => <div className='absolute top-1/2 left-1/2'>Laddar</div>
