// components/TraderSummaryTable.tsx

import { useEffect } from 'react'
import { useTraderSummary, useAddTraderSummary } from '../../hooks/useTraderSummary'
import { TraderSummary } from '../../interfaces'
import { generateTraderSummary } from '../../mock/dataGenerator'
import { Column, LiveTable } from '../LiveTable'

const bucketDurations = ['5m', '15m', '30m', '1h', '6h', '24h']

const columns: Column<TraderSummary>[] = [
  { header: 'Trader', accessor: 'traderAddr' },
  { header: 'Coin', accessor: 'coin' },
  { header: 'Level', accessor: (r) => `L${r.level}` },
  { header: 'Score', accessor: (r) => r.score },
  { header: 'KOLs/Whales', accessor: (r) => r.kolsWhalesCount },
  { header: 'Profit I Made', accessor: (r) => `$${r.totalProfitIMade}` },
  { header: 'Last Job Run', accessor: (r) => new Date(r.timestamp).toLocaleTimeString() },
  ...bucketDurations.flatMap((duration) => [
    {
      header: `${duration} Made`,
      accessor: (r:TraderSummary) => {
        const b = r.buckets.find((b) => b.duration === duration)
        return b ? b.amountMade : '-'
      },
    },
    {
      header: `${duration} Exit`,
      accessor: (r:TraderSummary) => {
        const b = r.buckets.find((b) => b.duration === duration)
        return b ? b.exitValue : '-'
      },
    },
  ]),
]

export function TraderSummaryTable() {
    const { data: initial = [] } = useTraderSummary()
    const add = useAddTraderSummary()
  
    useEffect(() => {
      const iv = setInterval(() => {
        add.mutate(generateTraderSummary())
      }, 2000)
      return () => clearInterval(iv)
    }, [add])
  
    return (
      <div className="p-4">
        <LiveTable
          initialData={initial}
          columns={columns}
          onNewData={generateTraderSummary}
        />
      </div>
    )
  }
  