import { BloombergBox } from '@components/home/BloombergBox'
import { HomeArticleContent } from '@components/home/HomeArticleContent'
import { HomeLayout } from '@components/home/HomeLayout'
import PageNotFound404 from '@pages/404'
import { fetchOrGetResources } from '@shared/getAllResources'
import {
  getSharedStaticPropsFor,
  SharedStaticProps,
  SharedStatisPropsPage,
  useSharedStaticProps,
} from '@shared/getSharedStaticProps'
import { GetStaticPaths, GetStaticProps } from 'next'
import { NextSeo } from 'next-seo'
import { useRouter } from 'next/router'
import 'twin.macro'

export default function ResourceDetailPage({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)
  const { query } = useRouter()
  const resource = sharedStaticProps.resources.find((r) => r.slug === query.slug)
  if (!resource) return <PageNotFound404 {...props} />

  return (
    <>
      <NextSeo
        title={resource.title}
        description={
          resource.subtitle
            ? `${resource.subtitle} – Research and educational content related to stablecoins & crypto`
            : 'Research and educational content related to stablecoins & crypto. – Track stablecoin market data & learn about their mechanisms on stablecoins.wtf.'
        }
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="flex-1" title={resource.getRelativeUrl()} noHeadingMarkup={true}>
          <HomeArticleContent article={resource} />
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const resourcesData = await fetchOrGetResources()
  const paths = (resourcesData || [])
    .filter((resourceData: any) => !!resourceData?.slug)
    .map((resourceData: any) => ({
      params: { slug: resourceData.slug },
    }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(
  SharedStatisPropsPage.RESOURCE,
)
