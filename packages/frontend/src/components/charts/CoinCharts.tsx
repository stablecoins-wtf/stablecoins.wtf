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
        <h3 tw="sr-only">Price Chart</h3>
        <CoinPriceChart coin={coin} tradingData={coin.cgTradingData} />
        <h3 tw="sr-only">Volume Chart</h3>
        <CoinVolumeChart coin={coin} tradingData={coin.cgTradingData} />
        <h3 tw="sr-only">Market Cap Chart</h3>
        <CoinMarketCapChart coin={coin} tradingData={coin.cgTradingData} />
        <h3 tw="sr-only">Velocity Chart</h3>
        <CoinVelocityChart coin={coin} tradingData={coin.cgTradingData} />
      </div>
    </>
  )
}

export interface CoinChartProps {
  coin: Coin
  tradingData?: CoingeckoTradingData
}
