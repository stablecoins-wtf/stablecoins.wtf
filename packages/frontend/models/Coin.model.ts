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

    public cvPriceHistory: CovalentPriceHistory,
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
      
      data?.['cvPriceHistory'] as CovalentPriceHistory || {},
    )
  }
}

export interface CoinmarketcapMetadata {
  updatedAt: string
  [_: string]: any,
}

export interface CoinmarketcapLatestQuotes {
  updatedAt: string
  [_: string]: any,
}

export interface CovalentPriceHistory {
  updatedAt: string
  prices: Array<{
    date: string
    price: number
  }>
}

export interface CryptopanicNews {
  id: string
  url: string
  title: string
  published_at: string
}