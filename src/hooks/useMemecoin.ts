// hooks/useMemecoin.ts

import { Memecoin } from "../interfaces"
import { generateMemecoin } from "../mock/dataGenerator"
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'


export function useMemecoinData() {
  return useQuery<Memecoin[], Error>(['memecoinData'], async () => {
    const data: Memecoin[] = Array.from({ length: 1000 }, generateMemecoin)
    return Promise.resolve(data)
  })
}

export function useAddMemecoin() {
  const qc = useQueryClient()
  return useMutation<Memecoin, Error, Memecoin>(() => {
    return Promise.resolve(generateMemecoin())
  }, {
    onSuccess(newEntry) {
      qc.setQueryData<Memecoin[]>(['memecoinData'], (old = []) => {
        const next = [newEntry, ...old]
        return next.length > 50 ? next.slice(0, 50) : next
      })
    },
  })
}
