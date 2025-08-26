import { useMutation, useQueryClient } from '@tanstack/react-query'
import {
  trackedWallets,
  USE_MOCK,
  putTrackWallet,
  deleteTrackWallet,
  deleteTrackCoin,
  putTrackCoin,
  trackedCoins,
} from '../api'

import { useQuery } from '@tanstack/react-query'
import { fetchTrackedWallets, fetchTrackedCoins } from '../api'

export const useTrackedWallets = () =>
  useQuery({
    queryKey: ['trackedWallets'],
    queryFn: fetchTrackedWallets,
    staleTime: Infinity,
    cacheTime: Infinity,
  })

export const useTrackedCoins = () =>
  useQuery({
    queryKey: ['trackedCoins'],
    queryFn: fetchTrackedCoins,
    staleTime: Infinity,
    cacheTime: Infinity,
  })

export const useTrackWallet = () => {
  const queryClient = useQueryClient()

  return useMutation({
    mutationFn: async ({ wallet, isTracked }: { wallet: string; isTracked: boolean }) => {
      return isTracked
        ? await deleteTrackWallet(wallet)
        : await putTrackWallet(wallet)
    },

    onSuccess: (_response, variables) => {
      const { wallet, isTracked } = variables
      const current = queryClient.getQueryData<string[]>(['trackedWallets']) || []

      let updated: string[] = current
      if (isTracked) {
        updated = current.filter((w) => w !== wallet)
        if (USE_MOCK) {
          const index = trackedWallets.indexOf(wallet)
          if (index > -1) trackedWallets.splice(index, 1)
        }
      } else {
        updated = [...current, wallet]
        if (USE_MOCK) trackedWallets.push(wallet)
      }

      queryClient.setQueryData(['trackedWallets'], updated)
    },
  })
}





export const useTrackCoin = () => {
    const queryClient = useQueryClient()
  
    return useMutation({
      mutationFn: async ({ coin, isTracked }: { coin: string; isTracked: boolean }) => {
        return isTracked
          ? await deleteTrackCoin(coin)
          : await putTrackCoin(coin)
      },
  
      onSuccess: (_response, variables) => {
        const { coin, isTracked } = variables
        const current = queryClient.getQueryData<string[]>(['trackedCoins']) || []
  
        let updated: string[] = current
        if (isTracked) {
          updated = current.filter((c) => c !== coin)
          if (USE_MOCK) {
            const index = trackedCoins.indexOf(coin)
            if (index > -1) trackedCoins.splice(index, 1)
          }
        } else {
          updated = [...current, coin]
          if (USE_MOCK) trackedCoins.push(coin)
        }
  
        queryClient.setQueryData(['trackedCoins'], updated)
      },
    })
  }