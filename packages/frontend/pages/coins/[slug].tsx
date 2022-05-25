import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeLayout } from '@components/home/HomeLayout'
import { fetchOrGetCoinsData } from '@shared/getAllCoinsAndMetadata'
import { getSharedStaticProps, SharedStaticProps, useSharedStaticProps } from '@shared/getSharedStaticProps'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import PageNotFound404 from 'pages/404'
import React from 'react'
import 'twin.macro'

export default function HomePage({ coinsData, resourcesData }: SharedStaticProps) {
  const router = useRouter()
  const {coins, resources} = useSharedStaticProps({coinsData, resourcesData})
  const { slug } = router.query
  const coin = coins.find(c => c.slug === slug)
  if (!coin) return <PageNotFound404 coinsData={coinsData} resourcesData={resourcesData} />

  return <>
    <NextSeo
      title={coin.symbol}
      description={`Trading-Data and Information about ${coin.name} (${coin.symbol})`}
    />

    <HomeLayout coins={coins} resources={resources}>
      <HomeCoinDetails coin={coin} />
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
