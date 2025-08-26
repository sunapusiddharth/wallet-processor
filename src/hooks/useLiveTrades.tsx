import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { subscribeToTrades } from '../utils/socket'
import type { SwapData } from '../interfaces'
import { fetchSwaps } from '../api'

export const useLiveTrades = () => {
  const queryClient = useQueryClient()

  const { data, isLoading, isError } = useQuery<SwapData[]>({
    queryKey: ['live-trades'],
    queryFn: fetchSwaps,       // ✅ Initial fetch from REST
    // initialData: [],           // You can omit this if you prefer fallback = []
  })
  useEffect(() => {
    // ✅ Push real-time swaps into the React Query cache
    subscribeToTrades((newTrades: SwapData[]) => {
      queryClient.setQueryData(['live-trades'], (oldData?: SwapData[]) => {
        const existing = oldData || []
        const updated = [...newTrades, ...existing].slice(0, 50) // latest 50
        return updated
      })
    })
  }, [queryClient])

  return {
    trades: data || [],
    isLoading,
    isError,
  }
}
