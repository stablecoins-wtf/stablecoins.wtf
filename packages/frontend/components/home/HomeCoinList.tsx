import { Coin } from '@models/Coin.model'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { FC, useEffect, useState } from 'react'
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
}
export const HomeCoinList: FC<HomeCoinListProps> = ({coins, ...props}) => {  
  const router = useRouter()
  const { slug } = router.query
  const [activeCoin, setActiveCoin] = useState<Coin>()

  useEffect(() => {
    setActiveCoin(coins.find(c => c.slug === slug))
  }, [slug])

  return <>
    <BloombergBox title="Top Stablecoins by Market Cap" {...props}>
      <div tw="flex flex-col">
        <div tw="-mx-3 overflow-x-auto">
          <div tw="relative inline-block min-w-full align-middle">
            <table tw="min-w-full divide-y divide-bbg-gray3 border-b border-bbg-gray3">

              {/* Table Head */}
              <thead tw="bg-bbg-gray3 border-t border-[#383838]">
                <tr tw="divide-x divide-black">
                  <BloombergTH scope="col" tw="sm:pl-2" isNumber={true}>#</BloombergTH>
                  <BloombergTH scope="col">Symbol</BloombergTH>
                  <BloombergTH scope="col">Mechanism</BloombergTH>
                  <BloombergTH scope="col" isNumber={true}>Price</BloombergTH>
                  <BloombergTH scope="col" isNumber={true}>Volume 24h</BloombergTH>
                  <BloombergTH scope="col" tw="sm:pr-2" isNumber={true}>Market Cap</BloombergTH>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody tw="divide-y divide-bbg-gray3">
                {coins.map((coin, idx) =>
                  <HomeCoinListRow key={coin.id} coin={coin} idx={idx} coins={coins} activeCoin={activeCoin} />)}
              </tbody>

            </table>
          </div>
        </div>
      </div>
    </BloombergBox>
  </>
}


export interface HomeCoinListRowProps extends HomeCoinListProps {
  coin: Coin
  idx: number
  activeCoin?: Coin
}
const HomeCoinListRow: FC<HomeCoinListRowProps> = (({coin, idx, activeCoin}) => {
  const price = coin.cmcLatestQuotes?.quote?.USD?.price
  const priceHighlight = (Math.abs(1 - price) > 0.05) ? ((Math.abs(1 - price) > 0.1) ? 'red' : 'orange') : undefined
  const cap = coin.cmcLatestQuotes?.quote?.USD?.market_cap
  const volume24h = coin.cmcLatestQuotes?.quote?.USD?.volume_24h

  return <>
    <Link href={`/coins/${coin.slug}`} passHref>
      <tr key={coin.id} css={[
        tw`bg-black divide-x divide-bbg-gray3 cursor-pointer`,
        activeCoin?.id === coin.id ? tw`bg-white text-black` : tw`hover:(bg-bbg-gray3)`,
      ]}>  
        <BloombergTD tw="text-right text-bbg-gray2">{idx + 1}</BloombergTD>
        <BloombergTD css={[
          tw`uppercase font-semibold text-bbg-orange`,
          activeCoin?.id === coin.id && tw`text-black`,
        ]}>{coin.symbol}</BloombergTD>
        <BloombergTD tw="text-bbg-gray1">
          {/* <div tw="inline-block leading-[1.2] px-1 py-px pb-[2px] text-white bg-bbg-gray3">{coin.mechanismFormatted()}</div> */}
          {coin.mechanismFormatted()}
        </BloombergTD>
        <BloombergTD isNumber={true} highlight={priceHighlight}>
          <NumberFormat value={price} displayType={'text'} prefix={'$'} fixedDecimalScale={true} decimalScale={3} />
        </BloombergTD>
        <BloombergTD isNumber={true} highlight={priceHighlight}>
          <NumberFormat value={volume24h} displayType={'text'} prefix={'$'} decimalScale={0} thousandSeparator={true} />
        </BloombergTD>
        <BloombergTD tw="sm:pr-2" isNumber={true}>
          <NumberFormat value={cap} displayType={'text'} prefix={'$'} decimalScale={0} thousandSeparator={true} />
        </BloombergTD>
      </tr>
    </Link>
  </>
})
