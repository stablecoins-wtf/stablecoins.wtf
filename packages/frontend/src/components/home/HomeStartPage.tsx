import { AccumulatedCoinsCharts } from '@components/charts/AccumulatedCoinsCharts'
import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { datesAreSameDay } from '@shared/datesAreSameDay'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import { useIsSSR } from '@shared/useIsSSR'
import dayjs from 'dayjs'
import { FC } from 'react'
import { useCookies } from 'react-cookie'
import { NumericFormat } from 'react-number-format'
import tw from 'twin.macro'
import { BloombergBox } from './BloombergBox'
import { HomeIntroBox } from './HomeIntroBox'

export interface HomeStartPageProps extends ParsedSharedStaticProps {}
export const HomeStartPage: FC<HomeStartPageProps> = ({ coins, ...props }) => {
  const [cookies] = useCookies(['hide-intro'])
  const isSSR = useIsSSR()

  const test = true
  return (
    <>
      <div tw="flex flex-col overflow-hidden space-y-1">
        {/* Intro Box */}
        {!(cookies['hide-intro'] === 'true' && !isSSR) && <HomeIntroBox />}

        {/* Main Page */}
        <BloombergBox tw="flex-1 flex flex-col" title="Total Stablecoin Market KPIs">
          {/* KPIs */}
          <HomeStartPageKPIs coins={coins} {...props} />

          {/* Accumulated Charts */}
          <AccumulatedCoinsCharts coins={coins} />
        </BloombergBox>
      </div>
    </>
  )
}

export const HomeStartPageKPIs: FC<HomeStartPageProps> = ({ coins }) => {
  const totalCap = coins.reduce((acc, val): any => {
    const caps = val?.cgTradingData?.market_caps || []
    return acc + caps?.[caps.length - 1][1]
  }, 0)

  const totalCap7dAgo = coins.reduce((acc, val): any => {
    const caps = val?.cgTradingData?.market_caps || []
    let cap7dAgo = 0
    for (let i = caps.length - 1; i >= 0; i--) {
      const is7dAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(7, 'day'))
      if (is7dAgo) {
        cap7dAgo = caps[i]?.[1]
        break
      }
    }
    return acc + cap7dAgo
  }, 0)
  const cap7dChange = (totalCap - (totalCap7dAgo || 0)) / (totalCap7dAgo || 1)

  const totalCap30dAgo = coins.reduce((acc, val): any => {
    const caps = val?.cgTradingData?.market_caps || []
    let cap30dAgo = 0
    for (let i = caps.length - 1; i >= 0; i--) {
      const is30dAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(30, 'day'))
      if (is30dAgo) {
        cap30dAgo = caps[i]?.[1]
        break
      }
    }
    return acc + cap30dAgo
  }, 0)
  const cap30dChange = (totalCap - (totalCap30dAgo || 0)) / (totalCap30dAgo || 1)

  const volume24h = coins.reduce((acc, val): any => {
    return acc + val?.cmcLatestQuotes?.quote?.USD?.volume_24h || 0
  }, 0)

  const volume7d = coins.reduce((acc, val): any => {
    const volumes = val?.cgTradingData?.total_volumes || []
    let accVolume = 0
    for (let i = volumes.length - 1; i >= 0; i--) {
      if (dayjs().diff(volumes[i]?.[0], 'day') > 7) break
      accVolume += volumes[i]?.[1]
    }
    return acc + accVolume
  }, 0)

  return (
    <>
      <h4 tw="text-center mb-4">Total Stablecoin Market KPIs</h4>

      <KPIsWrapper>
        <KPI>
          <KPITitle>Market Cap</KPITitle>
          <KPIContent>${largeNumberFormatter(totalCap)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 7d %</KPITitle>
          <KPIContent css={[cap7dChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}>
            <NumericFormat
              value={Math.abs(cap7dChange * 100)}
              displayType={'text'}
              prefix={cap7dChange >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 30d %</KPITitle>
          <KPIContent css={[cap30dChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`]}>
            <NumericFormat
              value={Math.abs(cap30dChange * 100)}
              displayType={'text'}
              prefix={cap30dChange >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 24h</KPITitle>
          <KPIContent>${largeNumberFormatter(volume24h)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 7d</KPITitle>
          <KPIContent>${largeNumberFormatter(volume7d)}</KPIContent>
        </KPI>
      </KPIsWrapper>
    </>
  )
}
