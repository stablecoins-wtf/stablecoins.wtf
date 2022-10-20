import { ArticleContent } from '@components/article/ArticleContent'
import { BloombergBox } from '@components/home/BloombergBox'
import { HomeLayout } from '@components/home/HomeLayout'
import { ArticleType } from '@models/Article.model'
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
  const { articles, legal } = sharedStaticProps
  const { asPath: path } = useRouter()
  const isArticlePage = path.startsWith('/articles/')
  const isLegalPage = path.startsWith('/legal/')
  const article = [...articles, ...legal].find(
    (a) =>
      (a.articleType === ArticleType.Article && isArticlePage && path.endsWith(a.slug)) ||
      (a.articleType === ArticleType.Legal && isLegalPage && path.endsWith(a.slug)),
  )
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
        nofollow={isLegalPage}
        noindex={isLegalPage}
      />

      <HomeLayout {...sharedStaticProps}>
        <BloombergBox tw="flex-1" title={path} noHeadingMarkup={true} noStickyTopBar={true}>
          <ArticleContent item={article} />
        </BloombergBox>
      </HomeLayout>
    </>
  )
}

export const getStaticPaths: GetStaticPaths = getArticleTypeStaticPaths(ArticleType.Article)
export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.ARTICLE)
