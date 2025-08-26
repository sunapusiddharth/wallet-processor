import React, { useMemo } from 'react'
import { FixedSizeList as List } from 'react-window'
import { CoinActivity, TraderDetail } from '../../interfaces'
import { generateTraderDetail } from '../../mock/dataGenerator'

interface TraderModalProps {
  coin: CoinActivity
  onClose: () => void
}

const DURATIONS = ['5m', '15m', '30m', '1h', '6h', '24h']

export default function TraderModal({ coin, onClose }: TraderModalProps) {
  // Prepare table rows: one per trader
  const rows: TraderDetail[] = useMemo(
    () => coin.traders_addresses.map((addr) => generateTraderDetail(addr)),
    [coin.traders_addresses]
  )

  // Render a single row
  const Row = ({ index, style }: { index: number; style: React.CSSProperties }) => {
    const r = rows[index]
    return (
      <div
        style={style}
        className="grid grid-cols-[2fr_repeat(6,1fr)] gap-x-2 px-2 py-1 border-b text-sm"
      >
        <div>{r.trader_address}</div>
        <div>${r.amount_invested.toFixed(2)}</div>
        <div>{r.profit_5_min.toFixed(2)}</div>
        <div>{r.profit_15_min.toFixed(2)}</div>
        <div>{r.profit_30_min.toFixed(2)}</div>
        <div>{r.profit_1_hr.toFixed(2)}</div>
        <div>{r.profit_6_hr.toFixed(2)}</div>
        <div>{r.profit_24_hr.toFixed(2)}</div>
      </div>
    )
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50">
      <div className="bg-gray-800 w-11/12 max-w-4xl h-4/5 rounded-lg shadow-lg flex flex-col">
        {/* Header */}
        <div className="flex justify-between items-center p-4 border-b">
          <h2 className="text-xl font-semibold">
            Traders on {coin.coin_symbol}
          </h2>
          <button onClick={onClose} className="text-gray-600 hover:text-black">
            ✕
          </button>
        </div>

        {/* Column Titles */}
        <div className="grid grid-cols-[2fr_repeat(6,1fr)] gap-x-2 px-2 py-2 bg-gray-500 font-bold text-sm">
          <div>Address</div>
          <div>Invested</div>
          <div>P/L 5m</div>
          <div>P/L 15m</div>
          <div>P/L 30m</div>
          <div>P/L 1h</div>
          <div>P/L 6h</div>
          <div>P/L 24h</div>
        </div>

        {/* Virtualized Rows */}
        <List
          height={window.innerHeight * 0.6}
          itemCount={rows.length}
          itemSize={36}
          width="100%"
        >
          {Row}
        </List>
      </div>
    </div>
  )
}
