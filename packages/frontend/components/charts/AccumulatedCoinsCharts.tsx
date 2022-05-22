import { Coin } from '@models/Coin.model'
import { FC, useEffect, useState } from 'react'
import 'twin.macro'
import { AccumulatedCoinsMarketCapChart } from './AccumulatedCoinsMarketCapChart'

export interface AccumulatedCoinsChartsProps {
  coins: Coin[]
}
export const AccumulatedCoinsCharts: FC<AccumulatedCoinsChartsProps> = ({coins}) => {
  const [coinsWithTradingData, setCoinsWithTradingData] = useState<Coin[]>([])
  useEffect(() => {
    const coinsWithTradingData = (coins || [])
      .filter(c => !!c.cgTradingData?.prices?.length)
    setCoinsWithTradingData(coinsWithTradingData)
  }, [coins])

  return <>
    <div tw="grid gap-y-4">
      <AccumulatedCoinsMarketCapChart coins={coinsWithTradingData} />
    </div>
  </>
}