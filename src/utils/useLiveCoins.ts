import { useQuery, useQueryClient } from '@tanstack/react-query'
import { useEffect } from 'react'
import { subscribeToCoinStats } from '../utils/coinSocket'
import { CoinStats } from '../interfaces/index'

export const useLiveCoins = () => {
  const queryClient = useQueryClient()

  const { data, isLoading } = useQuery<CoinStats[]>({
    queryKey: ['live-coins'],
    initialData: [],
  })

  useEffect(() => {
    subscribeToCoinStats((newCoins) => {
      queryClient.setQueryData(['live-coins'], (prev?: CoinStats[]) => {
        const combined = [...newCoins, ...(prev || [])]
        return combined.slice(0, 100) // retain last 100
      })
    })
  }, [queryClient])

  return { coins: data || [], isLoading }
}
