import { FunctionComponent, ReactNode } from 'react'

type Props = {
  children?: ReactNode
  Icon?: FunctionComponent
  onClick: () => void
  disabled?: boolean
  className?: string
}
export const Button = ({
  children,
  Icon,
  onClick,
  disabled,
  className,
}: Props) => (
  <button
    onClick={onClick}
    className={`flex items-center justify-center gap-1 rounded-lg bg-gray-300 py-2 px-4 font-light text-gray-800 hover:bg-gray-400 active:bg-gray-500 disabled:bg-gray-300 disabled:text-gray-400 ${className}`}
    disabled={disabled}
  >
    {Icon ? <Icon /> : null}
    {children}
  </button>
)
