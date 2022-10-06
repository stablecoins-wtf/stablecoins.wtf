import { BloombergBox } from '@components/home/BloombergBox'
import { HomeArticleContent } from '@components/home/HomeArticleContent'
import { HomeLayout } from '@components/home/HomeLayout'
import PageNotFound404 from '@pages/404'
import { fetchOrGetArticles } from '@shared/getAllArticles'
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

export default function ArticleDetailPage({ ...props }: SharedStaticProps) {
  const sharedStaticProps = useSharedStaticProps(props)
  const { query } = useRouter()
  const article = sharedStaticProps.articles.find((a) => a.slug === query.slug)
  if (!article) return <PageNotFound404 {...props} />

  return (
    <>
      <NextSeo
        title={article.title}
        description={
          article.subtitle
            ? `${article.subtitle} – Blog article related to stablecoins & crypto`
            : 'Blog article related to stablecoins & crypto. – Track stablecoin market data & learn about their mechanisms on stablecoins.wtf.'
        }
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="flex-1" title={article.getRelativeUrl()} noHeadingMarkup={true}>
          <HomeArticleContent item={article} />
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = async () => {
  const articlesData = await fetchOrGetArticles()
  const paths = (articlesData || [])
    .filter((articleData: any) => !!articleData?.slug)
    .map((articleData: any) => ({
      params: { slug: articleData.slug },
    }))

  return {
    paths,
    fallback: false,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.ARTICLE)
