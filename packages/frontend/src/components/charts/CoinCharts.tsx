import { Coin, CoingeckoTradingData } from '@models/Coin.model'
import { FC } from 'react'
import 'twin.macro'
import { CoinMarketCapChart } from './CoinMarketCapChart'
import { CoinPriceChart } from './CoinPriceChart'
import { CoinVelocityChart } from './CoinVelocityChart'
import { CoinVolumeChart } from './CoinVolumeChart'

export interface CoinChartsProps {
  coin: Coin
}
export const CoinCharts: FC<CoinChartsProps> = ({ coin, ...props }) => {
  return (
    <>
      <div tw="grid grid-cols-2 gap-y-4 gap-x-2 mb-8" {...props}>
        <CoinPriceChart coin={coin} tradingData={coin.cgTradingData} />
        <CoinVolumeChart coin={coin} tradingData={coin.cgTradingData} />
        <CoinMarketCapChart coin={coin} tradingData={coin.cgTradingData} />
        <CoinVelocityChart coin={coin} tradingData={coin.cgTradingData} />
      </div>
    </>
  )
}

export interface CoinChartProps {
  coin: Coin
  tradingData?: CoingeckoTradingData
}
