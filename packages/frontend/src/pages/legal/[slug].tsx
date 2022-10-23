import { ArticleType } from '@models/Article.model'
import ArticleDetailPage from '@pages/articles/[slug]'
import { getArticleTypeStaticPaths } from '@shared/getArticleTypeStaticPaths'
import { getSharedStaticPropsFor, SharedStatisPropsPage } from '@shared/getSharedStaticProps'
import { GetStaticPaths, GetStaticProps } from 'next'

export default ArticleDetailPage

export const getStaticPaths: GetStaticPaths = getArticleTypeStaticPaths(ArticleType.Legal)
export const getStaticProps: GetStaticProps = getSharedStaticPropsFor(SharedStatisPropsPage.LEGAL)
