// types/SwapData.ts


  // types/CoinStats.ts

export type CoinStats = {
    coinName: string
    createdOn: Date
    amount: number
    audit: boolean
    volume: number
    swaps: number
    traderSwaps: number
    liquidity: number
    volatility: number
    marketCap: number
  
    change5Min: number
    change15Min: number
    change30Min: number
    change1Hr: number
    change4Hrs: number
    change12Hrs: number
    change24Hrs: number
  
    traderCount: number
  }
  

  export enum EventType {
    CoinStats = 'coin_stats',
    TraderActivity = 'trader_activity',
  }
  export type EventWrapper =
  | { event_type: EventType.CoinStats; data: CoinStats }
  | { event_type: EventType.TraderActivity; data: SwapData }





  type FlexibleBool = boolean | number | string; // Adjust based on actual usage

export interface TagRank {
  fresh_wallet: number;
}

export interface DailyProfit {
  timestamp: number;
  profit: number;
}

export interface Risk {
  token_active: string;
  token_honeypot: string;
  token_honeypot_ratio: number;
  no_buy_hold: string;
  no_buy_hold_ratio: number;
  sell_pass_buy: string;
  sell_pass_buy_ratio: number;
  fast_tx: string;
  fast_tx_ratio: number;
}

export interface RankEntry {
  wallet_address: string;
  address: string;
  realized_profit: number;
  buy: number;
  sell: number;
  last_active: number;
  realized_profit_1d: number;
  realized_profit_7d: number;
  realized_profit_30d: number;
  pnl_30d: number;
  pnl_7d: number;
  pnl_1d: number;
  txs_30d: number;
  buy_30d: number;
  sell_30d: number;
  balance: number;
  eth_balance: number;
  sol_balance: number;
  trx_balance: number;
  follow_count: number;
  remark_count: number;
  twitter_username?: string;
  avatar?: string;
  ens?: string;
  tag?: string;
  tag_rank: TagRank;
  nickname?: string;
  tags: string[];
  twitter_name?: string;
  followers_count: number;
  is_blue_verified: FlexibleBool;
  twitter_description?: string;
  name?: string;
  avg_hold_time: number;
  recent_buy_tokens: any[]; // Replace `any` with a more specific type if known
  winrate_7d: number;
  avg_cost_7d: number;
  pnl_lt_minus_dot5_num_7d: number;
  pnl_minus_dot5_0x_num_7d: number;
  pnl_lt_2x_num_7d: number;
  pnl_2x_5x_num_7d: number;
  pnl_gt_5x_num_7d: number;
  pnl_lt_minus_dot5_num_7d_ratio: number;
  pnl_minus_dot5_0x_num_7d_ratio: number;
  pnl_lt_2x_num_7d_ratio: number;
  pnl_2x_5x_num_7d_ratio: number;
  pnl_gt_5x_num_7d_ratio: number;
  daily_profit_7d: DailyProfit[];
  risk: Risk;
  txs: number;
  token_num_7d: number;
  avg_holding_period_7d: number;
}



export interface SwapData {
  coinName: string
  traderAddress: string
  pnl: number
  totalSpent: number
  timestamp: string   // stored as ISO strings
  isBuy: boolean
  price: number
}


// types.ts
export interface BucketResult {
  duration: string
  amountInvested: string
  amountMade: string
  exitValue: string
}

export interface TraderSummary {
  traderAddr: string
  buckets: BucketResult[]
  score: string
  level: number
  lastJobRun: string
  timestamp: string
  kolsWhalesCount: string
  totalProfitIMade: string
  coin: string
}




// types.ts
export interface Memecoin {
  id: string
  source: string
  symbol: string
  name: string
  chain: string
  exchange: string
  contractAddress: string
  price: number
  priceUSD: number
  volume24h: number
  volume24hUSD: number
  priceChange24h: number
  liquidityUSD: number
  marketCapUSD: number
  fdvUSD: number
  txns24h: number
  socialScore: number
  timestamp: string
  firstSeen: string
  metrics: {
    volatility24h: number
    volumeToMCAP: number
    buySellRatio: number
    whaleActivity: number
  }
}




// src/types.ts
export interface CoinActivity {
  coin_name: string
  coin_symbol: string
  traders_count: number
  traders_addresses: string[]
  coin_price: number
}

export interface TraderDetail {
  trader_address: string
  amount_invested: number
  profit_5_min: number
  profit_10_min: number
  profit_15_min: number
  profit_30_min: number
  profit_1_hr: number
  profit_6_hr: number
  profit_24_hr: number
}



export interface RankerConfig {
  AvoidAge: number // in minutes
  MarketCapMin: number
  Volume10MinMin: number
  PriceChangeThreshold10Min: number
  Txns10MinMin: number
  WhaleTxnUSDThreshold: number
  MinAgePriorityMultiplier: number
  ReinsertDecay: number
  HeapSize: number
  HistoryLimit: number
  Durations: number[] // in minutes
  NewAgeThreshold: number
  FlushInterval: number
  EvictionInterval: number
  OldGrowthThresholdPercent: number
  UpdateWorkers: number
  FlushWorkers: number
  ShardCount: number
}
