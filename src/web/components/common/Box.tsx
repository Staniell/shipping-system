import React from 'react'

export default function Box({
  title,
  count,
  icon,
  textColor,
  bgColor,
}: {
  title: string
  count: any
  icon: React.ReactNode
  textColor: string
  bgColor: string
}) {
  return (
    <div className={`flex w-full items-center gap-2 rounded-lg ${bgColor} p-3`}>
      {icon}
      <div className="flex flex-col gap-0.5">
        <p className="text-2xl font-bold">{count}</p>
        <p className={textColor}>{title}</p>
      </div>
    </div>
  )
}
