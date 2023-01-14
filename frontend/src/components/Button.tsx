import { FunctionComponent, ReactNode } from 'react'

type Props = {
  children?: ReactNode
  Icon?: FunctionComponent
  onClick: () => void
  disabled?: boolean
}
export const Button = ({ children, Icon, onClick, disabled }: Props) => (
  <button
    onClick={onClick}
    className='flex w-full items-center justify-center rounded-l bg-gray-300 py-2 px-4 font-bold text-gray-800 hover:bg-gray-400 active:bg-gray-500 disabled:bg-gray-300 disabled:text-gray-400'
    disabled={disabled}
  >
    {Icon ? <Icon /> : null}
    {children}
  </button>
)
