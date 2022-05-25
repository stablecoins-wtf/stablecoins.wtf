import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import { CG_TRADING_DATA_MAX_AGE_MINUTES } from 'pages/api/coin/coingecko-trading-data'
import { useEffect, useState } from 'react'
import { useQueries } from 'react-query'

export const useUpdatedCgTradingData = (coins: Coin[]) => {
  const [updatedCoins, setUpdatedCoins] = useState<Coin[]>(coins)

  // Re-fetch queries for each given coin
  const getQuery = (coin: Coin) => () => axios.post<{ cgTradingData: CoingeckoTradingData }>(
    '/api/coin/coingecko-trading-data',
    { symbol: coin.symbol, coingeckoId: coin.coingeckoId }
  )
  const results = useQueries(coins.map((coin) => ({
    queryKey: ['trading-data', coin.symbol],
    queryFn: getQuery(coin),
    enabled: false,
    retry: false,
  })))
  
  // Re-fetch trading-data for coins (if outdated) in the background
  useEffect(() => {    
    if (results.some(r => r.isLoading)) return
    // if (results.every(r => r.isIdle)) setUpdatedCoins(coins)
    
    // const updatedCgTradingData: CoingeckoTradingData[] = new Array(coins.length).map(c => c.cgTradingData)
    for (let idx = 0; idx < coins.length; idx++) {
      const coin = coins[idx]
      const { data, refetch } = results[idx]
      
      // Check if price history was fetched
      const cgTradingData = data?.data?.cgTradingData
      if (cgTradingData) {
        coin.cgTradingData = cgTradingData
        continue
      }
      
      // Check if price history already exist and/or is outdated
      const updatedAt = coin.cgTradingData?.updatedAt
      const isOutdated = dayjs().diff(updatedAt, 'minute', true) > CG_TRADING_DATA_MAX_AGE_MINUTES
      if (!updatedAt || isOutdated) {
        coin.cgTradingData.isUpdating = true
        refetch()
        continue
      }
      
      coin.cgTradingData.isUpdating = false
    }

    setUpdatedCoins(coins)
  }, [coins?.length, results])

  return {
    updatedCoins
  }
}
