import { Coin } from '@models/Coin.model'
import md from 'markdown-it'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({coin}) => {

  return <>
    <BloombergBox>
      <pre>
        {JSON.stringify(coin, null, 2)}
      </pre>

      <hr tw="my-8"/>

      <div tw="prose prose-invert">
        <div dangerouslySetInnerHTML={{ __html: md().render(coin.body) }} />
      </div>
    </BloombergBox>
  </>
}