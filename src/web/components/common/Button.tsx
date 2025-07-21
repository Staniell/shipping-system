import React from 'react'

export default function Button({
  onClick,
  children,
  type,
  disabled,
}: {
  onClick?: () => void
  children: React.ReactNode
  type?: 'button' | 'submit' | 'reset'
  disabled?: boolean
}) {
  return (
    <button
      disabled={disabled}
      type={type}
      onClick={() => {
        onClick?.()
      }}
      className="flex items-center gap-x-2 rounded-lg bg-gray-900 px-4 py-2.5 font-bold text-white hover:bg-gray-800 disabled:cursor-not-allowed disabled:bg-gray-400"
    >
      {children}
    </button>
  )
}
