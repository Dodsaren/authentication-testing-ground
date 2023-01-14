import { startRegistration } from '@simplewebauthn/browser'
import {
  PublicKeyCredentialCreationOptionsJSON,
  RegistrationCredentialJSON,
  PublicKeyCredentialUserEntityJSON,
} from '@simplewebauthn/typescript-types'
import { ChangeEvent, useState } from 'react'
import { useMutation, useQueryClient } from 'react-query'
import { redirect } from 'react-router-dom'
import { Button } from '../Button'
import { FingerPrintIcon } from '../icons/FingerPrintIcon'
import { TextInput } from '../TextInput'

type RegisterRequestBody = {
  username: string
}

type RegisterResponseBody = {
  credential: RegistrationCredentialJSON
  userHandle: PublicKeyCredentialUserEntityJSON
}

export const RegisterAuthenticatorPasswordless = () => {
  const [username, setUsername] = useState('')
  const queryClient = useQueryClient()
  const { mutateAsync: registerBiometricsRequest } = useMutation(
    async (
      body: RegisterRequestBody,
    ): Promise<PublicKeyCredentialCreationOptionsJSON> => {
      const x = await fetch(
        'http://localhost:3000/biometrics/registerRequestPasswordless',
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
        'http://localhost:3000/biometrics/registerResponsePasswordless',
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
    {
      onSuccess(data) {
        console.log('success', data)
        // queryClient.invalidateQueries('authenticators')
      },
    },
  )

  const onRegisterBimoetricsClick = async () => {
    const data = await registerBiometricsRequest({ username })
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
    redirect('/protected')
  }

  const onUsernameChange = (e: ChangeEvent<HTMLInputElement>) => {
    setUsername(e.target.value)
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
        username
        <TextInput
          className='mb-5'
          type='text'
          value={username}
          onChange={onUsernameChange}
        />
      </label>
      <label>
        <Button onClick={onRegisterBimoetricsClick}>
          <FingerPrintIcon />
          register
        </Button>
      </label>
    </>
  )
}
