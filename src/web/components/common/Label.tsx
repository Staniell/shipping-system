import React from 'react'

export default function Label({ text }: { text: string }) {
  return <p className="text-sm font-medium text-gray-700">{text}</p>
}
