'use client'

import { useLiveCoins } from '../utils/useLiveCoins'
import CoinItem from './CoinItem'

export const CoinsLiveStats = () => {
  const { coins, isLoading } = useLiveCoins()

  return (
    <div className="max-w-5xl mx-auto px-4">
        <div className="p-2 text-white">
      <h2>Coins Live Stats</h2>
      {/* Add mock content for testing */}
      <p>Active Traders: 12</p>
    </div>
      {isLoading && <div className="text-gray-400 text-sm mb-2">Loading live coins...</div>}
      {coins.map((coin, index) => (
        <CoinItem key={index} data={coin} />
      ))}
    </div>
  )
}

