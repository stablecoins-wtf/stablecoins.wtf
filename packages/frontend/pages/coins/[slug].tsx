import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeLayout } from '@components/home/HomeLayout'
import { Coin } from '@models/Coin.model'
import { fetchOrGetCoinsData } from '@shared/getAllCoinsAndMetadata'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { useUpdatedCgTradingData } from '@shared/useUpdatedCgTradingData'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PageNotFound404 from 'pages/404'
import React, { useEffect, useState } from 'react'
import 'twin.macro'

export default function CoinDetailsPage({ coinsData, resourcesData }: SharedStaticProps) {
  const router = useRouter()
  const { slug } = router.query
  const { coins, resources } = useSharedStaticProps({coinsData, resourcesData})
  const { updatedCoins } = useUpdatedCgTradingData(coins)
  const [activeCoin, setActiveCoin] = useState<Coin | undefined>()
  useEffect(() => {
    setActiveCoin(updatedCoins.find(c => c.slug === slug))
  }, [updatedCoins, slug])

  if (!activeCoin) return <PageNotFound404 coinsData={coinsData} resourcesData={resourcesData} />

  return <>
    <NextSeo
      title={activeCoin.symbol}
      description={`Trading-Data and Information about ${activeCoin.name} (${activeCoin.symbol})`}
    />

    <HomeLayout coins={updatedCoins} resources={resources}>
      <HomeCoinDetails coin={activeCoin} />
    </HomeLayout>
  </>
}

export const getStaticPaths: GetStaticPaths = async () => {
  const coinsData = await fetchOrGetCoinsData()
  const paths = (coinsData || [])
    .filter((coinData: any) => !!coinData?.slug)
    .map((coinData: any) => ({
      params: { slug: coinData.slug }
    }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
