import { BloombergBox } from '@components/home/BloombergBox'
import { HomeArticleContent } from '@components/home/HomeArticleContent'
import { HomeLayout } from '@components/home/HomeLayout'
import PageNotFound404 from '@pages/404'
import { fetchOrGetArticles } from '@shared/getAllArticles'
import {
  getSharedStaticProps,
  SharedStaticProps,
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
        description={article.subtitle || 'Blog article related to stablecoins'}
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="flex-1" title={article.getRelativeUrl()}>
          <HomeArticleContent article={article} />
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
    fallback: true,
  }
}

export const getStaticProps: GetStaticProps = getSharedStaticProps
