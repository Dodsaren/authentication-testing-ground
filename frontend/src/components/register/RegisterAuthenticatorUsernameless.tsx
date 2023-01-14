import { startRegistration } from '@simplewebauthn/browser'
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
  PublicKeyCredentialUserEntityJSON,
} from '@simplewebauthn/typescript-types'
import { useMutation, useQueryClient } from 'react-query'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button'
import { FingerPrintIcon } from '../icons/FingerPrintIcon'

type RegisterRequestBody = {
  dateString: string
}

type RegisterResponseBody = {
  credential: RegistrationCredentialJSON
  userHandle: PublicKeyCredentialUserEntityJSON
}

export const RegisterAuthenticatorUsernameless = () => {
  const queryClient = useQueryClient()
  const navigate = useNavigate()
  const { mutateAsync: registerBiometricsRequest } = useMutation(
    async (
      body: RegisterRequestBody,
    ): Promise<PublicKeyCredentialCreationOptionsJSON> => {
      const x = await fetch(
        'http://localhost:3000/biometrics/registerRequestUsernameless',
        {
          method: 'POST',
          credentials: 'include',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(body),
        },
      )
      return await x.json()
    },
  )
  const { mutateAsync: registerBiometricsResponse } = useMutation(
    async (body: RegisterResponseBody) => {
      const x = await fetch(
        'http://localhost:3000/biometrics/registerResponseUsernameless',
        {
          method: 'POST',
          credentials: 'include',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
          body: JSON.stringify(body),
        },
      )
      return await x.json()
    },
  )

  const onRegisterBimoetricsClick = async () => {
    const d = new Date()
    const data = await registerBiometricsRequest({
      dateString: d.toLocaleString(),
    })
    let attResp
    try {
      // Pass the options to the authenticator and wait for a response
      attResp = await startRegistration(data)
    } catch (error) {
      // Some basic error handling
      console.log(error)
      if (!(error instanceof Error)) {
        throw error
      }
      if (error.name === 'InvalidStateError') {
      }
      return
    }
    await registerBiometricsResponse({
      credential: attResp,
      userHandle: data.user,
    })
    navigate('/protected')
  }

  if (status === 'loading') {
    return <>Loading...</>
  }

  if (status === 'error') {
    return <>Error loading authenticators</>
  }

  return (
    <>
      <h2 className='text-2xl font-bold underline'>authenticator</h2>
      <label>
        <Button onClick={onRegisterBimoetricsClick}>
          <FingerPrintIcon />
          register
        </Button>
      </label>
    </>
  )
}
