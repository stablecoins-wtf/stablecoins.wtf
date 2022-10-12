import { Coin } from '@models/Coin.model'
import { CoinLatestQuotesData, CoinLatestQuotesDataPoint } from '@models/CoinLatestQuotes.model'
import { useEffect, useState } from 'react'

export type Optional<T, K extends keyof T> = Partial<Pick<T, K>> & Omit<T, K>
export type CoinsTotalMarketDataPoint = Optional<CoinLatestQuotesDataPoint, 'source'>
export type CoinsTotalMarketData = {
  [_ in keyof Omit<Required<CoinLatestQuotesData>, 'price'>]: CoinsTotalMarketDataPoint
}

export const useTotalMarketData = (coins: Coin[]) => {
  const [totalMarketData, setTotalMarketData] = useState<CoinsTotalMarketData>()
  useEffect(() => {
    if (!coins?.length) {
      setTotalMarketData(undefined)
      return
    }

    // Accumulate Market Caps
    const marketCap = {
      value: coins.reduce((prev, curr) => prev + (curr.latestQuotes.USD.marketCap?.value || 0), 0),
      source: coins[coins.length - 1].latestQuotes.USD.marketCap?.source,
    }
    const marketCap7dAgo = {
      value: coins.reduce(
        (prev, curr) => prev + (curr.latestQuotes.USD.marketCap7dAgo?.value || 0),
        0,
      ),
      source: coins[coins.length - 1].latestQuotes.USD.marketCap7dAgo?.source,
    }
    const marketCap7dChange = {
      value: (marketCap.value - (marketCap7dAgo.value || 0)) / (marketCap7dAgo.value || 1),
      source: coins[coins.length - 1].latestQuotes.USD.marketCap7dAgo?.source,
    }
    const marketCap30dAgo = {
      value: coins.reduce(
        (prev, curr) => prev + (curr.latestQuotes.USD.marketCap30dAgo?.value || 0),
        0,
      ),
      source: coins[coins.length - 1].latestQuotes.USD.marketCap30dAgo?.source,
    }
    const marketCap30dChange = {
      value: (marketCap.value - (marketCap30dAgo.value || 0)) / (marketCap30dAgo.value || 1),
      source: coins[coins.length - 1].latestQuotes.USD.marketCap30dAgo?.source,
    }

    // Accumulate Volumes
    const volume24h = {
      value: coins.reduce((prev, curr) => prev + (curr.latestQuotes.USD.volume24h?.value || 0), 0),
      source: coins[coins.length - 1].latestQuotes.USD.volume24h?.source,
    }
    const volume7d = {
      value: coins.reduce((prev, curr) => prev + (curr.latestQuotes.USD.volume7d?.value || 0), 0),
      source: coins[coins.length - 1].latestQuotes.USD.volume7d?.source,
    }
    const volume30d = {
      value: coins.reduce((prev, curr) => prev + (curr.latestQuotes.USD.volume30d?.value || 0), 0),
      source: coins[coins.length - 1].latestQuotes.USD.volume30d?.source,
    }

    setTotalMarketData({
      marketCap,
      marketCap7dAgo,
      marketCap7dChange,
      marketCap30dAgo,
      marketCap30dChange,
      volume24h,
      volume7d,
      volume30d,
    })
  }, [coins])

  return totalMarketData
}
