import { useEffect } from 'react'
import { initMockData } from '../api'
import { Dashboard } from '../components/Dashboard'
import Layout from '../components/Layout'

export default function Home() {
  useEffect(() => {
    if (true) {
      initMockData()
    }
  }, [])
  
  return (
    <Layout>
      <h1 className="text-2xl font-bold">Welcome, Siddharth 👋</h1>
      <p>Let’s track some wallets and optimize performance!</p>
      <Dashboard/>
    </Layout>
  )
}
