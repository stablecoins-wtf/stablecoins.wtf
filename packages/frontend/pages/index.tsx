import { HomeLayout } from '@components/home/HomeLayout'
import { HomeStartPage } from '@components/home/HomeStartPage'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { useUpdatedCgTradingData } from '@shared/useUpdatedCgTradingData'
import { GetStaticProps } from 'next'
import React from 'react'
import 'twin.macro'

export interface HomePageProps extends SharedStaticProps {}
export default function HomePage({...props}: HomePageProps) {
  const { coins, ...sharedStaticProps } = useSharedStaticProps(props)
  const { updatedCoins } = useUpdatedCgTradingData(coins)
  
  return <>
    <HomeLayout {...sharedStaticProps} coins={updatedCoins} >
      <HomeStartPage {...sharedStaticProps} coins={updatedCoins} />
    </HomeLayout>
  </>
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
