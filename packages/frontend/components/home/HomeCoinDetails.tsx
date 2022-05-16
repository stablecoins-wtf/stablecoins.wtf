import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin } from '@models/Coin.model'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({coin}) => {
  return <>
    <BloombergBox title={coin.name}>
      {coin.description &&
        <div tw="prose prose-invert">
          <RichText content={coin.description} />
        </div>
      }
      <pre tw="text-xs leading-[1.3] text-bbg-gray1">
        {JSON.stringify(coin, null, 2)}
      </pre>
    </BloombergBox>
  </>
}