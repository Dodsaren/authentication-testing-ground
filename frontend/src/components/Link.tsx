import { ReactNode } from 'react'
import { Link as RrdLink } from 'react-router-dom'

type Props = {
  children: ReactNode
  to: string
}

export const Link = ({ children, to }: Props) => {
  return (
    <RrdLink
      className='text-sky-800 underline visited:text-violet-800 active:text-sky-600'
      to={to}
    >
      {children}
    </RrdLink>
  )
}
