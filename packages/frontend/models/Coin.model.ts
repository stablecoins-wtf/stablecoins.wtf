import { RichTextContent } from '@graphcms/rich-text-types'

export class Coin {
  constructor(
    public id: string,
    public name: string,
    public symbol: string,
    public slug: string,
    public description: RichTextContent | undefined,

    public cmcMetadata: CoinmarketcapMetadata,
    public cmcLatestQuotes: CoinmarketcapLatestQuotes,
    public cpNews: CoinpanicNews[],
  ) { }

  static fromObject(data: any): Coin | null {
    if (!data) return null

    return new Coin(
      data?.['id'] as string,
      data?.['name'] as string,
      data?.['symbol'] as string,
      data?.['slug'] as string,
      data?.['description']?.raw as RichTextContent,
      data?.['cmcMetadata'] as CoinmarketcapMetadata || {},
      data?.['cmcLatestQuotes'] as CoinmarketcapLatestQuotes || {},
      data?.['cpNews'] as CoinpanicNews[] || [],
    )
  }
}

export interface CoinmarketcapMetadata {
  [_: string]: any,
}

export interface CoinmarketcapLatestQuotes {
  [_: string]: any,
}

export interface CoinpanicNews {
  id: string
  url: string
  title: string
  published_at: string
}