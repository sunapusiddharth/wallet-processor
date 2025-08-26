'use client'
import TraderItem from './TraderItem'
import { useLiveTrades } from '../hooks/useLiveTrades'
import { useGridStore } from '../store/gridStore'

export const TradersLiveStats = () => {
    const { trades } = useLiveTrades()
    const addPanel = useGridStore((s) => s.addPanel)
    return (
        <div className="max-w-2xl mx-auto p-4">
            <div className="p-2 text-white">
                <h2>Traders Live Stats</h2>
                {/* Add mock content for testing */}
            </div>
            {trades.map((trade, index) => (
                <TraderItem
                    key={index}
                    data={trade}
                    onPull={() =>{
                        debugger
                        addPanel({
                            id: `trader-${index}`,
                            type: 'TraderChart',
                            props: { address: trade.traderAddress },
                        })
                    }
                        
                    }
                />
            ))}
        </div>
    )
}

