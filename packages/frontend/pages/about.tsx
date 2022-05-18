import { HomeAboutPage } from '@components/home/HomeAboutPage'
import { HomeLayout } from '@components/home/HomeLayout'
import { useCoinsData } from '@hooks/useCoinsData'
import { CoinsDataProps, getAllCoinsAndMetadata } from '@shared/getAllCoinsAndMetadata'
import { GetStaticProps } from 'next'
import React from 'react'
import 'twin.macro'

export default function HomePage({ coinsData }: CoinsDataProps) {
  const {coins} = useCoinsData(coinsData)
  
  return <>
    <HomeLayout coins={coins}>
      <HomeAboutPage />
    </HomeLayout>
  </>
}

export const getStaticProps: GetStaticProps = getAllCoinsAndMetadata
