// lib/api.ts

import axios from 'axios'
import type { CoinStats, SwapData } from './interfaces'
import {
  generateTraderAddresses,
  generateCoins,
  simulateSwaps,
} from './simulation'
import { generateSwapData } from './mock/dataGenerator'

// const USE_MOCK = process.env.NEXT_PUBLIC_USE_MOCK === 'true'
export const USE_MOCK = true

// initialize mock pools
export const traderAddresses = generateTraderAddresses(50)
export const coinPool = generateCoins(20)


let mockSwaps: SwapData[] = []
let mockCoins: CoinStats[] = []

export const initMockData = () => {
  const traderAddresses = generateTraderAddresses(50)
  const coinPool = generateCoins(20)
  const result = simulateSwaps(traderAddresses, coinPool, {
    maxCoinPerTrader: 7,
    maxSwapsPerCoin: 15,
    timeWindowDays: 3,
  })
  mockSwaps = result.swaps
  mockCoins = result.updatedCoins
}

const apiClient = axios.create({
  baseURL: typeof window !== 'undefined' ? '' : 'http://localhost:3000',
  timeout: 5_000,
})


/**
 * Fetch the current list of CoinStats.
 * If USE_MOCK, returns the evolving mockCoins state.
 */
export const fetchCoins = async (): Promise<CoinStats[]> => {
  if (USE_MOCK) {
    return mockCoins
  }
  const res = await apiClient.get<CoinStats[]>('/api/coins')
  return res.data
}
initMockData() // must run before any useQuery or fetchSwaps call
/**
 * Fetch the recorded swaps (trader activity).
 * If USE_MOCK, returns the batch of simulated mockSwaps.
 */
export const fetchSwaps = async (): Promise<SwapData[]> => {
  if (USE_MOCK) {
    return mockSwaps
  }
  const res = await apiClient.get('/api/swaps')
  console.log("API response:", res.data)
  return res.data
}


/**
 * Optionally expose the raw trader addresses pool.
 * Use this if you need to list traders (addresses) themselves.
 */
export const fetchTraderAddresses = async (): Promise<string[]> => {
  if (USE_MOCK) {
    return traderAddresses
  }

  const res = await apiClient.get<string[]>('/api/traders')
  return res.data
}
export const trackedCoins: string[] = []
export const trackedWallets: string[] = []
export const fetchTrackedCoins = async (): Promise<string[]> => {
  if (USE_MOCK) {
    return trackedCoins // Define this mock array somewhere
  }
  const res = await apiClient.get<string[]>('/api/tracked-coins')
  return res.data
}


export const fetchTrackedWallets = async (): Promise<string[]> => {
  if (USE_MOCK) {
    return trackedWallets // Define this mock array somewhere
  }
  const res = await apiClient.get<string[]>('/api/tracked-wallets')
  return res.data
}

export const putTrackWallet = async (wallet: string): Promise<string> => {
  if (USE_MOCK) {
    console.log("from putTrackWallet", wallet, trackedWallets)
    if (!trackedWallets.includes(wallet)) trackedWallets.push(wallet)
    return wallet
  }

  const res = await apiClient.put(`/api/tracked-wallets/${wallet}`)
  return res.data
}

export const deleteTrackWallet = async (wallet: string): Promise<string> => {
  if (USE_MOCK) {
    const index = trackedWallets.indexOf(wallet)
    if (index > -1) trackedWallets.splice(index, 1)
    return wallet
  }

  const res = await apiClient.delete(`/api/tracked-wallets/${wallet}`)
  return res.data
}
export const putTrackCoin = async (coin: string): Promise<string> => {
  if (USE_MOCK) {
    if (!trackedCoins.includes(coin)) trackedCoins.push(coin)
    return coin
  }

  const res = await apiClient.put(`/api/tracked-coins/${coin}`)
  return res.data
}

export const deleteTrackCoin = async (coin: string): Promise<string> => {
  if (USE_MOCK) {
    const index = trackedCoins.indexOf(coin)
    if (index > -1) trackedCoins.splice(index, 1)
    return coin
  }

  const res = await apiClient.delete(`/api/tracked-coins/${coin}`)
  return res.data
}


export async function fetchSwapData(): Promise<SwapData[]> {
  const data = []
  for (let i = 0; i < 1000; i++) {
    data.push(generateSwapData())
  }
  return Promise.resolve(data)

  // const { data } = await axios.get('/api/swap-data')
  // return data
}


export async function postSwapData(entry: SwapData): Promise<SwapData> {
  return Promise.resolve(generateSwapData())
  // const { data } = await axios.post('/api/swap-data', entry)
  // return data
}
