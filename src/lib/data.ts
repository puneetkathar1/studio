import type { Signal, LedgerEntry, Market } from './types'

export const performanceSummary = {
  totalROI: '$4,292.00',
  totalROIPercentage: '+20.1% a month',
  winRate: '89.2%',
  winRateChange: '+1.2%',
  proSignals: '32',
  proSignalsChange: '+5',
  activeMarkets: '12',
  activeMarketsChange: '+2',
}

export const dailyBrief = {
  date: 'June 10, 2024',
  title: 'Market Volatility Expected on Upcoming Fed Announcement',
  summary:
    'Key inflation data is due this week, with markets pricing in a 75% chance of a rate hold. Our models suggest an overreaction in the tech sector, presenting a potential opportunity.',
  keySignal: {
    contract: 'Will the Fed raise rates in the next meeting?',
    signal: 'NO_BET',
  },
}

export const marketPerformanceData = [
  { category: 'Politics', bet: 12, no_bet: 5, wait: 8 },
  { category: 'Tech', bet: 25, no_bet: 10, wait: 15 },
  { category: 'Finance', bet: 18, no_bet: 8, wait: 12 },
  { category: 'Crypto', bet: 35, no_bet: 20, wait: 25 },
  { category: 'Sports', bet: 22, no_bet: 15, wait: 10 },
]

export const recentSignals: Omit<Signal, 'reason' | 'probabilityEnvelope' | 'isPro' | 'timestamp'>[] = [
  {
    id: '1',
    contract: 'Will ETH hit $4k by July?',
    platform: 'Polymarket',
    signal: 'BET',
    marketPrice: 0.65,
  },
  {
    id: '2',
    contract: 'Will the next US President be from the Democratic Party?',
    platform: 'Kalshi',
    signal: 'WAIT',
    marketPrice: 0.48,
  },
  {
    id: '3',
    contract: 'Will AI achieve AGI by 2030?',
    platform: 'Polymarket',
    signal: 'NO_BET',
    marketPrice: 0.82,
  },
    {
    id: '4',
    contract: 'Will Taylor Swift\'s next album be certified Diamond?',
    platform: 'Polymarket',
    signal: 'BET',
    marketPrice: 0.33,
  },
]

export const proFeedSignals: Signal[] = [
  {
    id: '1',
    contract: 'Will ETH hit $4k by July?',
    platform: 'Polymarket',
    signal: 'BET',
    reason:
      'Strong underlying network growth and upcoming ETF approvals create a bullish sentiment not fully priced in.',
    timestamp: '2 hours ago',
    isPro: false,
    marketPrice: 0.65,
    probabilityEnvelope: { lower: 0.68, upper: 0.75 },
  },
  {
    id: '2',
    contract: 'Will AI achieve AGI by 2030?',
    platform: 'Polymarket',
    signal: 'NO_BET',
    reason:
      'Current market price is significantly above our fair value envelope, indicating an over-hyped market.',
    timestamp: '8 hours ago',
    isPro: true,
    marketPrice: 0.82,
    probabilityEnvelope: { lower: 0.6, upper: 0.7 },
  },
  {
    id: '3',
    contract: 'Will the next US President be from the Democratic Party?',
    platform: 'Kalshi',
    signal: 'WAIT',
    reason:
      'The current price is within our fair value envelope. Waiting for more polling data before taking a position.',
    timestamp: '1 day ago',
    isPro: false,
    marketPrice: 0.48,
    probabilityEnvelope: { lower: 0.45, upper: 0.52 },
  },
  {
    id: '4',
    contract: 'Will commercial flights to Mars happen by 2040?',
    platform: 'Kalshi',
    signal: 'NO_BET',
    reason: 'Technological and logistical hurdles are significantly underestimated by the current market price. Our model suggests a much lower probability.',
    timestamp: '2 days ago',
    isPro: true,
    marketPrice: 0.25,
    probabilityEnvelope: { lower: 0.05, upper: 0.12 },
  },
  {
    id: '5',
    contract: 'Will a new social media app surpass 1B users in 2025?',
    platform: 'Polymarket',
    signal: 'BET',
    reason: 'Market is underpricing the potential for a viral breakout, given recent trends in user acquisition costs and network effects.',
    timestamp: '3 days ago',
    isPro: true,
    marketPrice: 0.1,
    probabilityEnvelope: { lower: 0.15, upper: 0.22 },
  },
   {
    id: '6',
    contract: 'Will global temperatures rise by 2°C by 2050?',
    platform: 'Kalshi',
    signal: 'BET',
    reason: 'Current climate models and emission rates suggest a higher probability than the market is currently pricing in.',
    timestamp: '4 days ago',
    isPro: false,
    marketPrice: 0.70,
    probabilityEnvelope: { lower: 0.75, upper: 0.85 },
  },
]

export const ledgerEntries: LedgerEntry[] = [
  {
    id: '1',
    date: '2024-05-28',
    contract: 'Will oil prices exceed $100/barrel in Q3?',
    signal: 'NO_BET',
    outcome: 'Success',
    accuracy: 95.5,
  },
  {
    id: '2',
    date: '2024-05-27',
    contract: 'Will the S&P 500 close above 5300?',
    signal: 'BET',
    outcome: 'Success',
    accuracy: 92.1,
  },
  {
    id: '3',
    date: '2024-05-25',
    contract: 'Will a hurricane make landfall in Florida in August?',
    signal: 'BET',
    outcome: 'Fail',
    accuracy: 88.3,
  },
  {
    id: '4',
    date: '2024-05-22',
    contract: 'Will a new gaming console be announced at E3?',
    signal: 'NO_BET',
    outcome: 'Success',
    accuracy: 98.2,
  },
  {
    id: '5',
    date: '2024-05-20',
    contract: 'Will inflation rate be below 3%?',
    signal: 'BET',
    outcome: 'Pending',
    accuracy: 91.4,
  },
   {
    id: '6',
    date: '2024-05-19',
    contract: 'Will a specific stock reach an all-time high?',
    signal: 'BET',
    outcome: 'Success',
    accuracy: 94.7,
  },
]
