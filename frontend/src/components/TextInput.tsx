import { ChangeEvent } from 'react'

type Props = {
  type: string
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
}
export const TextInput = ({
  type,
  className = '',
  value,
  onChange,
  autoComplete,
}: Props) => (
  <input
    value={value}
    onChange={onChange}
    className={`w-full rounded-l border py-2 px-3 leading-tight text-gray-700 shadow ${className}`}
    type={type}
    autoComplete={autoComplete}
  />
)
