import { RichTextContent } from '@graphcms/rich-text-types'
import { env } from '@shared/environment'
import { Coin } from './Coin.model'

export enum ArticleType {
  Article = 'Article',
  Resource = 'Resource',
  Legal = 'Legal',
}

export class Article {
  public relatedCoins: Coin[] = []

  constructor(
    public id: string,
    public isDraft: boolean,
    public articleType: ArticleType,
    public createdAt: Date,
    public createdAtOverwrite: Date | undefined,
    public updatedAt: Date,
    public title: string,
    public subtitle: string,
    public slug: string,
    public content: RichTextContent | undefined,
    public tags: string[],
    public relatedTweetId: string | undefined,
  ) {}

  static fromObject(data: any): Article | null {
    if (!data) return null

    return new Article(
      data?.['id'] as string,
      !data?.['documentInStages']?.length && !env.isProduction,
      data?.['articleType'] as ArticleType,
      new Date(data?.['createdAt']),
      data?.['createdAtOverwrite'] && new Date(data?.['createdAtOverwrite']),
      new Date(data?.['updatedAt']),
      data?.['title'] as string,
      data?.['subtitle'] as string,
      data?.['slug'] as string,
      data?.['content']?.raw as RichTextContent,
      (data?.['tags'] || []) as string[],
      data?.['relatedTweetId'] as string,
    )
  }

  getRelativeUrl(): string {
    return `/articles/${this.slug}`
  }

  initRelatedCoins(data: any, allCoins: Coin[], setReverse?: boolean) {
    // Filter & set related coins
    const relatedCoins: Coin[] = (data?.['relatedCoins'] || [])
      .map(({ id }: any) => (allCoins || []).find((c) => c.id === id))
      .filter(Boolean)
    this.relatedCoins = relatedCoins

    // Set reserve direction (if given)
    if (setReverse) {
      this.relatedCoins.map((c) => c.relatedArticles.push(this))
    }
  }
}
