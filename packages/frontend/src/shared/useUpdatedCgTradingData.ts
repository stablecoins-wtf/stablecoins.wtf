import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import { CG_TRADING_DATA_MAX_AGE_MINUTES } from '@pages/api/coin/coingecko-trading-data'
import axios from 'axios'
import dayjs from 'dayjs'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

/**
 * DEPRECATED
 */
export const useUpdatedCgTradingData = (coins: Coin[]) => {
  const [updatedCoins, setUpdatedCoins] = useState<Coin[]>([])

  // Re-fetch queries for each given coin
  const getQuery = (coin: Coin) => () =>
    axios.post<{ cgTradingData: CoingeckoTradingData }>('/api/coin/coingecko-trading-data', {
      symbol: coin.symbol,
      coingeckoId: coin.coingeckoId,
    })
  const results = useQueries(
    coins.map((coin) => ({
      queryKey: ['trading-data', coin.symbol],
      queryFn: getQuery(coin),
      enabled: false,
      retry: false,
    })),
  )

  // Re-fetch trading-data for coins (if outdated) in the background
  useEffect(() => {
    if (results.some((r) => r.isLoading)) return
    // if (results.every(r => r.isIdle)) setUpdatedCoins([...coins])

    // const updatedCgTradingData: CoingeckoTradingData[] = new Array(coins.length).map(c => c.cgTradingData)
    const updatedCoins = new Array(coins.length)
    for (let idx = 0; idx < coins.length; idx++) {
      const { data, refetch } = results[idx]
      // coins[idx] = Coin.fromObject(coins[idx])

      // Check if price history was fetched
      const cgTradingData = data?.data?.cgTradingData
      if (cgTradingData) {
        coins[idx].cgTradingData = cgTradingData
        continue
      }

      // Check if price history already exist and/or is outdated
      const updatedAt = coins[idx].cgTradingData?.updatedAt
      const isOutdated = dayjs().diff(updatedAt, 'minute', true) > CG_TRADING_DATA_MAX_AGE_MINUTES
      if (!updatedAt || isOutdated) {
        coins[idx].cgTradingData.isUpdating = true
        refetch()
        continue
      }

      coins[idx].cgTradingData.isUpdating = false
    }

    setUpdatedCoins([...coins])
  }, [Object.keys(coins), results])

  return {
    updatedCoins,
  }
}
