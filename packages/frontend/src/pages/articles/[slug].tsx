import { ArticleContent } from '@components/article/ArticleContent'
import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import { Article, ArticleType } from '@models/Article.model'
import PageNotFound404 from '@pages/404'
import { getArticleTypeStaticPaths } from '@shared/getArticleTypeStaticPaths'
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
  const { articles, legal, resources } = sharedStaticProps
  const { asPath: path, query } = useRouter()
  const item = [...articles, ...legal, ...resources].find(
    (a) => path.startsWith(Article.getArticleTypeBasePath(a.articleType)) && query.slug === a.slug,
  )
  if (!item) return <PageNotFound404 {...props} />

  // Description based on article type
  let description
  if (item.articleType === ArticleType.Article)
    description = item.subtitle
      ? `${item.subtitle} – Blog article related to stablecoins & crypto`
      : 'Blog article related to stablecoins & crypto. – Track stablecoin market data & learn about their mechanisms on stablecoins.wtf.'
  if (item.articleType === ArticleType.Resource)
    description = item.subtitle
      ? `${item.subtitle} – Research and educational content related to stablecoins & crypto`
      : 'Research and educational content related to stablecoins & crypto. – Track stablecoin market data & learn about their mechanisms on stablecoins.wtf.'

  return (
    <>
      <NextSeo
        title={item.title}
        description={description}
        nofollow={item.articleType === ArticleType.Legal}
        noindex={item.articleType === ArticleType.Legal}
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox
          tw="flex-1 lg:overflow-y-scroll"
          title={path}
          noHeadingMarkup={true}
          noStickyTopBar={true}
        >
          <ArticleContent item={item} />
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = getArticleTypeStaticPaths(ArticleType.Article)
export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.ARTICLE)
