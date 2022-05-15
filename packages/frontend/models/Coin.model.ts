export class Coin {
  constructor(
    public id: string,
    public name: string,
    public symbol: string,
    public slug: string,
    public address: string,
    public body: string,
  ) { }

  static fromObject(data: any): Coin | null {
    if (!data) return null

    return new Coin(
      data?.['id'] as string,
      data?.['name'] as string,
      data?.['symbol'] as string,
      data?.['slug'] as string,
      data?.['address'] as string,
      data?.['body'] as string,
    )
  }
}