import { RichText } from '@graphcms/rich-text-react-renderer'
import { Coin } from '@models/Coin.model'
import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeCoinDetailsProps {
  coin: Coin
}
export const HomeCoinDetails: FC<HomeCoinDetailsProps> = ({coin}) => {
  console.log('Details opened for:', {coin})

  return <>
    <BloombergBox title={coin.name}>
      {coin.description &&
        <div tw="prose prose-invert">
          <RichText content={coin.description} />
        </div>
      }
    </BloombergBox>
  </>
}