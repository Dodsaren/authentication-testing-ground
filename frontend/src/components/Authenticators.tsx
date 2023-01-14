import { useMutation, useQuery, useQueryClient } from 'react-query'
import { Button } from '../components/Button'
import { startRegistration } from '@simplewebauthn/browser'
import { RegistrationCredentialJSON } from '@simplewebauthn/typescript-types'
import { DeviceIcon, FingerPrintIcon, TrashIcon } from './icons'

export const Authenticators = () => {
  const queryClient = useQueryClient()
  const { mutateAsync: registerBiometricsRequest } = useMutation(async () => {
    const x = await fetch(
      'http://localhost:3000/biometrics/registerRequestAuthenticated',
      {
        method: 'POST',
        credentials: 'include',
        headers: new Headers({
          'Content-Type': 'application/json',
        }),
      },
    )
    return await x.json()
  })
  const { mutateAsync: registerBiometricsResponse } = useMutation(
    async (body: RegistrationCredentialJSON) => {
      const x = await fetch(
        'http://localhost:3000/biometrics/registerResponseAuthenticated',
        {
          method: 'POST',
          body: JSON.stringify(body),
          credentials: 'include',
          headers: new Headers({
            'Content-Type': 'application/json',
          }),
        },
      )
      return await x.json()
    },
    {
      onSuccess(data) {
        console.log('success', data)
        queryClient.invalidateQueries('authenticators')
      },
    },
  )

  const onRegisterBimoetricsClick = async () => {
    const data = await registerBiometricsRequest()
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
    await registerBiometricsResponse(attResp)
  }

  if (status === 'loading') {
    return <>Loading...</>
  }

  if (status === 'error') {
    return <>Error loading authenticators</>
  }

  return (
    <section className='py-2'>
      <h2 className='text-xl'>Registered authenticators:</h2>
      <AuthenticatorsList />
      <label>
        <Button onClick={onRegisterBimoetricsClick}>
          <FingerPrintIcon />
          register new authenticator
        </Button>
      </label>
    </section>
  )
}

type JSONResponse = {
  credentialId: string
}[]

type JSONRequest = {
  credentialId: string
}

const AuthenticatorsList = () => {
  const { data, refetch } = useQuery('authenticators', async () => {
    const response = await fetch(
      'http://localhost:3000/biometrics/authenticators',
      {
        credentials: 'include',
      },
    )
    const json: JSONResponse = await response.json()
    return json
  })
  const removeMutation = useMutation(async (body: JSONRequest) => {
    const x = await fetch('http://localhost:3000/biometrics/authenticator', {
      method: 'DELETE',
      body: JSON.stringify(body),
      credentials: 'include',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
    })
    return await x.json()
  })
  async function onRemoveAuthenticatorClick(this: JSONRequest) {
    // Remove authenticator from user
    const response = await removeMutation.mutateAsync(this)
    console.log(response)
    refetch()
  }
  if (!data || !data.length) {
    return <div>No authenticators registered</div>
  }
  return (
    <ul className='py-1'>
      {data.map((x) => (
        <li
          key={x.credentialId}
          className='flex justify-between bg-stone-200 font-mono'
        >
          <span className='flex p-2'>
            <span>
              <DeviceIcon />
            </span>
            <span className='overflow-hidden text-ellipsis whitespace-nowrap'>
              {x.credentialId.slice(0, 15)}
            </span>
          </span>
          <button
            onClick={onRemoveAuthenticatorClick.bind(x)}
            className='flex cursor-pointer bg-red-500 p-2 align-middle text-red-100 hover:bg-red-600 active:bg-red-700'
          >
            <TrashIcon />
          </button>
        </li>
      ))}
    </ul>
  )
}
