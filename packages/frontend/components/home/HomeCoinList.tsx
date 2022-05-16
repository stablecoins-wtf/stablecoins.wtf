import { Coin } from '@models/Coin.model'
import { FC } from 'react'
import NumberFormat from 'react-number-format'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { BloombergBox } from './BloombergBox'

const BloombergTH = styled.th(({isNumber}: any) => [
  tw`pb-0.5 pl-1 pr-1 text-left text-xs text-bbg-gray1`,
  isNumber && tw`text-right`,
])
const BloombergTD = styled.td(({isNumber, highlight}: any) => [
  tw`whitespace-nowrap pb-0.5 pl-1 pr-1 text-sm`,
  isNumber && tw`text-right`,
  highlight === 'orange' && tw`bg-bbg-orange text-black`,
  highlight === 'red' && tw`bg-bbg-red1 text-black`,
  highlight === 'green' && tw`bg-bbg-green1 text-black`,
])


export interface HomeCoinListProps {
  coins: Coin[]
  activateCoinPage: (_: Coin) => void
  activeCoin?: Coin,
}
export const HomeCoinList: FC<HomeCoinListProps> = ({coins, activateCoinPage, activeCoin}) => {  
  return <>
    <BloombergBox tw="flex-1" title="Top Stablecoins by Market Cap">
      <div tw="px-2">
        <div tw="flex flex-col">
          <div tw="-mx-4 overflow-x-auto">
            <div tw="inline-block min-w-full py-2 align-middle">
              <div tw="overflow-hidden">
                <table tw="min-w-full divide-y divide-bbg-gray3 border-b border-bbg-gray3">

                  {/* Table Head */}
                  <thead tw="bg-bbg-gray3 border-t border-[#383838]">
                    <tr tw="divide-x divide-black">
                      <BloombergTH scope="col" tw="sm:pl-2">Symbol</BloombergTH>
                      <BloombergTH scope="col" isNumber={true}>Price</BloombergTH>
                      <BloombergTH scope="col" isNumber={true}>24h Change</BloombergTH>
                      <BloombergTH scope="col" isNumber={true}>7d Change</BloombergTH>
                      <BloombergTH scope="col" tw="sm:pr-2" isNumber={true}>Market Cap</BloombergTH>
                    </tr>
                  </thead>

                  {/* Table Rows */}
                  <tbody tw="divide-y divide-bbg-gray3">
                    {coins.map(coin => <HomeCoinListRow coin={coin} coins={coins} activateCoinPage={activateCoinPage} activeCoin={activeCoin} />)}
                  </tbody>

                </table>
              </div>
            </div>
          </div>
        </div>
      </div>

    </BloombergBox>
  </>
}

export interface HomeCoinListRowProps extends HomeCoinListProps {
  coin: Coin
}
const HomeCoinListRow: FC<HomeCoinListRowProps> = (({coin, activateCoinPage, activeCoin}) => {
  const price = coin.cmcLatestQuotes?.quote?.USD?.price
  const priceDeviationIsHigh = Math.abs(1 - price) > 0.05
  const priceDeviationIsVeryHigh = Math.abs(1 - price) > 0.1
  const priceHighlight = priceDeviationIsHigh ? (priceDeviationIsVeryHigh ? 'red' : 'orange') : undefined
  const cap = coin.cmcLatestQuotes?.quote?.USD?.market_cap
  const change24h = coin.cmcLatestQuotes?.quote?.USD?.percent_change_24h
  const change24hHighlight = Math.abs(change24h) > 1.0 ? 'orange' : undefined
  const change7d = coin.cmcLatestQuotes?.quote?.USD?.percent_change_7d
  const change7dHighlight = Math.abs(change7d) > 1.0 ? 'orange' : undefined

  return <>
    <tr key={coin.id} onClick={() => { activateCoinPage(coin) }} css={[
      tw`bg-black divide-x divide-bbg-gray3 cursor-pointer`,
      activeCoin?.id === coin.id ? tw`bg-bbg-orange text-black` : tw`hover:(bg-bbg-gray2)`,
    ]}>  
      <BloombergTD css={[
        tw`sm:pl-2! uppercase text-bbg-orange`,
        activeCoin?.id === coin.id && tw`text-black`,
      ]}>{coin.symbol}</BloombergTD>
      <BloombergTD isNumber={true} highlight={priceHighlight}>
        <NumberFormat value={price} displayType={'text'} prefix={'$'} fixedDecimalScale={true} decimalScale={3}/>
      </BloombergTD>
      <BloombergTD isNumber={true} highlight={change24hHighlight}>
        <NumberFormat value={change24h} displayType={'text'} prefix={change24h > 0 ? '+' : ''} suffix={'%'} fixedDecimalScale={true} decimalScale={3}/>
      </BloombergTD>
      <BloombergTD isNumber={true} highlight={change7dHighlight}>
        <NumberFormat value={change7d} displayType={'text'} prefix={change7d > 0 ? '+' : ''} suffix={'%'} fixedDecimalScale={true} decimalScale={3}/>
      </BloombergTD>
      <BloombergTD isNumber={true}>
        <NumberFormat value={cap} displayType={'text'} prefix={'$'} decimalScale={0} thousandSeparator={true} />
      </BloombergTD>
    </tr>
  </>
})
