import { Coin, CoinMechanism } from '@models/Coin.model'
import { datesAreSameDay } from '@shared/datesAreSameDay'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import { useIsSSR } from '@shared/useIsSSR'
import Tippy from '@tippyjs/react'
import dayjs from 'dayjs'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import arrowDownIcon from 'public/icons/bbg/bbg-icon-arrowdown--cyan.svg'
import { FC, useEffect, useState } from 'react'
import NumberFormat from 'react-number-format'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { BloombergBox } from './BloombergBox'

const BloombergTH = styled.th(({ isNumber, isSortable }: any) => [
  tw`pb-0.5 pl-1 pr-1 text-left text-xs text-bbg-gray1 font-semibold select-none`,
  isNumber && tw`text-right`,
  isSortable && tw`cursor-pointer font-bold hover:text-gray-300`,
])
const BloombergTD = styled.td(({ isNumber, highlight }: any) => [
  tw`whitespace-nowrap pb-0.5 pl-1 pr-1 text-sm`,
  isNumber && tw`text-right`,
  highlight === 'orange' && tw`bg-bbg-orange text-black`,
  highlight === 'red' && tw`bg-bbg-red1 text-black`,
  highlight === 'green' && tw`bg-bbg-green2 text-black`,
])

const FilterButton = styled.button(({ isActive }: any) => [
  tw`my-1 pb-px pl-1 pr-1 border border-[#383838] text-xs font-semibold outline-none`,
  isActive
    ? tw`bg-gray-200 border-bbg-gray2 text-black`
    : tw`bg-bbg-gray3 border-[#383838] text-bbg-gray1`,
])

export interface HomeCoinListSortState {
  attribute: 'market_caps' | 'total_volumes' | 'prices' | 'market_caps_7d_change'
  order: 'asc' | 'desc'
}
export interface HomeCoinListProps {
  coins: Coin[]
}
export const HomeCoinList: FC<HomeCoinListProps> = ({ coins, ...props }) => {
  const router = useRouter()
  const { slug } = router.query
  const allMechanisms = Array.from(new Set((coins || []).map((c) => c.mechanism)))
  const [filteredMechanism, setFilteredMechanism] = useState<CoinMechanism>()
  const [sortState, setSortState] = useState<HomeCoinListSortState>({
    attribute: 'market_caps',
    order: 'desc',
  })
  const [shownCoins, setShownCoins] = useState<Coin[]>([])
  const [isLoading, setIsLoading] = useState(true)
  const isSSR = useIsSSR()

  useEffect(() => {
    setIsLoading(true)
    const shownCoins = coins
      .filter((c) => !filteredMechanism || filteredMechanism === c.mechanism)
      .sort((c1, c2) => {
        let val1: number
        let val2: number
        if (sortState.attribute === 'market_caps') {
          const caps1 = c1?.cgTradingData?.market_caps || []
          val1 = caps1?.[caps1.length - 1]?.[1] || 0
          const caps2 = c2?.cgTradingData?.market_caps || []
          val2 = caps2?.[caps2.length - 1]?.[1] || 0
        } else if (sortState.attribute === 'prices') {
          val1 = c1.cmcLatestQuotes?.quote?.USD?.price
          val2 = c2.cmcLatestQuotes?.quote?.USD?.price
        } else if (sortState.attribute === 'total_volumes') {
          val1 = c1.cmcLatestQuotes?.quote?.USD?.volume_24h
          val2 = c2.cmcLatestQuotes?.quote?.USD?.volume_24h
        } else return 0
        if (val1 === val2) return 0
        if (val1 > val2) return sortState.order === 'asc' ? 1 : -1
        return sortState.order === 'asc' ? -1 : 1
      })
    setShownCoins(shownCoins)
    setIsLoading(false)
  }, [filteredMechanism, sortState, coins])

  const [activeCoin, setActiveCoin] = useState<Coin>()
  useEffect(() => {
    setActiveCoin(coins.find((c) => c.slug === slug))
  }, [slug])

  const TH: FC<{
    title: string
    tooltip?: string
    sortAttribute?: HomeCoinListSortState['attribute']
    isNumber?: boolean
  }> = ({ title, tooltip, sortAttribute, isNumber, ...props }) => {
    const isSortedBy = !!sortAttribute && sortAttribute === sortState.attribute
    const doSort = () => {
      if (!sortAttribute) return
      setSortState({
        attribute: sortAttribute,
        order: isSortedBy ? (sortState.order === 'asc' ? 'desc' : 'asc') : 'desc',
      })
    }

    return (
      <>
        <BloombergTH
          scope="col"
          isNumber={isNumber}
          isSortable={!!sortAttribute}
          onClick={doSort}
          {...props}
        >
          <Tippy disabled={!tooltip} content={tooltip} placement="top">
            <div css={[isSortedBy && tw`flex justify-end items-center`]}>
              <span css={[isSortedBy && tw`mr-1`]}>{title}</span>
              {isSortedBy && (
                <Image
                  src={arrowDownIcon}
                  width={7}
                  height={10}
                  css={[sortState.order === 'asc' && tw`scale-y-[-1]`]}
                  alt="Sort Arrow Icon"
                />
              )}
            </div>
          </Tippy>
        </BloombergTH>
      </>
    )
  }

  return (
    <>
      <BloombergBox title="Top Stablecoins by Market Cap" {...props}>
        <div tw="flex flex-col">
          {/* Filter Bar */}
          <div tw="flex flex-wrap space-x-1 mb-2">
            <FilterButton
              isActive={!filteredMechanism}
              onClick={() => setFilteredMechanism(undefined)}
            >
              All
            </FilterButton>
            {allMechanisms.map((m) => (
              <FilterButton
                key={m}
                isActive={filteredMechanism === m}
                onClick={() => setFilteredMechanism(m)}
              >
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
                    <TH title="#" isNumber={true} tw="hidden md:(table-cell pl-2)" />
                    <TH title="Symbol" />
                    <TH title="Mechanism" />
                    <TH title="Price" isNumber={true} sortAttribute="prices" />
                    <TH title="Volume 24h" isNumber={true} sortAttribute="total_volumes" />
                    <TH title="Market Cap" isNumber={true} sortAttribute="market_caps" />
                    <TH
                      title="7d %"
                      tooltip="7-Day Change of Market Cap"
                      isNumber={true}
                      tw="hidden md:(table-cell pl-2)"
                    />
                  </tr>
                </thead>

                {/* Table Rows */}
                <tbody tw="divide-y divide-bbg-gray3">
                  {isLoading && !isSSR && !shownCoins?.length
                    ? new Array(15)
                        .fill(undefined)
                        .map((_, idx) => <HomeCoinListRowIsLoading key={idx} {...{ idx }} />)
                    : shownCoins.map((coin, idx) => (
                        <HomeCoinListRow
                          key={coin.id}
                          coin={coin}
                          idx={idx}
                          coins={coins}
                          activeCoin={activeCoin}
                        />
                      ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>

        {/* Legende */}
        <div tw="flex justify-end items-center space-x-4 mt-3 mb-1 text-sm text-bbg-gray1">
          <div tw="flex items-center">
            <div tw="w-1.5 h-1.5 bg-bbg-orange mr-2" />
            &gt;1% de-pegged
          </div>
          <div tw="flex items-center">
            <div tw="w-1.5 h-1.5 bg-bbg-red1 mr-2" />
            &gt;5% de-pegged
          </div>
        </div>
      </BloombergBox>
    </>
  )
}

const HomeCoinListRowIsLoading: FC<{ idx: number }> = ({ idx }) => {
  return (
    <>
      <tr
        tw="h-[23px] bg-bbg-gray3/50 animate-pulse divide-x divide-bbg-gray3 pointer-events-none"
        style={{
          animationDelay: `${idx % 2 == 0 ? 0 : 1000}ms`,
          animationDuration: '2000ms',
        }}
      >
        <BloombergTD tw="hidden md:(table-cell pl-2)" />
        <BloombergTD />
        <BloombergTD />
        <BloombergTD />
        <BloombergTD />
        <BloombergTD />
        <BloombergTD tw="hidden md:(table-cell pl-2)" />
      </tr>
    </>
  )
}

export interface HomeCoinListRowProps extends HomeCoinListProps {
  coin: Coin
  idx: number
  activeCoin?: Coin
}
const HomeCoinListRow: FC<HomeCoinListRowProps> = ({ coin, idx, activeCoin }) => {
  const [marketData, setmarketData] = useState<{
    price: number
    priceHighlight: string | undefined
    volume24h: number
    cap: number
    cap7dChange: number
  }>()
  useEffect(() => {
    const price = coin.cmcLatestQuotes?.quote?.USD?.price
    const caps = coin.cgTradingData?.market_caps || []
    const cap = caps?.[caps.length - 1]?.[1]

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

    setmarketData({
      price,
      priceHighlight:
        Math.abs(1 - price) > 0.01 ? (Math.abs(1 - price) > 0.05 ? 'red' : 'orange') : undefined,
      volume24h: coin.cmcLatestQuotes?.quote?.USD?.volume_24h,
      cap,
      cap7dChange,
    })
  }, [])

  return (
    <>
      <Link href={`/coins/${coin.slug}`} passHref>
        <tr
          key={coin.id}
          css={[
            tw`bg-black divide-x divide-bbg-gray3 cursor-pointer`,
            activeCoin?.id === coin.id ? tw`bg-white text-black` : tw`hover:(bg-bbg-gray3)`,
          ]}
        >
          <BloombergTD tw="hidden md:(table-cell pl-2) text-right text-bbg-gray2">
            {idx + 1}
          </BloombergTD>
          <BloombergTD
            css={[
              tw`uppercase font-semibold text-bbg-orange`,
              activeCoin?.id === coin.id && tw`text-black`,
            ]}
          >
            <Tippy content={coin.name} placement="bottom">
              <div>{coin.symbol}</div>
            </Tippy>
          </BloombergTD>
          <BloombergTD css={[activeCoin?.id === coin.id ? tw`text-bbg-gray3` : tw`text-bbg-gray1`]}>
            {/* <div tw="inline-block leading-[1.2] px-1 py-px pb-[2px] text-white bg-bbg-gray3">{coin.mechanismFormatted()}</div> */}
            {coin.mechanismFormatted()}
          </BloombergTD>
          <BloombergTD isNumber={true} highlight={marketData?.priceHighlight}>
            <NumberFormat
              value={marketData?.price}
              displayType={'text'}
              prefix={'$'}
              fixedDecimalScale={true}
              decimalScale={3}
            />
          </BloombergTD>
          <BloombergTD isNumber={true} highlight={marketData?.priceHighlight}>
            <span tw="md:hidden">${largeNumberFormatter(marketData?.volume24h)}</span>
            <NumberFormat
              tw="hidden md:inline"
              value={marketData?.volume24h}
              displayType={'text'}
              prefix={'$'}
              decimalScale={0}
              thousandSeparator={true}
            />
          </BloombergTD>
          <BloombergTD isNumber={true} highlight={marketData?.priceHighlight}>
            <span tw="md:hidden">${largeNumberFormatter(marketData?.cap)}</span>
            <NumberFormat
              tw="hidden md:inline"
              value={marketData?.cap}
              displayType={'text'}
              prefix={'$'}
              decimalScale={0}
              thousandSeparator={true}
            />
          </BloombergTD>
          <BloombergTD
            tw="hidden md:(table-cell pr-2)"
            isNumber={true}
            highlight={marketData?.priceHighlight}
          >
            <NumberFormat
              value={Math.abs((marketData?.cap7dChange || 0) * 100)}
              displayType={'text'}
              prefix={(marketData?.cap7dChange || 0) >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={0}
            />
          </BloombergTD>
        </tr>
      </Link>
    </>
  )
}
