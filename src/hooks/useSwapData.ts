import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { fetchSwapData, postSwapData } from '../api'
import { SwapData } from '../interfaces'

export function useSwapData() {
  return useQuery<SwapData[], Error>(['swapData'], fetchSwapData)
}

export function useAddSwapData() {
  const qc = useQueryClient()
  return useMutation<SwapData, Error, SwapData>(postSwapData, {
    onSuccess(newEntry) {
      // Prepend new entry to the cache and cap at 50
      qc.setQueryData<SwapData[]>(['swapData'], (old = []) => {
        const next = [newEntry, ...old]
        return next.length > 50 ? next.slice(0, 50) : next
      })
    },
  })
}
