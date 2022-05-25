import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import { CoinMarketCapChart } from './CoinMarketCapChart'
import { CoinPriceChart } from './CoinPriceChart'
import { CoinVelocityChart } from './CoinVelocityChart'
import { CoinVolumeChart } from './CoinVolumeChart'

export interface CoinChartsProps {
  coin: Coin
}
export const CoinCharts: FC<CoinChartsProps> = ({ coin, ...props }) => {
  // NOTE: This artificial tradingData is not really necessary but results in a nice animation
  //       on route-change on the charts (because they think they still have the same object)
  const [tradingData, setTradingData] = useState<CoingeckoTradingData>()
  useEffect(() => {
    if (!tradingData) {
      setTradingData(coin.cgTradingData)
      return
    }

    tradingData.market_caps = coin.cgTradingData.market_caps
    tradingData.total_volumes = coin.cgTradingData.market_caps
    tradingData.updatedAt = coin.cgTradingData.updatedAt
    tradingData.prices = coin.cgTradingData.prices
    setTradingData(tradingData)
  }, [coin])

  return <>
    <div tw="grid grid-cols-2 gap-y-4 gap-x-2 mb-8" {...props}>
      <CoinPriceChart coin={coin} tradingData={tradingData} />
      <CoinVolumeChart coin={coin} tradingData={tradingData} />
      <CoinMarketCapChart coin={coin} tradingData={tradingData} />
      <CoinVelocityChart coin={coin} tradingData={tradingData} />
    </div>
  </>
}

export interface CoinChartProps {
  coin: Coin
  tradingData?: CoingeckoTradingData
}