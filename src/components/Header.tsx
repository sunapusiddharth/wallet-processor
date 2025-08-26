'use client'
import { useUIStore } from '../store/index'

const Header = () => {
  const toggleDrawer = useUIStore((state) => state.toggleDrawer)

  return (
    <header className="flex items-center justify-between px-4 py-3 bg-gray-800 text-white">
      <button onClick={toggleDrawer} className="focus:outline-none">
        <svg className="h-6 w-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2}
            d="M4 6h16M4 12h16M4 18h16" />
        </svg>
      </button>
      <div className="flex-grow mx-4">
        <input
          className="w-full px-3 py-1 rounded bg-gray-700 text-white focus:outline-none"
          type="text"
          placeholder="Search wallets..."
        />
      </div>
    </header>
  )
}

export default Header
