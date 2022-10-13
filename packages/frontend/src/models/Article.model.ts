import { RichTextContent } from '@graphcms/rich-text-types'
import { Coin } from './Coin.model'

export class Article {
  constructor(
    public id: string,
    public isDraft: boolean,
    public createdAt: Date,
    public createdAtOverwrite: Date | undefined,
    public updatedAt: Date,
    public title: string,
    public subtitle: string,
    public slug: string,
    public content: RichTextContent | undefined,
    public tags: string[],
    public relatedCoins: Coin[],
  ) {}

  static fromObject(data: any, coins?: Coin[]): Article | null {
    if (!data) return null

    const relatedCoins = (data?.['relatedCoins'] || []).map(({ id }: any) =>
      (coins || []).find((c) => c.id === id),
    )

    return new Article(
      data?.['id'] as string,
      !data?.['documentInStages']?.length,
      new Date(data?.['createdAt']),
      data?.['createdAtOverwrite'] && new Date(data?.['createdAtOverwrite']),
      new Date(data?.['updatedAt']),
      data?.['title'] as string,
      data?.['subtitle'] as string,
      data?.['slug'] as string,
      data?.['content']?.raw as RichTextContent,
      (data?.['tags'] || []) as string[],
      relatedCoins,
    )
  }

  getRelativeUrl(): string {
    return `/articles/${this.slug}`
  }
}
