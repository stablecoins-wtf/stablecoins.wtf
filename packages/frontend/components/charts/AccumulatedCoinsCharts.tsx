import { Coin } from '@models/Coin.model'
import { FC } from 'react'
import 'twin.macro'
import { AccumulatedCoinsMarketCapChart } from './AccumulatedCoinsMarketCapChart'
import { AccumulatedCoinsVolumeChart } from './AccumulatedCoinsVolumeChart'

export interface AccumulatedCoinsChartsProps {
  coins: Coin[]
}
export const AccumulatedCoinsCharts: FC<AccumulatedCoinsChartsProps> = ({coins}) => {
  return <>
    <div tw="grid gap-y-4">
      <AccumulatedCoinsMarketCapChart coins={coins} />
      <AccumulatedCoinsVolumeChart coins={coins} />
    </div>
  </>
}