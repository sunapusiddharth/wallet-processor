'use client'
import React, { useEffect } from 'react'
import { useSwapData, useAddSwapData } from '../../hooks/useSwapData'
import { SwapData } from '../../interfaces'
import { generateSwapData } from '../../mock/dataGenerator'
import { Column, LiveTable } from '../LiveTable'

const columns: Column<SwapData>[] = [
  { header: 'Coin', accessor: 'coinName' },
  { header: 'Trader', accessor: 'traderAddress' },
  { header: 'P/L', accessor: (r) => r.pnl.toFixed(2) },
  { header: 'Total Spent', accessor: (r) => r.totalSpent.toFixed(2) },
  { header: 'Time', accessor: (r) => new Date(r.timestamp).toLocaleTimeString() },
  { header: 'Type', accessor: (r) => (r.isBuy ? 'Buy' : 'Sell') },
  { header: 'Price', accessor: (r) => r.price.toFixed(2) },
]

export function SwapTable() {
  const { data: initial = [] } = useSwapData()
  const add = useAddSwapData()

  useEffect(() => {
    const iv = setInterval(() => {
      const entry = generateSwapData()
      add.mutate(entry)
    }, 2000)
    return () => clearInterval(iv)
  }, [add])

  return (
    <div className="p-4">
      <LiveTable
        initialData={initial}
        columns={columns}
        onNewData={generateSwapData}
      />
    </div>
  )
}
