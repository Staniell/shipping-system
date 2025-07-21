import React, { useEffect, useState } from 'react'
import { addEvent } from '../../helpers/events'
import { CircleX } from 'lucide-react'
import { componentModal } from '../../helpers/modal'

export type ComponentModalType = {
  component: any
}

export default function ComponentModal() {
  const [data, setData] = useState<ComponentModalType | null>(null)

  useEffect(() => {
    addEvent('componentModal', (data: ComponentModalType | null) => {
      setData(data)
    })
  }, [])

  if (!data) {
    return null
  }

  return (
    <div className="fixed left-0 top-0 z-50 flex h-full w-full items-center justify-center bg-black bg-opacity-50">
      <div className="relative">
        <CircleX
          size={20}
          onClick={() => {
            componentModal(null)
          }}
          className="absolute right-2 top-2 cursor-pointer"
        />

        <div>{data.component}</div>
      </div>
    </div>
  )
}
