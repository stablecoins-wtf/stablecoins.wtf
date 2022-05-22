import { AccumulatedCoinsCharts } from '@components/charts/AccumulatedCoinsCharts'
import { ParsedSharedStaticProps } from '@shared/getSharedStaticProps'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeStartPageProps extends ParsedSharedStaticProps {}
export const HomeStartPage: FC<HomeStartPageProps> = ({coins}) => {

  return <>
    <BloombergBox title="Select Stablecoin…">
      <AccumulatedCoinsCharts coins={coins} />
      {/* <ProseWrapper>
        <h3>Welcome fellow degen 👋</h3>
      </ProseWrapper> */}

      
    </BloombergBox>
  </>
}