import { FC } from 'react'

type Props = {
  Header: FC
  Body: FC
}
export const Card = ({ Header, Body }: Props) => (
  <>
    <header className='rounded-t-lg bg-slate-200 p-5'>
      <Header />
    </header>
    <article className='p-5'>
      <Body />
    </article>
  </>
)
