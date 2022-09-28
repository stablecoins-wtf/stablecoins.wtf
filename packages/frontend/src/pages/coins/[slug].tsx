import { HomeCoinDetails } from '@components/home/HomeCoinDetails'
import { HomeLayout } from '@components/home/HomeLayout'
import PageNotFound404 from '@pages/404'
import { fetchOrGetCoinsData } from '@shared/getAllCoinsAndMetadata'
import {
  getSharedStaticProps,
  SharedStaticProps,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import 'twin.macro'

export default function CoinDetailsPage({ ...props }: SharedStaticProps) {
  const router = useRouter()
  const { slug } = router.query
  const sharedStaticProps = useSharedStaticProps(props)
  const activeCoin = sharedStaticProps.coins.find((c) => c.slug === slug)
  if (!activeCoin) return <PageNotFound404 {...props} />

  return (
    <>
      <NextSeo
        title={activeCoin.symbol}
        description={`Trading-Data and Information about ${activeCoin.name} (${activeCoin.symbol})`}
      />

      <HomeLayout {...sharedStaticProps}>
        <HomeCoinDetails coin={activeCoin} />
      </HomeLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const coinsData = await fetchOrGetCoinsData()
  const paths = (coinsData || [])
    .filter((coinData: any) => !!coinData?.slug)
    .map((coinData: any) => ({
      params: { slug: coinData.slug },
    }))

  return {
    paths,
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
