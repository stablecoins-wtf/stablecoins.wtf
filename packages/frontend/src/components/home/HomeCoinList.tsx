import { Coin, CoinMechanism } from '@models/Coin.model'
import { env } from '@shared/environment'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import Tippy from '@tippyjs/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import arrowDownIcon from 'public/icons/bbg/bbg-icon-arrowdown--cyan.svg'
import { FC, useEffect, useState } from 'react'
import { NumericFormat } from 'react-number-format'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { BloombergBox } from './BloombergBox'

const FilterButton = styled.button(({ isActive }: any) => [
  tw`my-1 pb-px pl-1 pr-1 border border-[#383838] text-xs font-semibold outline-none`,
  isActive
    ? tw`bg-gray-200 border-bbg-gray2 text-black`
    : tw`bg-bbg-gray3 border-[#383838] text-bbg-gray1`,
])

const Table = styled.section(() => [
  tw`table -mx-3 overflow-x-auto relative align-middle min-w-full border-t border-[#383838]`,
])
const TableHead = styled.header(() => [tw`table-row bg-bbg-gray3 divide-x divide-black`])
const TableHeadCell = styled.div(({ isNumber, isSortable }: any) => [
  tw`table-cell whitespace-nowrap pb-[0.1rem] pt-px px-1 text-left text-xs text-bbg-gray1 font-semibold select-none`,
  isNumber && tw`text-right`,
  isSortable && tw`cursor-pointer font-bold hover:text-gray-300`,
])
const TableRow = styled.div(({ active }: any) => [
  tw`table-row bg-black divide-x divide-bbg-gray3 cursor-pointer`,
  active ? tw`bg-white text-black` : tw`hover:(bg-bbg-gray3)`,
])
const TableRowIsLoading = styled.div(({ idx }: any) => [
  tw`table-row h-[23px] bg-bbg-gray3/60 animate-pulse [animation-duration: 1600ms] pointer-events-none`,
  idx % 2 == 0 ? tw`[animation-delay: 0ms]` : tw`[animation-delay: 800ms]`,
])
const TableCell = styled.div(({ isNumber, highlight }: any) => [
  tw`table-cell whitespace-nowrap py-[0.1rem] px-1 text-sm border-b border-bbg-gray3`,
  isNumber && tw`text-right`,
  highlight === 'orange' && tw`bg-bbg-orange text-black`,
  highlight === 'red' && tw`bg-bbg-red1 text-black`,
  highlight === 'green' && tw`bg-bbg-green2 text-black`,
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
  const allMechanisms = Array.from(new Set((coins || []).map((c) => c.mechanism).filter(Boolean)))
  const [filteredMechanism, setFilteredMechanism] = useState<CoinMechanism>()
  const [sortState, setSortState] = useState<HomeCoinListSortState>({
    attribute: 'market_caps',
    order: 'desc',
  })
  const [shownCoins, setShownCoins] = useState<Coin[]>([])
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    setIsLoading(true)
    const shownCoins = coins
      .filter((c) => !filteredMechanism || filteredMechanism === c.mechanism)
      .sort((c1, c2) => {
        let val1, val2: number
        if (sortState.attribute === 'market_caps') {
          val1 = c1.latestQuotes.USD.marketCap?.value || 0
          val2 = c2.latestQuotes.USD.marketCap?.value || 0
        } else if (sortState.attribute === 'prices') {
          val1 = c1.latestQuotes.USD.price?.value || 0
          val2 = c2.latestQuotes.USD.price?.value || 0
        } else if (sortState.attribute === 'total_volumes') {
          val1 = c1.latestQuotes.USD.volume24h?.value || 0
          val2 = c2.latestQuotes.USD.volume24h?.value || 0
        } else return 0
        return sortState.order === 'asc' ? val1 - val2 : val2 - val1
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
        <TableHeadCell
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
                  priority
                />
              )}
            </div>
          </Tippy>
        </TableHeadCell>
      </>
    )
  }

  return (
    <>
      <BloombergBox
        title="Top Stablecoins by Market Cap"
        tw="overflow-x-scroll overflow-y-scroll sm:overflow-x-hidden"
        {...props}
      >
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
          <Table>
            {/* Table Head */}
            <TableHead>
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
            </TableHead>

            {/* Table Rows */}
            {isLoading && !shownCoins?.length
              ? new Array(15)
                  .fill(undefined)
                  .map((_, idx) => <CoinListRowIsLoading key={idx} {...{ idx }} />)
              : shownCoins.map((coin, idx) => (
                  <CoinListRow
                    key={coin.id}
                    coin={coin}
                    idx={idx}
                    coins={coins}
                    activeCoin={activeCoin}
                  />
                ))}
          </Table>
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

export interface CoinListRow extends HomeCoinListProps {
  coin: Coin
  idx: number
  activeCoin?: Coin
}
const CoinListRow: FC<CoinListRow> = ({ coin, idx, activeCoin }) => {
  const quotes = coin.latestQuotes.USD
  const priceHighlight =
    quotes.price?.value && Math.abs(1 - quotes.price.value) > 0.01
      ? Math.abs(1 - quotes.price.value) > 0.05
        ? 'red'
        : 'orange'
      : undefined

  return (
    <>
      <TableRow as={Link} href={coin.getRelativeUrl()} active={activeCoin?.id === coin.id ? 1 : 0}>
        <TableCell tw="hidden md:(table-cell pl-2) text-right text-bbg-gray2">{idx + 1}</TableCell>
        <TableCell
          css={[
            tw`uppercase font-semibold text-bbg-orange`,
            activeCoin?.id === coin.id && tw`text-black`,
          ]}
        >
          <Tippy content={coin.name} placement="bottom">
            <div>
              {coin.symbol}
              {!env.isProduction && coin.isDraft && ' 🏗️'}
            </div>
          </Tippy>
        </TableCell>
        <TableCell css={[activeCoin?.id === coin.id ? tw`text-bbg-gray3` : tw`text-bbg-gray1`]}>
          {coin.mechanismFormatted()}
        </TableCell>
        <TableCell isNumber={true} highlight={priceHighlight}>
          <NumericFormat
            value={quotes.price?.value}
            displayType={'text'}
            prefix={'$'}
            fixedDecimalScale={true}
            decimalScale={3}
          />
        </TableCell>
        <TableCell isNumber={true} highlight={priceHighlight}>
          <span tw="md:hidden lg:inline xl:hidden">
            ${largeNumberFormatter(quotes.volume24h?.value)}
          </span>
          <NumericFormat
            tw="hidden md:inline lg:hidden xl:inline"
            value={quotes.volume24h?.value}
            displayType={'text'}
            prefix={'$'}
            decimalScale={0}
            thousandSeparator={true}
          />
        </TableCell>
        <TableCell isNumber={true} highlight={priceHighlight}>
          <span tw="md:hidden lg:inline xl:hidden">
            ${largeNumberFormatter(quotes.marketCap?.value)}
          </span>
          <NumericFormat
            tw="hidden md:inline lg:hidden xl:inline"
            value={quotes.marketCap?.value}
            displayType={'text'}
            prefix={'$'}
            decimalScale={0}
            thousandSeparator={true}
          />
        </TableCell>
        <TableCell tw="hidden md:(table-cell pr-2)" isNumber={true} highlight={priceHighlight}>
          <NumericFormat
            value={quotes.marketCap7dChange && Math.abs(quotes.marketCap7dChange.value * 100)}
            displayType={'text'}
            prefix={(quotes.marketCap7dChange || 0) >= 0 ? '+' : '-'}
            suffix={'%'}
            decimalScale={0}
          />
        </TableCell>
      </TableRow>
    </>
  )
}

const CoinListRowIsLoading: FC<{ idx: number }> = ({ idx }) => {
  return (
    <>
      <TableRowIsLoading idx={idx}>
        <TableCell tw="hidden md:(table-cell)" />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell />
        <TableCell tw="hidden md:(table-cell)" />
      </TableRowIsLoading>
    </>
  )
}
