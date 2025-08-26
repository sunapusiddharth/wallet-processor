// hooks/useTraderSummary.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { TraderSummary } from '../interfaces'
import { generateTraderSummary } from '../mock/dataGenerator'

export function useTraderSummary() {
  return useQuery<TraderSummary[], Error>(['traderSummary'], async () => {
    const data: TraderSummary[] = Array.from({ length: 1000 }, generateTraderSummary)
    return Promise.resolve(data)
  })
}

export function useAddTraderSummary() {
  const qc = useQueryClient()
  return useMutation<TraderSummary, Error, TraderSummary>(() => {
    return Promise.resolve(generateTraderSummary())
  }, {
    onSuccess(newEntry) {
      qc.setQueryData<TraderSummary[]>(['traderSummary'], (old = []) => {
        const next = [newEntry, ...old]
        return next.length > 50 ? next.slice(0, 50) : next
      })
    },
  })
}
