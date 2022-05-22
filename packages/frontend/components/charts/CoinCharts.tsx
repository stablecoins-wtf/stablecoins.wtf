import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import axios from 'axios'
import dayjs from 'dayjs'
import { FC, useEffect, useState } from 'react'
import { useQuery } from 'react-query'
import 'twin.macro'
import { CoinMarketCapChart } from './CoinMarketCapChart'
import { CoinPriceChart } from './CoinPriceChart'
import { CoinVelocityChart } from './CoinVelocityChart'
import { CoinVolumeChart } from './CoinVolumeChart'

const TRADING_DATA_MAX_AGE_MINUTES = 60 * 24

export interface CoinChartsProps {
  coin: Coin
}
export const CoinCharts: FC<CoinChartsProps> = ({coin, ...props}) => {
  const query = () => axios.post<{ cgTradingData: CoingeckoTradingData }>(
    '/api/coin/coingecko-trading-data',
    { symbol: coin.symbol, coingeckoId: coin.coingeckoId }
  )
  const { data, isLoading, isError, refetch } = useQuery(['trading-data', coin.symbol], query, { retry: false, enabled: false })
  const [tradingData, setTradingData] = useState<CoingeckoTradingData>()

  useEffect(() => {
    // Check if price history was fetched
    const cgTradingData = data?.data?.cgTradingData
    if (cgTradingData) {
      setTradingData(cgTradingData)
      return
    }
    // Check if price history already exist and/or is outdated
    const updatedAt = coin?.cgTradingData?.updatedAt
    const isOutdated = dayjs().diff(updatedAt, 'minute', true) > TRADING_DATA_MAX_AGE_MINUTES
    if (!updatedAt || isOutdated) {
      refetch()
    } else {
      setTradingData(coin.cgTradingData)
    }
  }, [data?.data, coin?.symbol])

  return <>
    <div tw="grid grid-cols-2 gap-y-4 gap-x-2 mb-8" {...props}>
      <CoinPriceChart coin={coin} tradingData={tradingData} isLoading={isLoading} isError={isError} />
      <CoinVolumeChart coin={coin} tradingData={tradingData} isLoading={isLoading} isError={isError} />
      <CoinMarketCapChart coin={coin} tradingData={tradingData} isLoading={isLoading} isError={isError} />
      <CoinVelocityChart coin={coin} tradingData={tradingData} isLoading={isLoading} isError={isError} />
    </div>
  </>
}

export interface CoinChartProps {
  coin: Coin
  tradingData?: CoingeckoTradingData
  isLoading: boolean
  isError: boolean
}