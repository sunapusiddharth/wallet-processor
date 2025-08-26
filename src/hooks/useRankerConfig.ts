// hooks/useRankerConfig.ts
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { useState } from 'react'
import { RankerConfig } from '../interfaces'

const mockConfig: RankerConfig = {
  AvoidAge: 3,
  MarketCapMin: 1000000,
  Volume10MinMin: 50000,
  PriceChangeThreshold10Min: 0.05,
  Txns10MinMin: 100,
  WhaleTxnUSDThreshold: 100000,
  MinAgePriorityMultiplier: 1.5,
  ReinsertDecay: 0.9,
  HeapSize: 50,
  HistoryLimit: 1000,
  Durations: [5, 10, 60],
  NewAgeThreshold: 3,
  FlushInterval: 1,
  EvictionInterval: 0.5,
  OldGrowthThresholdPercent: 0.05,
  UpdateWorkers: 4,
  FlushWorkers: 2,
  ShardCount: 16,
}

let configState = { ...mockConfig }

export const useRankerConfig = () => {
  return useQuery({
    queryKey: ['rankerConfig'],
    queryFn: async () => {
      await new Promise((r) => setTimeout(r, 300)) // simulate latency
      return configState
    },
  })
}

export const useUpdateRankerConfig = () => {
  const queryClient = useQueryClient()
  return useMutation({
    mutationFn: async (updated: Partial<RankerConfig>) => {
      configState = { ...configState, ...updated }
      return configState
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['rankerConfig'] })
    },
  })
}
