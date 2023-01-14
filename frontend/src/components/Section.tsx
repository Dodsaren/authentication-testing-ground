import { ReactNode } from 'react'

type Props = {
  children: ReactNode
}

export const Section = ({ children }: Props) => {
  return <section className='my-2 border bg-slate-50 p-2'>{children}</section>
}
