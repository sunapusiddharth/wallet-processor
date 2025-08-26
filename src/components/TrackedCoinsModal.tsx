'use client'

import { useTrackCoin, useTrackedCoins, useTrackedWallets } from '../hooks/useTrackedAssets'
import { useTrackWallet } from '../hooks/useTrackedAssets'

type Props = {
    onClose: () => void
}

const TrackedCoinsModal = ({ onClose }: Props) => {
    const { data: trackedWallets = [] } = useTrackedCoins()

    return (
        <div className="fixed inset-0 bg-black bg-opacity-60 flex items-center justify-center z-50">
            <div className="bg-zinc-900 rounded-lg shadow-xl w-full max-w-lg p-6 relative border border-zinc-700">
                <button
                    onClick={onClose}
                    className="absolute top-4 right-4 text-gray-400 hover:text-white text-xl"
                >
                    ×
                </button>
                <h2 className="text-white text-lg font-semibold mb-4">Tracked Coins</h2>

                {trackedWallets.length === 0 ? (
                    <p className="text-gray-400 text-sm">No coins tracked yet.</p>
                ) : (
                    <ul className="space-y-3">
                        {trackedWallets.map((wallet, index) => (
                            <Item wallet={wallet} trackedWallets={trackedWallets} index={index} />
                        ))}
                    </ul>
                )}
            </div>
        </div>
    )
}

export default TrackedCoinsModal


const Item = ({ wallet, trackedWallets, index }: { wallet: string, trackedWallets: string[], index: number }) => {
    const { mutate: trackWallet } = useTrackCoin()

    const isTracked = trackedWallets.includes(wallet)

    const handleTrack = () => {
        trackWallet({ coin:wallet, isTracked })
    }
    return (
        <li
            key={index}
            className="flex items-center justify-between bg-zinc-800 p-2 rounded-md"
        >
            <a
                href={`https://www.dextools.io/app/en/token/${wallet}`}
                target="_blank"
                rel="noopener noreferrer"
                className="hover:underline block overflow-hidden whitespace-nowrap text-ellipsis"
            >
                {wallet}
            </a>
            <button
                onClick={handleTrack}
                className={`px-2 py-1 text-xs text-white rounded transition ${isTracked ? 'bg-gray-600 cursor-not-allowed' : 'bg-blue-700 hover:bg-blue-600'
                    }`}
            >
                {isTracked ? 'UnTrack' : 'Track'}
            </button>
        </li>
    )

}