import { AccumulatedCoinsCharts } from '@components/charts/AccumulatedCoinsCharts'
import { ProseWrapper } from '@components/ProseWrapper'
import { datesAreSameDay } from '@shared/datesAreSameDay'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { largeNumberFormatter } from '@shared/largeNumberFormatter'
import dayjs from 'dayjs'
import Link from 'next/link'
import { FC } from 'react'
import NumberFormat from 'react-number-format'
import 'twin.macro'
import tw, { styled } from 'twin.macro'
import { BloombergBox, BloombergBoxHR } from './BloombergBox'

export interface HomeStartPageProps extends ParsedSharedStaticProps {}
export const HomeStartPage: FC<HomeStartPageProps> = ({coins, ...props}) => {

  return <>
    <BloombergBox title="Welcome to stablecoins.wtf, fellow degens!">
      <BloombergBoxHR tw="mt-2.5"/>
      {/* Intro Text */}
      <ProseWrapper>
        {/* <h4 tw="mt-0">WTF! – What can I do here?</h4> */}
        <ul tw="text-sm text-bbg-gray1">
          <li><strong>Select a coin</strong> in the table to get more details. 🪙</li>
          <li><strong>Study our educational content</strong> about stablecoins (lower left). 📚</li>
          <li><Link href="/about" passHref><a>Learn more</a></Link> about this project. ℹ️</li>
        </ul>           
      </ProseWrapper>
      <BloombergBoxHR />

      {/* KPIs */}
      <HomeStartPageKPIs coins={coins} {...props}/>
      
      {/* Accumulated Charts */}
      <AccumulatedCoinsCharts coins={coins} />      
    </BloombergBox>
  </>
}

const KPIsWrapper = styled.div(() => [
  tw`flex flex-wrap -mx-2.5 -mt-0.5 mb-6`,
])
const KPI = styled.div(() => [
  tw`flex-1 m-0.5 bg-bbg-gray3 border-t border-[#404040] p-1 px-2`,
])
const KPITitle = styled.div(() => [
  tw`text-bbg-gray1 text-sm mb-1 whitespace-nowrap `,
])
const KPIContent = styled.div(() => [
  tw`font-semibold`,
])

export const HomeStartPageKPIs: FC<HomeStartPageProps> = ({coins}) => {
  const totalCap = coins.reduce((acc, val): any => {
    const caps = val?.cgTradingData?.market_caps || []
    return acc + caps?.[caps.length - 1][1]
  }, 0)

  const totalCap24hAgo = coins.reduce((acc, val): any => {
    const caps = val?.cgTradingData?.market_caps || []
    let cap24hAgo = 0
    for (let i = caps.length - 1; i >= 0; i--) {
      const is24hAgo = datesAreSameDay(caps[i]?.[0], dayjs().subtract(1, 'day'))
      if (is24hAgo) {
        cap24hAgo = caps[i]?.[1]
        break
      }
    }
    return acc + cap24hAgo
  }, 0)
  const cap24hChange = (totalCap - (totalCap24hAgo || 0)) / (totalCap24hAgo || 1)

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

  return <>
    <h4 tw="text-center mb-4">
      Total Stablecoin Market KPIs
    </h4>
    <KPIsWrapper>
      <KPI>
        <KPITitle>Market Cap</KPITitle>
        <KPIContent>${largeNumberFormatter(totalCap)}</KPIContent>
      </KPI>
      <KPI>
        <KPITitle>Market Cap 24h %</KPITitle>
        <KPIContent css={[
          cap24hChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`
        ]}>
          <NumberFormat value={Math.abs(cap24hChange * 100)} displayType={'text'} prefix={cap24hChange >= 0 ? '+' : '-'} suffix={'%'} decimalScale={2} fixedDecimalScale={true} />
        </KPIContent>
      </KPI>
      <KPI>
        <KPITitle>Market Cap 7d %</KPITitle>
        <KPIContent css={[
          cap7dChange >= 0 ? tw`text-bbg-green1` : tw`text-bbg-red1`
        ]}>
          <NumberFormat value={Math.abs(cap7dChange * 100)} displayType={'text'} prefix={cap7dChange >= 0 ? '+' : '-'} suffix={'%'} decimalScale={2} fixedDecimalScale={true} />
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
}