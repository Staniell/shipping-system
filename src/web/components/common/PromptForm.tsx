import React from 'react'
import Button from './Button'

export default function PromptForm({
  onNo,
  onYes,
  label = 'Are you sure you want to delete this workspace?',
}: {
  onNo: () => void
  onYes: () => void
  label?: string
}) {
  return (
    <div className="flex flex-col items-center gap-y-2 rounded-lg bg-white p-4">
      <p className="mt-4">{label}</p>
      <div className="flex w-full items-center justify-center gap-x-3">
        <Button onClick={onNo}>No</Button>
        <Button onClick={onYes}>Yes</Button>
      </div>
    </div>
  )
}
