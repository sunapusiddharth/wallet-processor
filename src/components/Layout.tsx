'use client'
import Header from './Header'
import Sidebar from './Sidebar'

const MainLayout = ({ children }: { children: React.ReactNode }) => {
  return (
    <div className="min-h-screen bg-gray-100">
      {/* <Header /> */}
      {/* <Sidebar /> */}
      <main className="p-4">{children}</main>
    </div>
  )
}

export default MainLayout
