// components/MemecoinTable.tsx

import { useEffect } from 'react'
import { useMemecoinData, useAddMemecoin } from '../../hooks/useMemecoin'
import { Memecoin } from '../../interfaces'
import { generateMemecoin } from '../../mock/dataGenerator'
import { Column, LiveTable } from '../LiveTable'

const columns: Column<Memecoin>[] = [
    { header: 'Symbol', accessor: 'symbol' },
    { header: 'Name', accessor: 'name' },
    { header: 'Chain', accessor: 'chain' },
    { header: 'Exchange', accessor: 'exchange' },
    { header: 'Price (USD)', accessor: (r) => `$${r.priceUSD.toFixed(6)}` },
    { header: '24h Change (%)', accessor: (r) => `${r.priceChange24h.toFixed(2)}%` },
    { header: 'Volume (USD)', accessor: (r) => `$${r.volume24hUSD.toLocaleString()}` },
    { header: 'Liquidity', accessor: (r) => `$${r.liquidityUSD.toLocaleString()}` },
    { header: 'Market Cap', accessor: (r) => `$${r.marketCapUSD.toLocaleString()}` },
    { header: 'FDV', accessor: (r) => `$${r.fdvUSD.toLocaleString()}` },
    { header: 'Txns (24h)', accessor: 'txns24h' },
    { header: 'Social Score', accessor: (r) => r.socialScore.toFixed(2) },
    { header: 'Volatility', accessor: (r) => r.metrics.volatility24h.toFixed(2) },
    { header: 'Volume/MCAP', accessor: (r) => r.metrics.volumeToMCAP.toFixed(4) },
    { header: 'Buy/Sell Ratio', accessor: (r) => r.metrics.buySellRatio.toFixed(2) },
    { header: 'Whale Activity', accessor: (r) => r.metrics.whaleActivity.toFixed(2) },
]


export function MemecoinTable() {
    const { data: initial = [] } = useMemecoinData()
    const add = useAddMemecoin()

    useEffect(() => {
        const iv = setInterval(() => {
            add.mutate(generateMemecoin())
        }, 2000)
        return () => clearInterval(iv)
    }, [add])

    return (
        <div className="p-4">
            <LiveTable
                initialData={initial}
                columns={columns}
                onNewData={generateMemecoin}
            />
        </div>
    )
}
