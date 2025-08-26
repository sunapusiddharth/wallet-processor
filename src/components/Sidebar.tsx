'use client'

import { useState } from 'react'

import {
  WalletIcon,HomeIcon,CubeIcon,
  PresentationChartLineIcon,
} from '@heroicons/react/24/outline'


import TrackedWalletsModal from './TrackedWalletsModal'
import clsx from 'clsx'
import { useUIStore } from '../store'
import TrackedCoinsModal from './TrackedCoinsModal'

const Sidebar = () => {
  const { isDrawerOpen, closeDrawer } = useUIStore()
  const [showTrackedWalletsModal, setShowTrackedWalletsModal] = useState(false)
  const [showTrackedCoinsModal, setShowTrackedCoinModal] = useState(false)

  const sidebarItems = [
    {
      name: 'Dashboard',
      icon: <HomeIcon className="w-5 h-5 mr-2" />,
      action: () => closeDrawer(),
    },
    {
      name: 'Tracked Wallets',
      icon: <WalletIcon className="w-5 h-5 mr-2" />,
      action: () => {
        closeDrawer()
        setShowTrackedWalletsModal(true)
      },
    },
    {
      name: 'Tracked Coins',
      icon: <CubeIcon className="w-5 h-5 mr-2" />,
      action: () => {
        closeDrawer()
        setShowTrackedCoinModal(true)
      },
    },
  ]

  return (
    <>
      {/* Overlay */}
     {/* Overlay */}
{/* <div
  className={clsx(
    'fixed inset-0 bg-black bg-opacity-40 backdrop-blur z-40 transition-opacity',
    isDrawerOpen ? 'opacity-100' : 'opacity-0 '
  )}
  onClick={closeDrawer}
/> */}



      {/* Sidebar */}
      <aside
        className={clsx(
          'fixed top-0 left-0 h-full w-64 bg-zinc-900 shadow-xl z-50 transition-transform transform',
          isDrawerOpen ? 'translate-x-0' : '-translate-x-full'
        )}
      >
        <nav className="px-5 py-6 flex flex-col gap-6 text-white">
          {sidebarItems.map((item) => (
            <button
              key={item.name}
              onClick={item.action}
              className="flex items-center w-full text-sm px-3 py-2 rounded-md bg-zinc-800 hover:bg-zinc-700 transition duration-150 shadow hover:shadow-md"
            >
              {item.icon}
              <span className="tracking-wide">{item.name}</span>
            </button>
          ))}
        </nav>
      </aside>

      {/* Modal */}
      {showTrackedWalletsModal && (
        <TrackedWalletsModal onClose={() => setShowTrackedWalletsModal(false)} />
      )}
      {showTrackedCoinsModal && (
        <TrackedCoinsModal onClose={() => setShowTrackedCoinModal(false)} />
      )}
    </>
  )
}



export default Sidebar
