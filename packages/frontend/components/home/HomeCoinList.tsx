import { Coin } from '@models/Coin.model'
import { datesAreSameDay } from '@shared/datesAreSameDay'
import dayjs from 'dayjs'
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

const FilterButton = styled.button(({isActive}: any) => [
  tw`my-1 pb-px pl-1 pr-1 border border-[#383838] text-xs font-semibold outline-none`,
  isActive
    ? tw`bg-gray-200 border-bbg-gray2 text-black`
    : tw`bg-bbg-gray3 border-[#383838] text-bbg-gray1`
])

export interface HomeCoinListProps {
  coins: Coin[]
}
export const HomeCoinList: FC<HomeCoinListProps> = ({coins, ...props}) => {  
  const router = useRouter()
  const { slug } = router.query
  const [activeCoin, setActiveCoin] = useState<Coin>()
  const [filteredMechanism, setFilteredMechanism] = useState<string>()
  const allMechanisms = Array.from(new Set((coins || []).map(c => c.mechanism)))

  useEffect(() => {
    setActiveCoin(coins.find(c => c.slug === slug))
  }, [slug])

  const getFilteredCoins = () => {
    return coins.filter((c) => (
      !filteredMechanism || filteredMechanism === c.mechanism
    ))
  }

  return <>
    <BloombergBox title="Top Stablecoins by Market Cap" {...props}>
      <div tw="flex flex-col">
        {/* Filter Bar */}
        <div tw="flex flex-wrap space-x-1 mb-2">
          <FilterButton isActive={!filteredMechanism} onClick={() => setFilteredMechanism(undefined)}>All</FilterButton>
          {allMechanisms.map(m => (
            <FilterButton key={m} isActive={filteredMechanism === m} onClick={() => setFilteredMechanism(m)}>
              {m.replaceAll('_', '-')}
            </FilterButton>
          ))}
        </div>

        {/* Coin Table */}
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
                  <BloombergTH scope="col" isNumber={true}>Market Cap</BloombergTH>
                  <BloombergTH scope="col" tw="sm:pr-2" isNumber={true}>7d %</BloombergTH>
                </tr>
              </thead>

              {/* Table Rows */}
              <tbody tw="divide-y divide-bbg-gray3">
                {getFilteredCoins().map((coin, idx) =>
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
  const priceHighlight = (Math.abs(1 - price) > 0.025) ? ((Math.abs(1 - price) > 0.05) ? 'red' : 'orange') : undefined
  const volume24h = coin.cmcLatestQuotes?.quote?.USD?.volume_24h
  const caps = coin.cgTradingData?.market_caps || []
  const cap = caps?.[caps.length - 1]?.[1] || coin.cmcLatestQuotes?.quote?.USD?.market_cap

  // Calculate 7-day Cap Change
  let cap7dAgo = 0
  for (let i = caps.length - 1; i >= 0; i--) {
    const is7DaysAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(7, 'day'))
    if (is7DaysAgo) {
      cap7dAgo = caps[i]?.[1]
      break
    }
  }
  const cap7dChange = (cap - (cap7dAgo || 0)) / (cap7dAgo || 1)

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
        <BloombergTD css={[
          activeCoin?.id === coin.id ? tw`text-bbg-gray3` : tw`text-bbg-gray1`,
        ]}>
          {/* <div tw="inline-block leading-[1.2] px-1 py-px pb-[2px] text-white bg-bbg-gray3">{coin.mechanismFormatted()}</div> */}
          {coin.mechanismFormatted()}
        </BloombergTD>
        <BloombergTD isNumber={true} highlight={priceHighlight}>
          <NumberFormat value={price} displayType={'text'} prefix={'$'} fixedDecimalScale={true} decimalScale={3} />
        </BloombergTD>
        <BloombergTD isNumber={true} highlight={priceHighlight}>
          {/* {largeNumberFormatter(volume24h)} */}
          <NumberFormat value={volume24h} displayType={'text'} prefix={'$'} decimalScale={0} thousandSeparator={true} />
        </BloombergTD>
        <BloombergTD isNumber={true} highlight={priceHighlight}>
          <NumberFormat value={cap} displayType={'text'} prefix={'$'} decimalScale={0} thousandSeparator={true} />
        </BloombergTD>
        <BloombergTD tw="sm:pr-2" isNumber={true} highlight={priceHighlight}>
          <NumberFormat value={Math.abs(cap7dChange * 100)} displayType={'text'} prefix={cap7dChange >= 0 ? '+' : '-'} suffix={'%'} decimalScale={0} />
        </BloombergTD>
      </tr>
    </Link>
  </>
})
