import { FC } from 'react'
import 'twin.macro'
import { BloombergBox } from './BloombergBox'

export interface HomeAboutPageProps {}
export const HomeAboutPage: FC<HomeAboutPageProps> = () => {

  return <>
    <BloombergBox title="About stablecoins.wtf">
      <p>Maecenas faucibus mollis interdum. Morbi leo risus, porta ac consectetur ac, vestibulum at eros. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor. Cum sociis natoque penatibus et magnis dis parturient montes, nascetur ridiculus mus. Aenean lacinia bibendum nulla sed consectetur. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum. Vivamus sagittis lacus vel augue laoreet rutrum faucibus dolor auctor.</p>
    </BloombergBox>
  </>
}