import { ChangeEvent } from 'react'

type Props = {
  type: string
  className?: string
  value?: string
  onChange?: (e: ChangeEvent<HTMLInputElement>) => void
  autoComplete?: string
  label?: string
}
export const TextInput = ({
  type,
  className = '',
  value,
  onChange,
  autoComplete,
  label,
}: Props) => (
  <label>
    <span className='hidden'>{label}</span>
    <input
      value={value}
      onChange={onChange}
      className={`block rounded-lg border p-3 text-sm font-light leading-tight text-gray-700 ${className}`}
      type={type}
      autoComplete={autoComplete}
      placeholder={label}
    />
  </label>
)
