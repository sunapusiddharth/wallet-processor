'use client'
import { useState, useEffect } from 'react'
import { useTrackWallet, useTrackedWallets } from '../hooks/useTrackedAssets'
import { SwapData } from '../interfaces/index'
import { formatDistanceToNow } from 'date-fns'

type Props = {
  data: SwapData
  onPull: () => void
}

const TraderItem = ({ data, onPull }: Props) => {
  const { data: trackedWallets = [] } = useTrackedWallets()
  const { mutate: trackWallet } = useTrackWallet()

  const { coinName, traderAddress, pnl, totalSpent, timestamp } = data

  const isTracked = trackedWallets.includes(traderAddress)

  const handleTrack = () => {
    debugger
    trackWallet({ wallet: traderAddress, isTracked })
  }


  return (
    <div className="bg-zinc-900 border border-zinc-700 rounded-md p-4 mb-4 shadow hover:shadow-lg transition">
      <button onClick={() => alert('test')} className="bg-green-500 text-white">Test Button</button>

      <div className="text-xs text-gray-400 mb-1 truncate max-w-full">
        <a
          href={`https://etherscan.io/address/${traderAddress}`}
          target="_blank"
          rel="noopener noreferrer"
          className="hover:underline block overflow-hidden whitespace-nowrap text-ellipsis"
        >
          {traderAddress}
        </a>
      </div>

      <div className="flex justify-between items-center">
        <a
          href={`https://www.dextools.io/app/en/token/${coinName}`}
          target="_blank"
          rel="noopener noreferrer"
          className="text-sm font-bold text-white hover:underline"
        >
          {coinName}
        </a>
        <div className="text-xs text-gray-400 text-right space-y-0.5">
          <div>PnL: {pnl.toFixed(2)}</div>
          <div>Spent: {totalSpent.toFixed(2)}</div>
          <div>{formatDistanceToNow(new Date(timestamp))} ago</div>
        </div>
      </div>
      <button
        data-no-drag
        onClick={() => {
          alert('Clicked')
          handleTrack()
        }}
        className="px-2 py-1 text-xs text-white rounded bg-blue-700 hover:bg-blue-600"
      >
        {isTracked ? 'UnTrack' : 'Track'}
      </button>


      <div className="mt-3 flex gap-2">
        <button
          // onClick={handleTrack}
          onClick={() => {
            try {
              alert('Clicked')
              handleTrack()
            } catch (err) {
              console.error('Error in onClick:', err)
            }
          }}

          // className={`px-2 py-1 text-xs text-white rounded transition ${
          //   isTracked ? 'bg-red-700 hover:bg-red-600' : 'bg-blue-700 hover:bg-blue-600'
          // }`}
          className="px-2 py-1 text-xs text-white rounded bg-blue-700 hover:bg-blue-600"


        >
          {isTracked ? 'UnTrack' : 'Track1'}
        </button>
        <button
          onClick={onPull}
          className="px-2 py-1 text-xs bg-purple-700 text-white rounded hover:bg-purple-600 transition"
        >
          Pull
        </button>
      </div>
    </div>
  )
}


export default TraderItem
