import { useQueryClient, useQuery } from '@tanstack/react-query'
import { useEffect } from 'react'
import { subscribeToTrades } from '../utils/socket'
import { SwapData } from '../interfaces'

export const useLiveTrades = () => {
  const queryClient = useQueryClient()
  const { data } = useQuery<SwapData[]>({
    queryKey: ['live-trades'],
    initialData: [],
  })

  useEffect(() => {
    subscribeToTrades((newTrades) => {
      queryClient.setQueryData(['live-trades'], () => newTrades)
    })
  }, [queryClient])

  return { trades: data || [] }
}
