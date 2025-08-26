// store/rankerConfigStore.ts
import { create } from 'zustand'
import { RankerConfig } from '../types'

const defaultConfig: RankerConfig = {
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

export const useRankerConfigStore = create<{
  config: RankerConfig
  updateConfig: (key: keyof RankerConfig, value: any) => void
  saveConfig: () => Promise<void>
}>((set, get) => ({
  config: defaultConfig,
  updateConfig: (key, value) =>
    set((state) => ({
      config: {
        ...state.config,
        [key]: value,
      },
    })),
  saveConfig: async () => {
    await new Promise((r) => setTimeout(r, 500)) // simulate API delay
    console.log('Saved config:', get().config)
  },
}))
