'use client'
import React, { useState, useEffect, useMemo, useCallback } from 'react'
import ReactECharts from 'echarts-for-react'
import { CoinActivity } from '../../interfaces'
import { generateCoinActivityData } from '../../mock/dataGenerator'
import TraderModal from '../modals/TraderModal'

function updateTraderCounts(data:CoinActivity[]) {
    return data.map(coin => {
        const change = Math.floor(Math.random() * 21) - 10 // -10 to +10
        return {
            ...coin,
            trader_count: Math.max(0, coin.traders_count + change)
        }
    })
}

export const TraderActivityChart: React.FC = () => {
    const [data, setData] = useState<CoinActivity[]>([])
    const [modalCoin, setModalCoin] = useState<CoinActivity | null>(null)

    // 1. Generate one static snapshot of coin activity
    useEffect(() => {
        setData(generateCoinActivityData(20))
    }, [])
    useEffect(() => {
        const intervalId = setInterval(() => {
            const newData= updateTraderCounts(data)
            setData([...data,...newData])
        }, 1000) // 1 second
        return () => clearInterval(intervalId)
    }, [])
    

    // 2. ECharts option
    const option = useMemo(() => {
        if (data.length === 0) return {}

        return {
            backgroundColor: '#1e1e1e',
            tooltip: {
                trigger: 'item',
                formatter: (params: any) => {
                    const d: CoinActivity = params.data
                    return `
            <strong>${d.coin_symbol}</strong> – ${d.coin_name}<br/>
            Price: $${d.coin_price?.toFixed(4)}<br/>
            Traders: ${d.traders_count}
          `
                },
            },
            xAxis: {
                type: 'value',
                name: 'Trader Count',
                axisLabel: { color: '#ccc' },
                nameTextStyle: { color: '#ccc' },
            },
            yAxis: {
                type: 'category',
                name: 'Coin',
                data: data.map((d) => d.coin_symbol),
                inverse: true,
                axisLabel: { color: '#ccc' },
                nameTextStyle: { color: '#ccc' },
            },
            series: [
                {
                    type: 'bar',
                    data: data.map((d) => ({
                        ...d,
                        value: d.traders_count,
                    })),
                    encode: {
                        x: 'value',        // value → traders_count
                        y: 'coin_symbol',  // category → coin_symbol
                    },
                    itemStyle: {
                        color: '#00bcd4',
                    },
                    label: {
                        show: true,
                        position: 'right',
                        color: '#fff',
                        formatter: '{b}',  // show the coin_symbol at bar end
                    },
                },
            ],
        }
    }, [data])

    // 3. Click handler to open modal
    const onChartClick = useCallback((params: any) => {
        if (params?.data) {
            setModalCoin(params.data as CoinActivity)
        }
    }, [])

    return (
        <div className="bg-zinc-900 p-4 rounded-lg">
            <ReactECharts
                option={option}
                style={{ height: 400, width: '100%' }}
                theme="dark"
                onEvents={{ click: onChartClick }}
            />
            {modalCoin && (
                <TraderModal coin={modalCoin} onClose={() => setModalCoin(null)} />
            )}
        </div>
    )
}
