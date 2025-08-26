This is a [Next.js](https://nextjs.org/) project bootstrapped with [`create-next-app`](https://github.com/vercel/next.js/tree/canary/packages/create-next-app).

## Getting Started

First, run the development server:

```bash
npm run dev
# or
yarn dev
```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

You can start editing the page by modifying `pages/index.tsx`. The page auto-updates as you edit the file.

[API routes](https://nextjs.org/docs/api-routes/introduction) can be accessed on [http://localhost:3000/api/hello](http://localhost:3000/api/hello). This endpoint can be edited in `pages/api/hello.ts`.

The `pages/api` directory is mapped to `/api/*`. Files in this directory are treated as [API routes](https://nextjs.org/docs/api-routes/introduction) instead of React pages.

## Learn More

To learn more about Next.js, take a look at the following resources:

- [Next.js Documentation](https://nextjs.org/docs) - learn about Next.js features and API.
- [Learn Next.js](https://nextjs.org/learn) - an interactive Next.js tutorial.

You can check out [the Next.js GitHub repository](https://github.com/vercel/next.js/) - your feedback and contributions are welcome!

## Deploy on Vercel

The easiest way to deploy your Next.js app is to use the [Vercel Platform](https://vercel.com/new?utm_medium=default-template&filter=next.js&utm_source=create-next-app&utm_campaign=create-next-app-readme) from the creators of Next.js.

Check out our [Next.js deployment documentation](https://nextjs.org/docs/deployment) for more details.




table for kols+whales
table for top traders
table for top coins

tab for traders.
list by sorting traders+coin show the profits in bucket.

placed_coins

no of screener jobs
no of websocket connections
memory usage
cpu usage
no of incoming swap events
no of incoming websocket traffic 


https://www.chartjs.org/docs/latest/samples/other-charts/bubble.html bubble chart for trader with high profit

https://www.chartjs.org/docs/latest/samples/other-charts/multi-series-pie.html - to show traders for different levels with maxProfit i can recieve

https://www.chartjs.org/docs/latest/samples/other-charts/pie.html - traders in each level
https://www.chartjs.org/docs/latest/samples/other-charts/bubble.html -coin with most traders





structs for reference


// Unified Memecoin Data Structure
type Memecoin struct {
	ID              string    `json:"id"`              // Unique ID (chain:address or exchange:symbol)
	Source          string    `json:"source"`          // "binance" or "dextools"
	Symbol          string    `json:"symbol"`          // e.g. "PEPE"
	Name            string    `json:"name"`            // Full name (if available)
	Chain           string    `json:"chain"`           // "ethereum", "bsc", etc.
	Exchange        string    `json:"exchange"`        // "binance", "uniswap", etc.
	ContractAddress string    `json:"contractAddress"` // For DEX coins
	Price           float64   `json:"price"`
	PriceUSD        float64   `json:"priceUSD"`
	Volume24h       float64   `json:"volume24h"`
	Volume24hUSD    float64   `json:"volume24hUSD"`
	PriceChange24h  float64   `json:"priceChange24h"`
	LiquidityUSD    float64   `json:"liquidityUSD"`
	MarketCapUSD    float64   `json:"marketCapUSD"`
	FdvUSD          float64   `json:"fdvUSD"` // Fully diluted valuation
	Txns24h         int       `json:"txns24h"`
	SocialScore     float64   `json:"socialScore"` // Calculated metric
	LastUpdated     time.Time `json:"lastUpdated"`
	FirstSeen       time.Time `json:"firstSeen"` // set on first receive by caller
	Metrics         struct {
		Volatility24h float64 `json:"volatility24h"`
		VolumeToMCAP  float64 `json:"volumeToMCAP"`
		BuySellRatio  float64 `json:"buySellRatio"`  // From order book
		WhaleActivity float64 `json:"whaleActivity"` // Large transactions
	} `json:"metrics"`
}

type RankerConfig struct {
	// Original ranking thresholds…
	AvoidAge                  time.Duration // 3m
	MarketCapMin              float64
	Volume10MinMin            float64
	PriceChangeThreshold10Min float64
	Txns10MinMin              int
	WhaleTxnUSDThreshold      float64

	// Priority and heap sizing
	MinAgePriorityMultiplier float64
	ReinsertDecay            float64
	HeapSize                 int
	HistoryLimit             int64

	// Aggregation parameters
	Durations                   []time.Duration // e.g. [5m,10m,1h]
	NewAgeThreshold             time.Duration   // 3m
	FlushInterval               time.Duration   // e.g. 1m
	EvictionInterval            time.Duration   // e.g. 30s
	OldGrowthThresholdPercent   float64         // 5% → 0.05
	UpdateWorkers, FlushWorkers int             // e.g. 4, 2
	ShardCount                  int             // e.g. 16
}



// snapshot holds one tick of data
type snapshot struct {
	Timestamp  time.Time
	Price      float64
	Volume24h  float64
	Txns24h    int
	WhaleCount float64
}

// DurationMetrics is percent‐change over a window
type DurationMetrics struct {
	PriceChangePercent float64
	VolumeDeltaPercent float64
	TxnsDeltaPercent   float64
	WhaleDeltaPercent  float64
}

// coinData sits in the min-heap for ranking
type coinData struct {
	coin       Memecoin
	score      float64
	priority   float64
	retryCount int
	inHeap     bool
	heapIndex  int
}

// coinHeap implements a max-heap by priority
type coinHeap []*coinData

UI -> we can show this as a table with the top 20h highlighted in different color then next 20 in different colors next 20 coins as different colors.
with first one being top 20 in heap
second one being close to reaching top 20 in heap that were not in heap
thirs one being recently demoted from heap.
fourth one being newly added coins.

func (h coinHeap) Len() int           { return len(h) }
func (h coinHeap) Less(i, j int) bool { return h[i].priority > h[j].priority }
func (h coinHeap) Swap(i, j int) {
	h[i], h[j] = h[j], h[i]
	h[i].heapIndex, h[j].heapIndex = i, j
}
func (h *coinHeap) Push(x interface{}) { *h = append(*h, x.(*coinData)) }
func (h *coinHeap) Pop() interface{} {
	old := *h
	n := len(old)
	node := old[n-1]
	*h = old[:n-1]
	return node
}

//----------------------
//    SLIDING AGGREGATOR
//----------------------

// aggData holds a ring buffer + running sums for O(1) window metrics
type aggData struct {
	history    []snapshot
	head, size int

	sumPrice, sumVol, sumTxns, sumWhales float64
	lastUpdate                           time.Time
}



// the below will be called on swap msg recieved
type TraderLevel struct {
	TraderAddress string
	Level         int
}

var (
	queue             []Entry
	queueMu           sync.Mutex
	queueSize         = 10000
	evictionDuration  = 2 * time.Minute
	traderData        = make(map[string]map[string][]SwapData) // coin -> trader -> []swaps
	traderCount       = make(map[string]int)                   // coin -> trader count
	evictedBeforeTime = 0
	lastEvictionTime  time.Time
	tradersLevelMap   = make(map[string]TraderLevel)
	tradersLevelMapMu sync.RWMutex
)

type Entry struct {
	SwapData   SwapData
	InsertedAt time.Time
}




var (
	heliusBase               = "https://api.helius.xyz/v0"
	webhookURL               = "https://solid-giggle-r74qj4jpj6x2ppvq-8080.app.github.dev/trade"
	transactionTypes         = []string{"SWAP", "SWAP_WITH_PRICE_IMPACT"}
	webhookType              = "enhanced"
	maxTradersPerWebhook int = 25
)

type WebhookRequest struct {
	WebhookURL       string   `json:"webhookURL"`
	AccountAddresses []string `json:"accountAddresses"`
	TransactionTypes []string `json:"transactionTypes"`
	WebhookType      string   `json:"webhookType"`
}


type TopTradersHeap []TraderSummaryTable



type TraderSummaryTable struct {
	TraderAddr       string         `json:"trader_addr"`
	Buckets          []BucketResult `json:"buckets"` // one per duration 5min,15min,30min,1hr,6hr,24hr
	Score            float64        `json:"score"`   // weighted sum of profits
	Level            int            `json:"level"`
	LastJobRun       string         `json:"last_job_run"`
	LastJobRunOn     time.Time      `json:"last_job_run_on"`
	KolsWhalesCount  int            `json:"kols_whales_count"`
	TotalProfitIMade int            `json:"total_profit_i_made"`
	Coin string `json:"coin"`
}

type TraderJob struct {
	JobID           string       `json:"job_id"`
	JobRunTimestamp time.Time    `json:"job_run_timestamp"`
	TraderAddress   string       `json:"trader_address"`
	BucketResult    BucketResult `json:"bucket_result"`
}

type BucketResult struct {
	Duration       string  `json:"duration"`        // "5m", "15m", ...
	AmountInvested float64 `json:"amount_invested"` // USD invested
	AmountMade     float64 `json:"amount_made"`     // USD profit (+/−)
	ExitValue      float64 `json:"exit_value"`      // invested + profit
}

type TraderSummary struct {
	TraderAddr string         `json:"trader_addr"`
	Buckets    []BucketResult `json:"buckets"` // one per duration
	Score      float64        `json:"score"`   // weighted sum of profits
	Coin       string         `json:"coin"`
}


type TraderCoinState struct {
	BoughtPrice float64     // price at which dummy buy was placed
	CoinsBought float64     // how many coins we’re holding
	MaxPrice    float64     // highest price seen since BoughtPrice
	StopLoss    float64     // price at which to trigger finalizeTrade
	LossPercent float64     // e.g. 0.20 for a 20% drawdown
	Timer       *time.Timer // fires 1m after first swap
}

// TraderSummary2 holds a minimal, trimmed summary of final profit for one trader+coin.
type TraderSummary2 struct {
	TraderAddr       string    `json:"trader_addr"`         // wallet address
	Coin             string    `json:"coin"`                // coin symbol
	TotalProfitIMade float64   `json:"total_profit_i_made"` // profit from this cycle
	LastUpdated      time.Time `json:"last_updated"`        // when we recorded this profit
}

// SwapManager orchestrates the in-memory data structures and business logic
// for scheduling dummy buys + stop-losses and collecting final PnL.
type SwapManager struct {
	// coinSwaps accumulates raw SwapData for each trader+coin during the 1-minute window.
	// Key format: "traderAddress:coinName"
	coinSwaps   map[string][]SwapData
	coinSwapsMu sync.Mutex

	// traderStates holds the pending TraderCoinState for each active trader+coin.
	// Allows us to stop timers and read stop-loss thresholds.
	traderStates   map[string]map[string]*TraderCoinState
	traderStatesMu sync.RWMutex

	// traderSummaries stores the finalized profit summary per trader+coin after stop-loss triggers.
	traderSummaries   map[string]map[string]*TraderSummary2
	traderSummariesMu sync.RWMutex
}


type SwapData struct {
	CoinName      string
	TraderAddress string
	Pnl           float64
	TotalSpent    float64
	Timestamp     time.Time
	IsBuy         bool
	Price         float64
}

# wallet-processor
