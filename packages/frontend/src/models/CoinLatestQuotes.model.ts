import {
  getAccumulatedValueUntilTimeAgo,
  getCgDataPointFromTimeAgo,
  getLatestCgDataPoint,
} from '@shared/coingeckoHelpers'
import { Coin } from './Coin.model'

export class CoinLatestQuotes {
  public USD: CoinLatestQuotesData
  // public EUR?: CoinLatestQuotesData

  constructor(private coin: Coin) {
    this.USD = this.initializeUSD()
  }

  reInitialize() {
    this.USD = this.initializeUSD()
  }

  private initializeUSD(): CoinLatestQuotesData {
    const quotes: CoinLatestQuotesData = {}

    // Price (CoinGecko)
    const cgLatestPrice = getLatestCgDataPoint(this.coin?.cgTradingData?.prices)
    if (cgLatestPrice)
      quotes.price = {
        value: cgLatestPrice[1],
        date: new Date(cgLatestPrice[0]),
        source: CoinLatestQuotesDataSource.CG,
      }

    // Market Caps (CoinGecko)
    const cgLatestCap = getLatestCgDataPoint(this.coin?.cgTradingData?.market_caps)
    if (cgLatestCap)
      quotes.marketCap = {
        value: cgLatestCap[1],
        date: new Date(cgLatestCap[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    const cgCap7dAgo = getCgDataPointFromTimeAgo(this.coin?.cgTradingData?.market_caps, 7, 'days')
    if (cgCap7dAgo)
      quotes.marketCap7dAgo = {
        value: cgCap7dAgo[1],
        date: new Date(cgCap7dAgo[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    if (cgCap7dAgo && cgLatestCap)
      quotes.marketCap7dChange = {
        value: (cgLatestCap[1] - (cgCap7dAgo[1] || 0)) / (cgCap7dAgo[1] || 1),
        date: new Date(cgCap7dAgo[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    const cgCap30dAgo = getCgDataPointFromTimeAgo(this.coin?.cgTradingData?.market_caps, 30, 'days')
    if (cgCap30dAgo)
      quotes.marketCap30dAgo = {
        value: cgCap30dAgo[1],
        date: new Date(cgCap30dAgo[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    if (cgCap30dAgo && cgLatestCap)
      quotes.marketCap30dChange = {
        value: (cgLatestCap[1] - (cgCap30dAgo[1] || 0)) / (cgCap30dAgo[1] || 1),
        date: new Date(cgCap30dAgo[0]),
        source: CoinLatestQuotesDataSource.CG,
      }

    // Volumes (CoinGecko)
    const cgVolume24h = getLatestCgDataPoint(this.coin?.cgTradingData?.total_volumes)
    if (cgVolume24h)
      quotes.volume24h = {
        value: cgVolume24h[1],
        date: new Date(cgVolume24h[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    const cgVolume7d = getAccumulatedValueUntilTimeAgo(
      this.coin?.cgTradingData?.total_volumes,
      7,
      'days',
    )
    if (cgVolume7d)
      quotes.volume7d = {
        value: cgVolume7d[1],
        date: new Date(cgVolume7d[0]),
        source: CoinLatestQuotesDataSource.CG,
      }
    const cgVolume30d = getAccumulatedValueUntilTimeAgo(
      this.coin?.cgTradingData?.total_volumes,
      30,
      'days',
    )
    if (cgVolume30d)
      quotes.volume30d = {
        value: cgVolume30d[1],
        date: new Date(cgVolume30d[0]),
        source: CoinLatestQuotesDataSource.CG,
      }

    return quotes
  }
}

export enum CoinLatestQuotesDataSource {
  CMC = 'CoinMarketCap',
  CG = 'CoinGecko',
}
export type CoinLatestQuotesDataPoint = {
  value: number
  source: CoinLatestQuotesDataSource
  date?: Date
}
export type CoinLatestQuotesData = {
  price?: CoinLatestQuotesDataPoint
  marketCap?: CoinLatestQuotesDataPoint
  marketCap7dAgo?: CoinLatestQuotesDataPoint
  marketCap7dChange?: CoinLatestQuotesDataPoint
  marketCap30dAgo?: CoinLatestQuotesDataPoint
  marketCap30dChange?: CoinLatestQuotesDataPoint
  volume24h?: CoinLatestQuotesDataPoint
  volume7d?: CoinLatestQuotesDataPoint
  volume30d?: CoinLatestQuotesDataPoint
}
