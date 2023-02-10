import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Section = ({ children }: Props) => {
  return (
    <section className='my-2 rounded-lg bg-white shadow'>{children}</section>
  )
}
