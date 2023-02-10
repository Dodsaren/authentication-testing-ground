import { useState } from 'react'
import { useMutation } from 'react-query'
import { Button } from '../Button'
import { FingerPrintIcon } from '../icons'
import { TextInput } from '../TextInput'
import { startAuthentication } from '@simplewebauthn/browser'
import { AuthenticationCredentialJSON } from '@simplewebauthn/typescript-types'
import { useNavigate } from 'react-router-dom'
import { usePopupLoader } from '../loader/PopupLoader'

export const LoginAuthenticatorPasswordless = () => {
  const { setOpen } = usePopupLoader()
  const [username, setUsername] = useState('')
  const navigate = useNavigate()
  const loginRequestMutation = useMutation((body: { username: string }) =>
    fetch('http://localhost:3000/biometrics/loginRequest', {
      method: 'POST',
      headers: { 'content-type': 'application/json' },
      body: JSON.stringify(body),
    }).then((x) => x.json()),
  )
  const loginResponseMutation = useMutation(
    (body: { options: AuthenticationCredentialJSON; username: string }) =>
      fetch('http://localhost:3000/biometrics/loginResponse', {
        method: 'POST',
        headers: { 'content-type': 'application/json' },
        body: JSON.stringify(body),
        credentials: 'include',
      }).then((x) => x.json()),
  )
  const onLoginClick = async () => {
    try {
      const requestResponse = await loginRequestMutation.mutateAsync({
        username,
      })
      setOpen(true)
      const options = await startAuthentication(requestResponse)
      console.log('options', options)
      const verification = await loginResponseMutation.mutateAsync({
        options,
        username,
      })
      if (verification.ok) {
        console.log('verficiation ok, user authenticated')
        navigate('/protected')
      } else {
        console.log('authentication failed, try again')
      }
    } catch (error) {
      console.log(error)
    } finally {
      setOpen(false)
    }
  }
  return (
    <div>
      <h2 className='mb-5 text-2xl font-bold'>authenticator passwordless</h2>
      <TextInput
        className='mb-5'
        type='text'
        value={username}
        label='username'
        onChange={(e) => {
          setUsername(e.target.value)
        }}
        autoComplete='webauthn'
      />
      <Button onClick={onLoginClick}>
        <FingerPrintIcon />
        login
      </Button>
    </div>
  )
}
