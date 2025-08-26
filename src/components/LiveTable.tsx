import React, { useEffect, useRef, useState } from 'react'

export interface Column<T> {
    header: string
    accessor: keyof T | ((row: T) => React.ReactNode)
}

interface LiveTableProps<T extends { timestamp: string }> {
    initialData: T[]
    columns: Column<T>[]
    onNewData: () => T
}

export function LiveTable<T extends { timestamp: string }>({
    initialData,
    columns,
    onNewData,
}: LiveTableProps<T>) {
    type Row = { id: string; data: T }
    const [rows, setRows] = useState<Row[]>(() =>
        initialData.map((d) => ({ id: d.timestamp, data: d }))
    )
    const [newIds, setNewIds] = useState<Set<string>>(new Set())

    useEffect(() => {
        const interval = setInterval(() => {
          const data = onNewData()
          const id = `${data.timestamp}-${Math.random()}`
          setRows((prev) => {
            const next = [{ id, data }, ...prev]
            return next.length > 50 ? next.slice(0, 50) : next
          })
          setNewIds((s) => new Set(s).add(id))
          setTimeout(() => {
            setNewIds((s) => {
              const c = new Set(s)
              c.delete(id)
              return c
            })
          }, 1000)
        }, 2000)
      
        return () => clearInterval(interval)
      }, [onNewData])

    return (
        <table className="min-w-full  rounded overflow-hidden shadow">
            <thead className="bg-gray-500 ">
                <tr>
                    {columns.map((col, i) => (
                        <th
                            key={i}
                            className="px-4 py-2 text-left text-gray-300 text-sm uppercase tracking-wider"
                        >
                            {col.header}
                        </th>
                    ))}
                </tr>
            </thead>
            <tbody>
                {rows.map(({ id, data }) => (
                    <tr
                        key={id}
                        className={`transition-colors duration-500 ${newIds.has(id) ? 'animate-new-row' : ''
                            }`}
                    >
                        {columns.map((col, ci) => {
                            const cell = typeof col.accessor === 'function'
                                ? col.accessor(data)
                                : (data[col.accessor] as any)
                            return (
                                <td
                                    key={ci}
                                    className="border-t px-4 py-2 text-sm text-gray-200"
                                >
                                    {cell}
                                </td>
                            )
                        })}
                    </tr>
                ))}
            </tbody>
        </table>
    )
}
