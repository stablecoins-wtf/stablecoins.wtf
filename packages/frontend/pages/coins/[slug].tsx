import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeLayout } from '@components/home/HomeLayout'
import { useCoinsData } from '@hooks/useCoinsData'
import { CoinsDataProps, fetchOrGetCoinsData, getAllCoinsAndMetadata } from '@shared/getAllCoinsAndMetadata'
import { GetStaticPaths, GetStaticProps } from 'next'
import { useRouter } from 'next/router'
import PageNotFound404 from 'pages/404'
import React from 'react'
import 'twin.macro'

export default function HomePage({ coinsData }: CoinsDataProps) {
  const router = useRouter()
  const { coins } = useCoinsData(coinsData)
  const { slug } = router.query
  const coin = coins.find(c => c.slug === slug)
  if (!coin) return <PageNotFound404 coinsData={coinsData} />

  return <>
    <HomeLayout coins={coins}>
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

export const getStaticProps: GetStaticProps = getAllCoinsAndMetadata
