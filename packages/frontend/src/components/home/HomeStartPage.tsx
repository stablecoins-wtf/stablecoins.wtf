import { AccumulatedCoinsCharts } from '@components/charts/AccumulatedCoinsCharts'
import { KPI, KPIContent, KPIsWrapper, KPITitle } from '@components/layout/KPIs'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import { useIsSSR } from '@shared/useIsSSR'
import { useTotalMarketData } from '@shared/useTotalMarketData'
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
  const marketData = useTotalMarketData(coins)
  if (!marketData) return null

  return (
    <>
      <span tw="text-center mb-4 mt-2">Total Stablecoin Market KPIs</span>

      <KPIsWrapper>
        <KPI>
          <KPITitle>Market Cap</KPITitle>
          <KPIContent>${largeNumberFormatter(marketData.marketCap.value)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 7d %</KPITitle>
          <KPIContent
            css={[
              marketData.marketCap7dChange.value >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`,
            ]}
          >
            <NumericFormat
              value={Math.abs(marketData.marketCap7dChange.value * 100)}
              displayType={'text'}
              prefix={marketData.marketCap7dChange.value >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Market Cap 30d %</KPITitle>
          <KPIContent
            css={[
              marketData.marketCap30dChange.value >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`,
            ]}
          >
            <NumericFormat
              value={Math.abs(marketData.marketCap30dChange.value * 100)}
              displayType={'text'}
              prefix={marketData.marketCap30dChange.value >= 0 ? '+' : '-'}
              suffix={'%'}
              decimalScale={2}
              fixedDecimalScale={true}
            />
          </KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 24h</KPITitle>
          <KPIContent>${largeNumberFormatter(marketData.volume24h.value)}</KPIContent>
        </KPI>
        <KPI>
          <KPITitle>Volume 7d</KPITitle>
          <KPIContent>${largeNumberFormatter(marketData.volume7d.value)}</KPIContent>
        </KPI>
      </KPIsWrapper>
    </>
  )
}
