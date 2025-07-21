import React from 'react'

export type ColumnDef<T> = {
  title: string
  accessorKey?: keyof T
  id?: string
  cell?: (props: { row: T; value?: T[keyof T] }) => React.ReactNode
}

interface TableProps<T> {
  columns: ColumnDef<T>[]
  data: T[]
  getRowId?: (row: T) => string
}

export default function Table<T extends object>({ columns, data, getRowId }: TableProps<T>) {
  return (
    <table className="mt-4 w-full text-center">
      <thead className="bg-gray-100 text-sm uppercase text-gray-700">
        <tr>
          {columns.map((column) => (
            <th key={column.id ?? (column.accessorKey as string)} className="px-6 py-3">
              {column.title}
            </th>
          ))}
        </tr>
      </thead>
      <tbody>
        {data?.map((row, index) => (
          <tr
            key={getRowId ? getRowId(row) : index}
            className={`${index % 2 === 0 ? 'bg-white' : 'bg-gray-50'} border-b`}
          >
            {columns.map((column) => {
              const value = column.accessorKey ? row[column.accessorKey] : undefined
              return (
                <td
                  key={column.id ?? (column.accessorKey as string)}
                  className="px-6 py-4 text-sm font-semibold"
                >
                  {column.cell
                    ? column.cell({ row, value })
                    : (value as React.ReactNode)}
                </td>
              )
            })}
          </tr>
        ))}
      </tbody>
    </table>
  )
}
