import { Coin } from '@models/Coin.model'
import { FC, Fragment } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinListProps {
  coins: Coin[]
  activateCoinPage: (_: Coin) => void
}

export const HomeCoinList: FC<HomeCoinListProps> = ({coins, activateCoinPage}) => {
  return <>
    <BloombergBox tw="flex-1" title="Top Stablecoins by Market Cap">
      {coins.map(coin => <Fragment key={coin.id}>
        <div tw="flex justify-between hover:bg-bbg-gray2 cursor-pointer" onClick={() => { activateCoinPage(coin) }}>
          <span>{coin.name}</span>
          <span>{coin.symbol}</span>
        </div>
      </Fragment>)}
    </BloombergBox>
  </>
}