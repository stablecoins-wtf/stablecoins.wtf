import { RichTextContent } from '@graphcms/rich-text-types'
import { Article } from './Article.model'
import { Coin } from './Coin.model'

export class Resource extends Article {
  static fromObject(data: any, coins?: Coin[]): Resource | null {
    if (!data) return null

    const relatedCoins = (data?.['relatedCoins'] || []).map(({ id }: any) =>
      (coins || []).find((c) => c.id === id),
    )

    return new Resource(
      data?.['id'] as string,
      !data?.['documentInStages']?.length,
      new Date(data?.['createdAt']),
      undefined,
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
    return `/resources/${this.slug}`
  }
}
