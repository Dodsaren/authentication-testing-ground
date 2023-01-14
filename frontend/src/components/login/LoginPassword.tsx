import { useReducer, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../Button'
import { LoginIcon } from '../icons/LoginIcon'
import { TextInput } from '../TextInput'

type State = {
  username: string
  password: string
}

type Action = {
  payload: string
  type: 'setUsername' | 'setPassword'
}

export const LoginPassword = () => {
  const navigate = useNavigate()
  const [state, dispatch] = useReducer(reducer, {
    username: '',
    password: '',
  })
  const [error, setError] = useState(false)
  const onLoginClick = async () => {
    const response = await fetch('http://localhost:3000/classic/login', {
      credentials: 'include',
      method: 'POST',
      headers: new Headers({
        'Content-Type': 'application/json',
      }),
      body: JSON.stringify({
        username: state.username,
        password: state.password,
      }),
    })
    if (response.status !== 200) {
      setError(true)
      return
    }
    navigate('/protected')
  }
  return (
    <>
      <h2 className='text-2xl font-bold underline'>password</h2>
      <label>
        username
        <TextInput
          type='text'
          value={state.username}
          onChange={(e) => {
            dispatch({ type: 'setUsername', payload: e.target.value })
          }}
        />
      </label>
      <label>
        password
        <TextInput
          type='password'
          className='mb-5'
          value={state.password}
          onChange={(e) => {
            dispatch({ type: 'setPassword', payload: e.target.value })
          }}
        />
      </label>
      <Button onClick={onLoginClick}>
        <LoginIcon />
        login
      </Button>
      {error && <p className='text-red-600'>Wrong username or password</p>}
    </>
  )
}

const reducer = (state: State, action: Action): State => {
  const { type, payload } = action
  switch (type) {
    case 'setUsername':
      return {
        ...state,
        username: payload,
      }
    case 'setPassword':
      return {
        ...state,
        password: payload,
      }
    default:
      return state
  }
}
