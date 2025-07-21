import React from 'react'
import Label from './Label'

export default function TextInput({
  label,
  placeholder,
  type = 'text',
  onChange,
  name,
  defaultValue,
}: {
  label?: string
  placeholder: string
  type?: 'text' | 'number' | 'email' | 'password'
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  name?: string
  defaultValue?: string | number
}) {
  return (
    <div className="mt-4">
      {label && (
        <div className="mb-0.5">
          <Label text={label} />
        </div>
      )}
      <input
        onChange={onChange}
        type={type}
        placeholder={placeholder}
        name={name}
        defaultValue={defaultValue}
        className="w-full rounded-lg border-[1.5px] border-gray-300 p-2 text-sm transition placeholder:text-gray-400 focus:border-blue-500 focus:outline-none focus:ring-1 focus:ring-blue-500"
      />
    </div>
  )
}
