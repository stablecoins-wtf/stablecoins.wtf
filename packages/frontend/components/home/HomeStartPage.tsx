import { AccumulatedCoinsCharts } from '@components/charts/AccumulatedCoinsCharts'
import { ProseWrapper } from '@components/ProseWrapper'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import Link from 'next/link'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox, BloombergBoxHR } from './BloombergBox'

export interface HomeStartPageProps extends ParsedSharedStaticProps {}
export const HomeStartPage: FC<HomeStartPageProps> = ({coins}) => {

  return <>
    <BloombergBox title="Welcome to stablecoins.wtf, fellow degens!">
      <BloombergBoxHR tw="mt-2.5"/>

      <ProseWrapper>
        {/* <h4 tw="mt-0">WTF! – What can I do here?</h4> */}
        <ul tw="text-sm text-bbg-gray1">
          <li><strong>Select a coin</strong> in the table to get more details. 🪙</li>
          <li><strong>Study our educational content</strong> about stablecoins (lower left). 📚</li>
          <li><Link href="/about" passHref><a>Learn more</a></Link> about this project. ℹ️</li>
        </ul>           
      </ProseWrapper>

      <BloombergBoxHR />



      <AccumulatedCoinsCharts coins={coins} />

      
    </BloombergBox>
  </>
}