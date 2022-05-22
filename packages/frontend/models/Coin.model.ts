import { RichTextContent } from '@graphcms/rich-text-types'

export class Coin {
  constructor(
    public id: string,
    public name: string,
    public symbol: string,
    public slug: string,
    public coingeckoId: string,
    public description: RichTextContent | undefined,
    public mechanism: string,
    public jurisdiction: string,
    public issuer: string,
    public governance: string,

    public color: string,
    
    public cmcMetadata: CoinmarketcapMetadata,
    public cmcLatestQuotes: CoinmarketcapLatestQuotes,

    public cgTradingData: CoingeckoTradingData,
  ) { }

  static fromObject(data: any): Coin | null {
    if (!data) return null

    return new Coin(
      data?.['id'] as string,
      data?.['name'] as string,
      data?.['symbol'] as string,
      data?.['slug'] as string,
      data?.['coingeckoId'] as string,
      data?.['description']?.raw as RichTextContent,
      data?.['mechanism'] as string,
      data?.['jurisdiction'] as string,
      data?.['issuer'] as string,
      data?.['governance'] as string,

      data?.['color']?.hex as string,
      
      data?.['cmcMetadata'] as CoinmarketcapMetadata || {},
      data?.['cmcLatestQuotes'] as CoinmarketcapLatestQuotes || {},

      data?.['cgTradingData'] as CoingeckoTradingData || {},
    )
  }

  mechanismFormatted(): string {
    return (this.mechanism || '').replaceAll('_', '-')
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

export type CoingeckoTradingDataPoint = [
  date: string,
  value: number,
]
export interface CoingeckoTradingData {
  updatedAt: string
  prices: Array<CoingeckoTradingDataPoint>
  total_volumes: Array<CoingeckoTradingDataPoint>
  market_caps: Array<CoingeckoTradingDataPoint>
}

export interface CryptopanicNews {
  id: string
  url: string
  title: string
  published_at: string
  is_hot?: boolean
}

